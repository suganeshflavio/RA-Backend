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

export const createTestSchema = z.object({
  testName: z.string().min(1, "testName is required"),
  marksPerQuestion: z.coerce.number().int().positive("marksPerQuestion must be > 0"),
  questions: z.array(createQuestionSchema).min(1, "At least one question is required"),
});

export const updateTestSchema = z
  .object({
    testName: z.string().min(1).optional(),
    marksPerQuestion: z.coerce.number().int().positive().optional(),
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
