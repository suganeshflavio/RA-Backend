import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { AppError } from "../../utils/errors/AppError";
import {
  addQuestionSchema,
  createTestSchema,
  submitAttemptSchema,
  updateQuestionSchema,
  updateTestSchema,
} from "./test.validation";
import {
  addQuestionService,
  createTestService,
  deleteQuestionService,
  deleteTestService,
  getMyAttemptsService,
  getStudentTestByIdService,
  getStudentTestsByTopicIdService,
  getStudentAttemptByIdAdminService,
  getStudentAttemptsAdminService,
  getTestByIdService,
  getTestsService,
  submitAttemptService,
  updateQuestionService,
  updateTestService,
} from "./test.service";

export const createTest = asyncHandler(async (req: Request, res: Response) => {
  const payload = createTestSchema.parse(req.body);

  const test = await createTestService(payload);

  return successResponse(res, "Test created successfully", test, 201);
});

export const getTests = asyncHandler(async (req: Request, res: Response) => {
  const data = await getTestsService({
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 10,
    search: req.query.search as string,
    topicId: req.query.topicId as string,
  });

  return successResponse(res, "Tests fetched successfully", data);
});

export const getTestById = asyncHandler(async (req: Request, res: Response) => {
  const test = await getTestByIdService(req.params.id as string);

  return successResponse(res, "Test fetched successfully", test);
});

export const getStudentTestsByTopicId = asyncHandler(
  async (req: Request, res: Response) => {
    const tests = await getStudentTestsByTopicIdService(
      req.params.topicId as string,
    );

    return successResponse(res, "Student tests fetched successfully", tests);
  },
);

export const getStudentTestById = asyncHandler(
  async (req: Request, res: Response) => {
    const test = await getStudentTestByIdService(req.params.id as string);

    return successResponse(res, "Student test fetched successfully", test);
  },
);

export const updateTest = asyncHandler(async (req: Request, res: Response) => {
  const payload = updateTestSchema.parse(req.body);

  const test = await updateTestService(req.params.id as string, payload);

  return successResponse(res, "Test updated successfully", test);
});

export const deleteTest = asyncHandler(async (req: Request, res: Response) => {
  const result = await deleteTestService(req.params.id as string);

  return successResponse(res, "Test deleted successfully", result);
});

export const addQuestion = asyncHandler(async (req: Request, res: Response) => {
  const payload = addQuestionSchema.parse(req.body);

  const question = await addQuestionService(req.params.id as string, payload);

  return successResponse(res, "Question added successfully", question, 201);
});

export const updateQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = updateQuestionSchema.parse(req.body);

    const question = await updateQuestionService(
      req.params.id as string,
      req.params.questionId as string,
      payload,
    );

    return successResponse(res, "Question updated successfully", question);
  },
);

export const deleteQuestion = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await deleteQuestionService(
      req.params.id as string,
      req.params.questionId as string,
    );

    return successResponse(res, "Question deleted successfully", result);
  },
);

export const submitAttempt = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = submitAttemptSchema.parse(req.body);

    const data = await submitAttemptService(
      req.params.id as string,
      req.user!.userId,
      payload,
    );

    return successResponse(
      res,
      "Student attempt submitted successfully",
      data,
      201,
    );
  },
);

export const getAttemptsByTestIdAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentAttemptsAdminService({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      testId: req.params.id as string,
      videoId: req.query.videoId as string,
      studentId: req.query.studentId as string,
      status: req.query.status as "IN_PROGRESS" | "COMPLETED" | undefined,
    });

    return successResponse(res, "Student attempts fetched successfully", data);
  },
);

export const getAttemptByIdForTestAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentAttemptByIdAdminService(
      req.params.attemptId as string,
    );

    if (data.testId !== (req.params.id as string)) {
      throw new AppError("Student attempt not found for this test", 404);
    }

    return successResponse(res, "Student attempt fetched successfully", data);
  },
);

export const getStudentAttemptsAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentAttemptsAdminService({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      testId: req.query.testId as string,
      videoId: req.query.videoId as string,
      studentId: req.query.studentId as string,
      status: req.query.status as "IN_PROGRESS" | "COMPLETED" | undefined,
    });

    return successResponse(res, "Student attempts fetched successfully", data);
  },
);

export const getStudentAttemptByIdAdmin = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getStudentAttemptByIdAdminService(
      req.params.attemptId as string,
    );

    return successResponse(res, "Student attempt fetched successfully", data);
  },
);

export const getMyAttempts = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getMyAttemptsService(req.user!.userId);

    return successResponse(res, "My attempts fetched successfully", data);
  },
);
