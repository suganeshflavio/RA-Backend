import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { getStudentAttemptsQuerySchema } from "./studentAttempt.validation";
import {
  getMyAttemptsService,
  getStudentAttemptByIdAdminService,
  getStudentAttemptsAdminService,
} from "./studentAttempt.service";

export const getStudentAttemptsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const query = getStudentAttemptsQuerySchema.parse(req.query);

  const data = await getStudentAttemptsAdminService(query);

  return successResponse(res, "Student attempts fetched successfully", data);
});

export const getStudentAttemptByIdAdmin = asyncHandler(async (req: Request, res: Response) => {
  const data = await getStudentAttemptByIdAdminService(req.params.attemptId as string);

  return successResponse(res, "Student attempt fetched successfully", data);
});

export const getMyAttempts = asyncHandler(async (req: Request, res: Response) => {
  const data = await getMyAttemptsService(req.user!.userId);

  return successResponse(res, "My attempts fetched successfully", data);
});
