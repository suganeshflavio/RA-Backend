import type { Element } from "@xmldom/xmldom";

// Converts Word equations (Office Math Markup, the <m:oMath> elements inside a
// .docx) to LaTeX for KaTeX. Covers the structures Word's equation editor
// produces: fractions, scripts, radicals, n-ary operators (integrals, sums),
// delimiters, functions, accents, bars, limits, matrices and equation arrays.

const M_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math";

const FUNCTION_NAMES = new Set([
  "sin", "cos", "tan", "cot", "sec", "csc",
  "arcsin", "arccos", "arctan",
  "sinh", "cosh", "tanh", "coth",
  "log", "ln", "lg", "exp", "lim", "max", "min", "sup", "inf",
  "det", "gcd", "deg", "dim", "arg", "ker",
]);

const NARY_OPERATORS: Record<string, string> = {
  "∫": "\\int", "∬": "\\iint", "∭": "\\iiint", "∮": "\\oint",
  "∑": "\\sum", "∏": "\\prod", "∐": "\\coprod",
  "⋃": "\\bigcup", "⋂": "\\bigcap", "⋁": "\\bigvee", "⋀": "\\bigwedge",
};

const ACCENTS: Record<string, string> = {
  "̂": "\\hat", "̃": "\\tilde", "̇": "\\dot", "̈": "\\ddot",
  "⃗": "\\vec", "̅": "\\bar", "̄": "\\bar", "̆": "\\breve", "̌": "\\check",
};

const DELIMITERS: Record<string, string> = {
  "(": "(", ")": ")", "[": "[", "]": "]", "{": "\\{", "}": "\\}",
  "|": "|", "‖": "\\|", "⟨": "\\langle", "⟩": "\\rangle",
  "⌊": "\\lfloor", "⌋": "\\rfloor", "⌈": "\\lceil", "⌉": "\\rceil",
};

const SYMBOLS: Record<string, string> = {
  "−": "-", "×": "\\times ", "÷": "\\div ", "±": "\\pm ", "∓": "\\mp ", "·": "\\cdot ", "⋅": "\\cdot ",
  "≤": "\\le ", "≥": "\\ge ", "≠": "\\ne ", "≈": "\\approx ", "≡": "\\equiv ", "≅": "\\cong ", "∼": "\\sim ",
  "∝": "\\propto ", "→": "\\rightarrow ", "←": "\\leftarrow ", "↔": "\\leftrightarrow ",
  "⇒": "\\Rightarrow ", "⇐": "\\Leftarrow ", "⇔": "\\Leftrightarrow ", "⇌": "\\rightleftharpoons ",
  "∞": "\\infty ", "°": "^{\\circ}", "∠": "\\angle ", "△": "\\triangle ", "⊥": "\\perp ", "∥": "\\parallel ",
  "∴": "\\therefore ", "∵": "\\because ", "∈": "\\in ", "∉": "\\notin ", "⊂": "\\subset ", "⊆": "\\subseteq ",
  "⊃": "\\supset ", "⊇": "\\supseteq ", "∪": "\\cup ", "∩": "\\cap ", "∅": "\\emptyset ", "∀": "\\forall ",
  "∃": "\\exists ", "∂": "\\partial ", "∇": "\\nabla ", "′": "'", "″": "''", "…": "\\ldots ", "⋯": "\\cdots ",
  "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ", "ε": "\\varepsilon ", "ϵ": "\\epsilon ",
  "ζ": "\\zeta ", "η": "\\eta ", "θ": "\\theta ", "ϑ": "\\vartheta ", "ι": "\\iota ", "κ": "\\kappa ",
  "λ": "\\lambda ", "μ": "\\mu ", "ν": "\\nu ", "ξ": "\\xi ", "π": "\\pi ", "ρ": "\\rho ", "σ": "\\sigma ",
  "τ": "\\tau ", "υ": "\\upsilon ", "φ": "\\phi ", "ϕ": "\\phi ", "χ": "\\chi ", "ψ": "\\psi ", "ω": "\\omega ",
  "Γ": "\\Gamma ", "Δ": "\\Delta ", "Θ": "\\Theta ", "Λ": "\\Lambda ", "Ξ": "\\Xi ", "Π": "\\Pi ",
  "Σ": "\\Sigma ", "Φ": "\\Phi ", "Ψ": "\\Psi ", "Ω": "\\Omega ",
  "#": "\\#", "$": "\\$", "%": "\\%", "&": "\\&", "_": "\\_", "{": "\\{", "}": "\\}", "~": "\\sim ",
  "\\": "\\backslash ",
};

const escapeMathText = (text: string) =>
  Array.from(text, (char) => SYMBOLS[char] ?? char).join("");

const childElements = (node: Element): Element[] =>
  Array.from(node.childNodes).filter((child): child is Element => child.nodeType === 1);

const isMath = (node: Element, localName: string) =>
  node.namespaceURI === M_NS && node.localName === localName;

const child = (node: Element, localName: string) =>
  childElements(node).find((element) => isMath(element, localName));

// e.g. <m:naryPr><m:chr m:val="∑"/></m:naryPr>
const propertyValue = (node: Element, propsName: string, localName: string): string | null => {
  const props = child(node, propsName);
  const property = props && child(props, localName);
  if (!property) return null;
  return property.getAttributeNS(M_NS, "val") ?? property.getAttribute("m:val");
};

const isOn = (node: Element, propsName: string, localName: string) => {
  const props = child(node, propsName);
  const property = props && child(props, localName);
  if (!property) return false;
  const value = property.getAttributeNS(M_NS, "val") ?? property.getAttribute("m:val");
  return value === null || value === "" || value === "1" || value === "on" || value === "true";
};

const group = (latex: string) => `{${latex}}`;

const convertChildren = (node: Element | undefined, inFunctionName = false): string =>
  node ? childElements(node).map((element) => convert(element, inFunctionName)).join("") : "";

const convertRun = (run: Element, inFunctionName: boolean) => {
  const text = childElements(run)
    .filter((element) => isMath(element, "t") || element.localName === "t")
    .map((element) => element.textContent ?? "")
    .join("");

  if (!text) return "";

  if (FUNCTION_NAMES.has(text.trim()) && (inFunctionName || text.trim().length > 1)) {
    return `\\${text.trim()} `;
  }

  const plain = isOn(run, "rPr", "nor") || propertyValue(run, "rPr", "sty") === "p";
  const latex = escapeMathText(text);

  // words typed as "normal text" in the equation editor (units, chemical
  // symbols written upright) keep their upright style
  return plain && /[A-Za-z]/.test(text) ? `\\mathrm{${latex}}` : latex;
};

const convertDelimiter = (node: Element) => {
  const begin = propertyValue(node, "dPr", "begChr") ?? "(";
  const end = propertyValue(node, "dPr", "endChr") ?? ")";
  const separator = propertyValue(node, "dPr", "sepChr") ?? "|";

  const parts = childElements(node).filter((element) => isMath(element, "e")).map((element) => convertChildren(element));

  const left = begin === "" ? "." : DELIMITERS[begin] ?? escapeMathText(begin);
  const right = end === "" ? "." : DELIMITERS[end] ?? escapeMathText(end);
  const sep = DELIMITERS[separator] ?? escapeMathText(separator);

  return `\\left${left}${parts.join(sep === "|" ? "\\mid " : sep)}\\right${right}`;
};

const convert = (node: Element, inFunctionName = false): string => {
  if (node.namespaceURI !== M_NS) return "";

  switch (node.localName) {
    case "r":
      return convertRun(node, inFunctionName);

    case "f": {
      const numerator = convertChildren(child(node, "num"));
      const denominator = convertChildren(child(node, "den"));
      return propertyValue(node, "fPr", "type") === "noBar"
        ? `\\binom${group(numerator)}${group(denominator)}`
        : `\\frac${group(numerator)}${group(denominator)}`;
    }

    case "sSup":
      return `${group(convertChildren(child(node, "e")))}^${group(convertChildren(child(node, "sup")))}`;

    case "sSub":
      return `${group(convertChildren(child(node, "e")))}_${group(convertChildren(child(node, "sub")))}`;

    case "sSubSup":
      return `${group(convertChildren(child(node, "e")))}_${group(convertChildren(child(node, "sub")))}^${group(convertChildren(child(node, "sup")))}`;

    case "sPre":
      return `{}_${group(convertChildren(child(node, "sub")))}^${group(convertChildren(child(node, "sup")))}${group(convertChildren(child(node, "e")))}`;

    case "rad": {
      const degree = convertChildren(child(node, "deg"));
      const radicand = convertChildren(child(node, "e"));
      return degree && !isOn(node, "radPr", "degHide")
        ? `\\sqrt[${degree}]${group(radicand)}`
        : `\\sqrt${group(radicand)}`;
    }

    case "nary": {
      const symbol = propertyValue(node, "naryPr", "chr") ?? "∫";
      let latex = NARY_OPERATORS[symbol] ?? escapeMathText(symbol);
      const lower = convertChildren(child(node, "sub"));
      const upper = convertChildren(child(node, "sup"));
      if (lower && !isOn(node, "naryPr", "subHide")) latex += `_${group(lower)}`;
      if (upper && !isOn(node, "naryPr", "supHide")) latex += `^${group(upper)}`;
      return `${latex} ${convertChildren(child(node, "e"))}`;
    }

    case "d":
      return convertDelimiter(node);

    case "func":
      return `${convertChildren(child(node, "fName"), true)}${convertChildren(child(node, "e"))}`;

    case "acc": {
      const accent = propertyValue(node, "accPr", "chr") ?? "̂";
      return `${ACCENTS[accent] ?? "\\hat"}${group(convertChildren(child(node, "e")))}`;
    }

    case "bar":
      return propertyValue(node, "barPr", "pos") === "bot"
        ? `\\underline${group(convertChildren(child(node, "e")))}`
        : `\\overline${group(convertChildren(child(node, "e")))}`;

    case "groupChr": {
      const symbol = propertyValue(node, "groupChrPr", "chr") ?? "⏟";
      const command = symbol === "⏞" ? "\\overbrace" : "\\underbrace";
      return `${command}${group(convertChildren(child(node, "e")))}`;
    }

    case "limLow": {
      const base = convertChildren(child(node, "e"), true).trim();
      const limit = convertChildren(child(node, "lim"));
      return /^\\(lim|max|min|sup|inf)$/.test(base)
        ? `${base}_${group(limit)}`
        : `\\underset${group(limit)}${group(base)}`;
    }

    case "limUpp":
      return `\\overset${group(convertChildren(child(node, "lim")))}${group(convertChildren(child(node, "e")))}`;

    case "m": {
      const rows = childElements(node)
        .filter((element) => isMath(element, "mr"))
        .map((row) => childElements(row).filter((cell) => isMath(cell, "e")).map((cell) => convertChildren(cell)).join(" & "));
      return `\\begin{matrix}${rows.join(" \\\\ ")}\\end{matrix}`;
    }

    case "eqArr": {
      const rows = childElements(node).filter((element) => isMath(element, "e")).map((element) => convertChildren(element));
      return `\\begin{aligned}${rows.join(" \\\\ ")}\\end{aligned}`;
    }

    case "oMathPara":
      return childElements(node).filter((element) => isMath(element, "oMath")).map((element) => convert(element)).join(" \\\\ ");

    // property blocks carry formatting only
    case "rPr": case "ctrlPr": case "fPr": case "naryPr": case "dPr": case "radPr": case "accPr":
    case "barPr": case "funcPr": case "sSupPr": case "sSubPr": case "sSubSupPr": case "sPrePr":
    case "groupChrPr": case "limLowPr": case "limUppPr": case "mPr": case "eqArrPr": case "oMathParaPr":
    case "boxPr": case "borderBoxPr": case "phantPr":
      return "";

    // e, num, den, sub, sup, deg, lim, fName, box, borderBox, phant, oMath, ...
    default:
      return convertChildren(node, inFunctionName);
  }
};

export const ommlToLatex = (oMath: Element): string =>
  convert(oMath).replace(/\s+/g, " ").trim();

export const OMML_NAMESPACE = M_NS;
