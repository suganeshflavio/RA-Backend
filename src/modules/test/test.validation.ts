import { z } from "zod";

const optionChoiceEnum = z.enum(["A", "B", "C", "D"]);

const attemptStatusEnum = z.enum(["IN_PROGRESS", "COMPLETED"]);

const createQuestionSchema = z.object({
  question: z.string().min(1, "Question is required"),
  optionA: z.string().min(1, "optionA is required"),
  optionB: z.string().min(1, "optionB is required"),
  optionC: z.string().min(1, "optionC is required"),
  optionD: z.string().min(1, "optionD is required"),
  correctOption: optionChoiceEnum,
  explanation: z.string().optional(),
});

const negativeMarksSchema = z.coerce
  .number()
  .min(0, "negativeMarksPerQuestion can't be below 0")
  // tolerance because e.g. 0.29 * 100 is 28.999999999999996 in floating point
  .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-6, "Use at most 2 decimal places");

// a wrong answer can't cost more than a right answer earns
const negativeWithinMarks = <T extends { marksPerQuestion: number; negativeMarksPerQuestion?: number | undefined }>(value: T) =>
  (value.negativeMarksPerQuestion ?? 0) <= value.marksPerQuestion;

const NEGATIVE_WITHIN_MARKS_ERROR = {
  message: "negativeMarksPerQuestion can't be more than marksPerQuestion",
  path: ["negativeMarksPerQuestion"],
};

export const createTestSchema = z.object({
  testName: z.string().min(1, "testName is required"),
  marksPerQuestion: z.coerce.number().int().positive("marksPerQuestion must be > 0"),
  negativeMarksPerQuestion: negativeMarksSchema.optional(),
  questions: z.array(createQuestionSchema).min(1, "At least one question is required"),
}).refine(negativeWithinMarks, NEGATIVE_WITHIN_MARKS_ERROR);

export const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;

export const mcqImportUploadUrlSchema = z.object({
  fileName: z
    .string()
    .min(1, "fileName is required")
    .refine((name) => /\.docx$/i.test(name), "Only Word (.docx) files are supported"),
  fileSize: z.coerce
    .number()
    .int()
    .positive("fileSize is required")
    .max(MAX_IMPORT_FILE_BYTES, "File must be 5 MB or smaller"),
});

export const importTestFromFileSchema = z.object({
  testName: z.string().trim().min(1, "testName is required"),
  marksPerQuestion: z.coerce.number().int().positive("marksPerQuestion must be > 0"),
  negativeMarksPerQuestion: negativeMarksSchema.optional(),
  fileName: z.string().min(1, "fileName is required"),
}).refine(negativeWithinMarks, NEGATIVE_WITHIN_MARKS_ERROR);

export const updateTestSchema = z
  .object({
    testName: z.string().min(1).optional(),
    marksPerQuestion: z.coerce.number().int().positive().optional(),
    negativeMarksPerQuestion: negativeMarksSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const addQuestionSchema = createQuestionSchema;

export const updateQuestionSchema = z
  .object({
    question: z.string().min(1).optional(),
    optionA: z.string().min(1).optional(),
    optionB: z.string().min(1).optional(),
    optionC: z.string().min(1).optional(),
    optionD: z.string().min(1).optional(),
    correctOption: optionChoiceEnum.optional(),
    explanation: z.string().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const submitAttemptSchema = z.object({
  videoId: z.string().min(1).optional(),
  status: attemptStatusEnum.optional(),
  startedAt: z.coerce.date(),
  submittedAt: z.coerce.date().optional(),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "questionId is required"),
        selected: optionChoiceEnum,
      }),
    )
    .min(1, "answers are required"),
});
