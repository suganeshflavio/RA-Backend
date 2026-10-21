import { z } from "zod";

export const getStudentAttemptsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  testId: z.string().optional(),
  videoId: z.string().optional(),
  studentId: z.string().optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED"]).optional(),
});
