import prisma from "../../config/prisma";
import { env } from "../../config/env";
import { AppError } from "../../utils/errors/AppError";
import {
  downloadB2File,
  encodeB2FileName,
  getB2UploadUrl,
  sanitizeFileName,
  uploadBufferToB2,
} from "../../utils/b2";
import { DOCX_IMAGE_SRC_PREFIX, DocxImage, parseDocxQuestions } from "../../utils/docxQuestions";
import { createTestSchema, MAX_IMPORT_FILE_BYTES } from "./test.validation";
import { createTestRepository } from "./test.repository";
import { CreateTestQuestionItemDto, ImportTestFromFileDto } from "./test.types";

export const MAX_IMPORT_QUESTIONS = 100;

const IMPORT_KEY_PREFIX = "mcq-imports";

const DOCX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// Images Word can hold but browsers can't display (MathType equations are
// often stored as WMF/EMF previews)
const BROWSER_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

const DOCX_IMAGE_SRC = new RegExp(`<img src="${DOCX_IMAGE_SRC_PREFIX}(\\d+)">`, "g");

const uploadInlineImage = async (buffer: Buffer, name: string, contentType: string) => {

  const uploaded = await uploadBufferToB2(buffer, name, contentType, "inline-content");

  const record = await prisma.inlineImage.create({
    data: { fileId: uploaded.fileId, fileName: uploaded.fileName },
  });

  return `${env.API_BASE_URL}/api/uploads/image/${record.id}`;

};

const readDocxQuestions = async (docx: Buffer) => {

  if (docx.subarray(0, 4).toString("latin1") !== "PK\x03\x04") {
    throw new AppError("The uploaded file is not a valid Word (.docx) document", 400);
  }

  let parsed: Awaited<ReturnType<typeof parseDocxQuestions>>;

  try {
    parsed = await parseDocxQuestions(docx);
  } catch (error) {
    console.error("Word import failed to read the document:", error);
    throw new AppError("This Word file could not be opened. Save it again as .docx (not .doc) and retry.", 422);
  }

  const warnings = [...parsed.warnings];

  if (parsed.questions.length > MAX_IMPORT_QUESTIONS) {
    throw new AppError(`This document has ${parsed.questions.length} questions. Split it into files of up to ${MAX_IMPORT_QUESTIONS} questions.`, 422);
  }

  const imagesByIndex = new Map<number, DocxImage>(parsed.images.map((image) => [image.index, image]));
  const urls = new Map<number, string | null>();

  // uploads each referenced picture once and swaps in its stable URL
  const resolveImages = async (html: string, questionNumber: string) => {
    let out = html;

    for (const match of html.matchAll(DOCX_IMAGE_SRC)) {
      const index = Number(match[1]);
      const image = imagesByIndex.get(index);

      if (!urls.has(index)) {
        urls.set(
          index,
          image && BROWSER_IMAGE_TYPES.has(image.contentType)
            ? await uploadInlineImage(image.buffer, `docx-image-${index}.${image.contentType.split("/")[1]}`, image.contentType)
            : null,
        );
      }

      const url = urls.get(index);

      if (!url) {
        warnings.push(`Question ${questionNumber}: an image (${image?.contentType ?? "unknown type"}) can't be shown in browsers and was left out. MathType equations are stored this way — retype them with Insert → Equation, or insert pictures as PNG/JPG.`);
      }

      out = out.replace(match[0], url ? `<img src="${url}">` : "");
    }

    return out;
  };

  const questions: CreateTestQuestionItemDto[] = [];

  for (const item of parsed.questions) {
    questions.push({
      question: await resolveImages(item.question, item.number),
      optionA: await resolveImages(item.optionA, item.number),
      optionB: await resolveImages(item.optionB, item.number),
      optionC: await resolveImages(item.optionC, item.number),
      optionD: await resolveImages(item.optionD, item.number),
      correctOption: item.correctOption,
      explanation: await resolveImages(item.explanation, item.number),
    });
  }

  return { questions, warnings };

};

export const requestMcqImportUploadUrlService = async (payload: { fileName: string }) => {

  const key = `${IMPORT_KEY_PREFIX}/${Date.now()}-${sanitizeFileName(payload.fileName)}`;

  const { uploadUrl, authorizationToken } = await getB2UploadUrl();

  return {
    uploadUrl,
    fileName: key,
    headers: {
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeB2FileName(key),
      "Content-Type": DOCX_CONTENT_TYPE,
      "X-Bz-Content-Sha1": "do_not_verify",
    },
  };

};

export const importTestFromFileService = async (payload: ImportTestFromFileDto) => {

  // only files uploaded through the import upload URL, never arbitrary bucket keys
  if (!/\.docx$/i.test(payload.fileName) || !payload.fileName.startsWith(`${IMPORT_KEY_PREFIX}/`) || payload.fileName.includes("..")) {
    throw new AppError("Invalid file reference", 400);
  }

  const { buffer } = await downloadB2File(payload.fileName, MAX_IMPORT_FILE_BYTES);

  const { questions, warnings } = await readDocxQuestions(buffer);

  if (questions.length === 0) {
    throw new AppError(
      `No complete questions were found in this Word file. Compare it with the sample Word template.${warnings.length ? ` ${warnings.slice(0, 3).join(" ")}` : ""}`,
      422,
    );
  }

  const test = await createTestRepository(
    createTestSchema.parse({
      testName: payload.testName,
      marksPerQuestion: payload.marksPerQuestion,
      questions,
    }),
  );

  return {
    test,
    importedCount: questions.length,
    warnings,
  };

};
