import {
  AttemptDetails,
  CreateTestDto,
  GetAttemptsQueryDto,
  GetTestsQueryDto,
  OptionChoice,
  SubmitAttemptDto,
  UpdateQuestionDto,
  UpdateTestDto,
} from "./test.types";
import { AppError } from "../../utils/errors/AppError";
import {
  addQuestionRepository,
  createStudentAttemptRepository,
  createTestRepository,
  deleteQuestionRepository,
  deleteTestRepository,
  getQuestionByIdRepository,
  getStudentAttemptByIdRepository,
  getStudentAttemptsByStudentRepository,
  getStudentAttemptsRepository,
  getTestByIdRepository,
  getTestWithQuestionsRepository,
  getTestsWithQuestionsByVideoIdRepository,
  getTestsRepository,
  getVideoByIdRepository,
  updateQuestionRepository,
  updateTestRepository,
} from "./test.repository";

const formatAttempt = (attempt: any): AttemptDetails => ({
  id: attempt.id,
  studentId: attempt.studentId,
  videoId: attempt.videoId,
  testId: attempt.testId,
  status: attempt.status,
  totalQuestions: attempt.totalQuestions,
  correctAnswers: attempt.correctAnswers,
  wrongAnswers: attempt.wrongAnswers,
  marksPerQuestion: attempt.marksPerQuestion,
  totalMarks: attempt.totalMarks,
  obtainedMarks: attempt.obtainedMarks,
  startedAt: attempt.startedAt,
  submittedAt: attempt.submittedAt,
  createdAt: attempt.createdAt,
  student: attempt.student,
  video: attempt.video,
  test: attempt.test,
  answers: attempt.answers.map((answer: any) => ({
    questionId: answer.questionId,
    question: answer.question.question,
    optionA: answer.question.optionA,
    optionB: answer.question.optionB,
    optionC: answer.question.optionC,
    optionD: answer.question.optionD,
    correctOption: answer.question.correctOption,
    selected: answer.selectedOption,
    correct: answer.isCorrect,
    explanation: answer.question.explanation,
  })),
});

const formatStudentTest = (test: any) => ({
  id: test.id,
  videoId: test.videoId,
  testName: test.testName,
  marksPerQuestion: test.marksPerQuestion,
  createdAt: test.createdAt,
  updatedAt: test.updatedAt,
  video: test.video,
  questions: test.questions.map((question: any) => ({
    id: question.id,
    question: question.question,
    optionA: question.optionA,
    optionB: question.optionB,
    optionC: question.optionC,
    optionD: question.optionD,
  })),
});

export const createTestService = async (payload: CreateTestDto) => {
  const video = await getVideoByIdRepository(payload.videoId);

  if (!video) {
    throw new AppError("Video not found", 404);
  }

  return createTestRepository(payload);
};

export const getTestsService = async (query: GetTestsQueryDto) => {
  const page = query.page || 1;
  const limit = query.limit || 10;

  const { tests, total } = await getTestsRepository(query);

  return {
    tests,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTestByIdService = async (testId: string) => {
  const test = await getTestByIdRepository(testId);

  if (!test) {
    throw new AppError("Test not found", 404);
  }

  return test;
};

export const getStudentTestByIdService = async (testId: string) => {
  const test = await getTestByIdRepository(testId);

  if (!test) {
    throw new AppError("Test not found", 404);
  }

  return formatStudentTest(test);
};

export const getStudentTestsByVideoIdService = async (videoId: string) => {
  const tests = await getTestsWithQuestionsByVideoIdRepository(videoId);

  return tests.map(formatStudentTest);
};

export const updateTestService = async (testId: string, payload: UpdateTestDto) => {
  const existing = await getTestByIdRepository(testId);

  if (!existing) {
    throw new AppError("Test not found", 404);
  }

  if (payload.videoId) {
    const video = await getVideoByIdRepository(payload.videoId);

    if (!video) {
      throw new AppError("Video not found", 404);
    }
  }

  return updateTestRepository(testId, payload);
};

export const deleteTestService = async (testId: string) => {
  const existing = await getTestByIdRepository(testId);

  if (!existing) {
    throw new AppError("Test not found", 404);
  }

  await deleteTestRepository(testId);

  return { id: testId };
};

export const addQuestionService = async (testId: string, payload: CreateTestDto["questions"][number]) => {
  const existing = await getTestByIdRepository(testId);

  if (!existing) {
    throw new AppError("Test not found", 404);
  }

  return addQuestionRepository(testId, payload);
};

export const updateQuestionService = async (
  testId: string,
  questionId: string,
  payload: UpdateQuestionDto,
) => {
  const existing = await getQuestionByIdRepository(testId, questionId);

  if (!existing) {
    throw new AppError("Question not found for this test", 404);
  }

  return updateQuestionRepository(questionId, payload);
};

export const deleteQuestionService = async (testId: string, questionId: string) => {
  const existing = await getQuestionByIdRepository(testId, questionId);

  if (!existing) {
    throw new AppError("Question not found for this test", 404);
  }

  await deleteQuestionRepository(questionId);

  return { id: questionId };
};

export const submitAttemptService = async (
  testId: string,
  studentId: string,
  payload: SubmitAttemptDto,
) => {
  const test = await getTestWithQuestionsRepository(testId);

  if (!test) {
    throw new AppError("Test not found", 404);
  }

  if (payload.videoId !== test.videoId) {
    throw new AppError("videoId does not belong to this test", 400);
  }

  if (test.questions.length === 0) {
    throw new AppError("Test has no questions", 400);
  }

  if (payload.answers.length !== test.questions.length) {
    throw new AppError("All questions must be answered", 400);
  }

  const selectedByQuestionId = new Map<string, OptionChoice>();

  for (const answer of payload.answers) {
    if (selectedByQuestionId.has(answer.questionId)) {
      throw new AppError(`Duplicate answer for question ${answer.questionId}`, 400);
    }

    selectedByQuestionId.set(answer.questionId, answer.selected);
  }

  let correctAnswers = 0;

  const answerRows: {
    questionId: string;
    selectedOption: OptionChoice;
    isCorrect: boolean;
  }[] = [];

  for (const question of test.questions as any[]) {
    const selectedOption = selectedByQuestionId.get(question.id);

    if (!selectedOption) {
      throw new AppError(`Missing answer for question ${question.id}`, 400);
    }

    const isCorrect = selectedOption === question.correctOption;

    if (isCorrect) {
      correctAnswers += 1;
    }

    answerRows.push({
      questionId: question.id,
      selectedOption,
      isCorrect,
    });
  }

  const totalQuestions = test.questions.length;
  const wrongAnswers = totalQuestions - correctAnswers;
  const totalMarks = totalQuestions * test.marksPerQuestion;
  const obtainedMarks = correctAnswers * test.marksPerQuestion;

  const attempt = await createStudentAttemptRepository({
    studentId,
    videoId: payload.videoId,
    testId,
    status: payload.status ?? "COMPLETED",
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    marksPerQuestion: test.marksPerQuestion,
    totalMarks,
    obtainedMarks,
    startedAt: payload.startedAt,
    submittedAt: payload.submittedAt,
    answers: answerRows,
  });

  const fullAttempt = await getStudentAttemptByIdRepository(attempt.id);

  if (!fullAttempt) {
    throw new AppError("Attempt not found after creation", 500);
  }

  return formatAttempt(fullAttempt);
};

export const getStudentAttemptsAdminService = async (query: GetAttemptsQueryDto) => {
  const page = query.page || 1;
  const limit = query.limit || 10;

  const { attempts, total } = await getStudentAttemptsRepository(query);

  return {
    attempts: attempts.map(formatAttempt),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};

export const getStudentAttemptByIdAdminService = async (attemptId: string) => {
  const attempt = await getStudentAttemptByIdRepository(attemptId);

  if (!attempt) {
    throw new AppError("Student attempt not found", 404);
  }

  return formatAttempt(attempt);
};

export const getMyAttemptsService = async (studentId: string) => {
  const attempts = await getStudentAttemptsByStudentRepository(studentId);

  return attempts.map(formatAttempt);
};
