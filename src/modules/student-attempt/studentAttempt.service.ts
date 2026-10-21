import { AppError } from "../../utils/errors/AppError";
import {
  getStudentAttemptByIdRepository,
  getStudentAttemptsByStudentRepository,
  getStudentAttemptsRepository,
} from "./studentAttempt.repository";

const formatAttempt = (attempt: any) => ({
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

export const getStudentAttemptsAdminService = async (query: {
  page?: number;
  limit?: number;
  testId?: string;
  videoId?: string;
  studentId?: string;
  status?: "IN_PROGRESS" | "COMPLETED";
}) => {
  const { attempts, total, page, limit } = await getStudentAttemptsRepository(query);

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
