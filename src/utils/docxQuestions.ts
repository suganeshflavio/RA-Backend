import JSZip from "jszip";
import mammoth from "mammoth";
import { DOMParser, XMLSerializer, type Element } from "@xmldom/xmldom";
import { HTMLElement, Node as HtmlNode, NodeType, parse } from "node-html-parser";
import { OMML_NAMESPACE, ommlToLatex } from "./ommlToLatex";
import { renderMath } from "./richText";

const W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

// Equations are swapped for this marker before mammoth runs (mammoth drops
// Word equations), then rendered back in once the text is split up.
const mathMarker = (index: number) => `⟦MATH_${index}⟧`;
const MATH_MARKER = /⟦MATH_(\d+)⟧/g;

export const DOCX_IMAGE_SRC_PREFIX = "docx-image:";

const QUESTION_LABEL = /^\s*(?:Q(?:uestion)?\s*\.?\s*(\d{1,3})\s*[.):\-–]?|(\d{1,3})\s*[.)](?!\d))\s*/i;
const OPTION_LABEL = /^\s*\(?([A-Da-d])\s*[).:]\s*/;
const INLINE_OPTION_LABEL = /(?:^|\s)\(?([A-Da-d])\)\s*/g;
const ANSWER_LABEL = /^\s*(?:Answer|Ans|Correct\s+(?:answer|option)|Key)\s*[:.\-–]?\s*\(?([A-Da-d])\)?(?=[\s.,)]|$)/i;
const EXPLANATION_LABEL = /^\s*(?:Explanation|Solution|Reason|Hint)\s*[:.\-–]\s*/i;
// "1. B   2. C, 3-(a)" — a line made only of answer-key pairs
const ANSWER_KEY_LINE = /^(?:\s*Q?\s*\d{1,3}\s*[.):\-–]\s*\(?[A-Da-d]\)?\s*[,;]?)+\s*$/i;
const ANSWER_KEY_PAIR = /Q?\s*(\d{1,3})\s*[.):\-–]\s*\(?([A-Da-d])\)?/gi;
const ANSWER_KEY_HEADING = /^\s*(?:answer\s*key|answers|key)\s*[:.\-–]?\s*$/i;

const INLINE_TAGS = new Set(["strong", "b", "em", "i", "u", "s", "sup", "sub", "br", "img"]);
const CONTAINER_TAGS = new Set(["table", "thead", "tbody", "tfoot", "tr", "td", "th"]);
const BLOCK_TAGS = new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul", "table", "li"]);

type Letter = "A" | "B" | "C" | "D";

const LETTERS: Letter[] = ["A", "B", "C", "D"];

export interface DocxImage {
  index: number;
  contentType: string;
  buffer: Buffer;
}

export interface DocxQuestion {
  number: string;
  // rich-text HTML; images still point at docx-image:<index>
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: Letter;
  explanation: string;
}

interface Block {
  html: string;
  text: string;
  // set for paragraphs that came from a Word numbered list
  listDepth?: number;
}

interface Draft {
  number: string;
  question: string[];
  options: Partial<Record<Letter, string[]>>;
  answer?: Letter;
  explanation: string[];
}

// Replaces every Word equation in document.xml with a text marker and returns
// the equations as LaTeX, indexed by marker number.
const extractEquations = async (zip: JSZip): Promise<string[]> => {
  const file = zip.file("word/document.xml");
  if (!file) throw new Error("word/document.xml missing");

  const doc = new DOMParser().parseFromString(await file.async("string"), "text/xml");
  const equations: string[] = [];

  const replace = (node: Element) => {
    const run = doc.createElementNS(W_NS, "w:r");
    const text = doc.createElementNS(W_NS, "w:t");
    text.setAttribute("xml:space", "preserve");
    text.appendChild(doc.createTextNode(mathMarker(equations.length)));
    run.appendChild(text);
    equations.push(ommlToLatex(node));
    node.parentNode?.replaceChild(run, node);
  };

  // display equations first, so their inner <m:oMath> aren't handled twice
  for (const node of Array.from(doc.getElementsByTagNameNS(OMML_NAMESPACE, "oMathPara"))) {
    replace(node);
  }
  for (const node of Array.from(doc.getElementsByTagNameNS(OMML_NAMESPACE, "oMath"))) {
    replace(node);
  }

  zip.file("word/document.xml", new XMLSerializer().serializeToString(doc));

  return equations;
};

// Removes the first `count` text characters from an HTML fragment, leaving
// its tags in place (so "<strong>Q1.</strong> Text" loses just "Q1.").
const dropLeadingText = (html: string, count: number): string => {
  let remaining = count;
  let out = "";
  let i = 0;

  while (i < html.length) {
    const char = html[i]!;
    if (char === "<") {
      const end = html.indexOf(">", i);
      out += html.slice(i, end + 1);
      i = end + 1;
    } else if (remaining > 0) {
      i = char === "&" && html.indexOf(";", i) > i ? html.indexOf(";", i) + 1 : i + 1;
      remaining--;
    } else {
      out += html.slice(i);
      break;
    }
  }

  return out;
};

// Splits an HTML fragment at text-character offsets, re-balancing tags.
const splitAtText = (html: string, offsets: number[]): string[] => {
  const parts: string[] = [];
  let current = "";
  let textIndex = 0;
  let cut = 0;
  let i = 0;

  while (i < html.length) {
    if (cut < offsets.length && textIndex === offsets[cut]) {
      parts.push(current);
      current = "";
      cut++;
      continue;
    }

    const char = html[i]!;
    if (char === "<") {
      const end = html.indexOf(">", i);
      current += html.slice(i, end + 1);
      i = end + 1;
    } else {
      const next = char === "&" && html.indexOf(";", i) > i ? html.indexOf(";", i) + 1 : i + 1;
      current += html.slice(i, next);
      i = next;
      textIndex++;
    }
  }

  parts.push(current);
  while (parts.length < offsets.length + 1) parts.push("");

  return parts.map((part) => parse(part).toString());
};

// Keeps only simple inline formatting and images; links and anything else
// mammoth emits are unwrapped to their text.
const sanitizeInline = (html: string): string => {
  const root = parse(html);

  const clean = (node: HtmlNode): string => {
    if (node.nodeType === NodeType.TEXT_NODE) return node.toString();
    if (!(node instanceof HTMLElement)) return "";

    const tag = node.tagName?.toLowerCase();
    const inner = node.childNodes.map(clean).join("");

    if (!tag || !INLINE_TAGS.has(tag)) return inner;
    if (tag === "br") return "<br>";
    if (tag === "img") {
      const src = node.getAttribute("src") ?? "";
      return src.startsWith(DOCX_IMAGE_SRC_PREFIX) ? `<img src="${src}">` : "";
    }
    if (!inner.trim()) return inner;

    const normalized = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
    return `<${normalized}>${inner}</${normalized}>`;
  };

  return root.childNodes.map(clean).join("");
};

const collectBlocks = (root: HTMLElement): Block[] => {
  const blocks: Block[] = [];

  const visit = (parent: HTMLElement, listDepth?: number) => {
    for (const node of parent.childNodes) {
      if (!(node instanceof HTMLElement)) continue;

      const tag = node.tagName?.toLowerCase() ?? "";

      if (CONTAINER_TAGS.has(tag)) {
        visit(node, listDepth);
      } else if (tag === "ol" || tag === "ul") {
        for (const item of node.childNodes) {
          if (!(item instanceof HTMLElement) || item.tagName?.toLowerCase() !== "li") continue;

          const depth = listDepth === undefined ? 0 : listDepth + 1;
          const inline = item.childNodes.filter((child) => !(child instanceof HTMLElement) || !BLOCK_TAGS.has(child.tagName?.toLowerCase() ?? ""));
          const inlineHtml = inline.map((child) => child.toString()).join("");
          const inlineText = inline.map((child) => child.text).join("");

          if (tag === "ol" ? true : inlineText.trim() || inlineHtml.includes("<img")) {
            blocks.push({ html: inlineHtml, text: inlineText, ...(tag === "ol" ? { listDepth: depth } : {}) });
          }

          visit(item, depth);
        }
      } else {
        blocks.push({ html: node.innerHTML, text: node.text });
      }
    }
  };

  visit(root);

  return blocks;
};

/**
 * Reads MCQs out of a Word document laid out like the sample template:
 * numbered questions, options A)-D), "Answer:" and optional "Explanation:"
 * lines. Word equations become KaTeX math; pictures are returned separately
 * and referenced from the HTML as docx-image:<index>.
 */
export const parseDocxQuestions = async (docx: Buffer) => {

  const zip = await JSZip.loadAsync(docx);
  const equations = await extractEquations(zip);
  const prepared = await zip.generateAsync({ type: "nodebuffer" });

  const images: DocxImage[] = [];

  const { value: html } = await mammoth.convertToHtml(
    { buffer: prepared },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        const index = images.length;
        images.push({ index, contentType: image.contentType, buffer: await image.readAsBuffer() });
        return { src: `${DOCX_IMAGE_SRC_PREFIX}${index}` };
      }),
    },
  );

  const blocks = collectBlocks(parse(html));
  const warnings: string[] = [];
  const drafts: Draft[] = [];
  const answerKey = new Map<string, Letter>();

  let current: Draft | null = null;
  let field: "question" | Letter | "explanation" = "question";
  // after an "Answer key" heading only key lines count, until the next question
  let inAnswerKey = false;

  const append = (target: string[], content: string) => {
    if (content.replace(/<br>/g, "").trim()) target.push(content);
  };

  const appendToField = (content: string) => {
    if (!current) return;
    if (field === "question") append(current.question, content);
    else if (field === "explanation") append(current.explanation, content);
    else append((current.options[field] ??= []), content);
  };

  for (const block of blocks) {
    const text = block.text.replace(/ /g, " ");
    const trimmed = text.trim();

    if (!trimmed && !block.html.includes("<img")) continue;

    if (ANSWER_KEY_HEADING.test(trimmed)) {
      inAnswerKey = true;
      continue;
    }

    if (ANSWER_KEY_LINE.test(trimmed) && (inAnswerKey || !current || Object.keys(current.options).length === 4)) {
      for (const pair of trimmed.matchAll(ANSWER_KEY_PAIR)) {
        answerKey.set(pair[1]!, pair[2]!.toUpperCase() as Letter);
      }
      continue;
    }

    const questionStart = text.match(QUESTION_LABEL);

    if (inAnswerKey && !questionStart) continue;

    const answer = current ? text.match(ANSWER_LABEL) : null;
    if (current && answer) {
      current.answer = answer[1]!.toUpperCase() as Letter;
      const rest = text.slice(answer[0].length).replace(/^[\s.,;:)\-–]+/, "");
      const explanation = rest.match(EXPLANATION_LABEL);
      field = "explanation";
      if (explanation) {
        append(current.explanation, dropLeadingText(block.html, text.length - rest.length + explanation[0].length));
      }
      continue;
    }

    const explanation = current ? text.match(EXPLANATION_LABEL) : null;
    if (current && explanation) {
      field = "explanation";
      append(current.explanation, dropLeadingText(block.html, explanation[0].length));
      continue;
    }

    const optionLabel = text.match(OPTION_LABEL);
    const inOptionArea = current && field !== "explanation" && !current.answer;
    const listOption = inOptionArea && block.listDepth !== undefined && block.listDepth > 0 && !optionLabel;

    if (current && inOptionArea && (optionLabel || listOption)) {
      if (listOption) {
        const next = LETTERS.find((letter) => !current!.options[letter]);
        if (next) {
          field = next;
          append((current.options[next] = []), block.html);
        }
        continue;
      }

      // one or more options in this paragraph, e.g. "A) Java   B) Dart"
      const first = optionLabel![1]!.toUpperCase() as Letter;
      const labels = [{ letter: first, start: 0, length: optionLabel![0].length }];
      for (const match of text.matchAll(INLINE_OPTION_LABEL)) {
        const letter = match[1]!.toUpperCase() as Letter;
        const previous = labels[labels.length - 1]!;
        if (match.index! > previous.start && LETTERS.indexOf(letter) === LETTERS.indexOf(previous.letter) + 1) {
          labels.push({ letter, start: match.index!, length: match[0].length });
        }
      }

      const pieces = splitAtText(block.html, labels.slice(1).map((label) => label.start));
      labels.forEach((label, index) => {
        if (current!.options[label.letter]) {
          warnings.push(`Question ${current!.number}: option ${label.letter} appears more than once; the last one was kept.`);
        }
        current!.options[label.letter] = [];
        append(current!.options[label.letter]!, dropLeadingText(pieces[index]!, label.length));
        field = label.letter;
      });
      continue;
    }

    const questionLabel = questionStart;
    const listQuestion = block.listDepth === 0 && !optionLabel;

    if (questionLabel || listQuestion) {
      if (current) drafts.push(current);
      inAnswerKey = false;
      const number = questionLabel ? questionLabel[1] ?? questionLabel[2]! : String(drafts.length + 1);
      current = { number, question: [], options: {}, explanation: [] };
      field = "question";
      append(current.question, questionLabel ? dropLeadingText(block.html, questionLabel[0].length) : block.html);
      continue;
    }

    // anything before the first question (title, instructions) is ignored
    appendToField(block.html);
  }

  if (current) drafts.push(current);

  const finish = (parts: string[] = []) => {
    const html = sanitizeInline(parts.join("<br>"))
      .replace(MATH_MARKER, (_, index: string) => renderMath(equations[Number(index)] ?? ""))
      .replace(/^(?:\s|<br>)+|(?:\s|<br>)+$/g, "");
    return html ? `<p>${html}</p>` : "";
  };

  const questions: DocxQuestion[] = [];

  for (const draft of drafts) {
    const correctOption = draft.answer ?? answerKey.get(draft.number);
    const options = LETTERS.map((letter) => finish(draft.options[letter]));
    const question = finish(draft.question);
    const missing = LETTERS.filter((_, index) => !options[index]);

    if (!question) {
      warnings.push(`Question ${draft.number}: skipped because the question text is empty.`);
    } else if (missing.length > 0) {
      warnings.push(`Question ${draft.number}: skipped because option${missing.length > 1 ? "s" : ""} ${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} missing.`);
    } else if (!correctOption) {
      warnings.push(`Question ${draft.number}: skipped because no "Answer:" line was found.`);
    } else {
      questions.push({
        number: draft.number,
        question,
        optionA: options[0]!,
        optionB: options[1]!,
        optionC: options[2]!,
        optionD: options[3]!,
        correctOption,
        explanation: finish(draft.explanation),
      });
    }
  }

  return { questions, images, warnings };

};
