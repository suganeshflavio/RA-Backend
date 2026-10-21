import prisma from "../../config/prisma";
import {
  AddQuestionDto,
  CreateTestDto,
  GetAttemptsQueryDto,
  GetTestsQueryDto,
  UpdateQuestionDto,
  UpdateTestDto,
} from "./test.types";

const prismaDb = prisma as any;

export const getVideoByIdRepository = async (videoId: string) => {
  return prisma.video.findUnique({
    where: { id: videoId },
    include: {
      course: {
        select: {
          id: true,
          courseName: true,
        },
      },
    },
  });
};

export const createTestRepository = async (payload: CreateTestDto) => {
  return prismaDb.testQuestion.create({
    data: {
      videoId: payload.videoId,
      testName: payload.testName,
      marksPerQuestion: payload.marksPerQuestion,
      questions: {
        create: payload.questions,
      },
    },
    include: {
      video: {
        select: {
          id: true,
          videoName: true,
          subject: true,
          chapter: true,
          course: {
            select: {
              id: true,
              courseName: true,
            },
          },
        },
      },
      questions: true,
    },
  });
};

export const getTestsRepository = async (query: GetTestsQueryDto) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: {
    videoId?: string;
    testName?: {
      contains: string;
      mode: "insensitive";
    };
  } = {};

  if (query.videoId) {
    where.videoId = query.videoId;
  }

  if (query.search) {
    where.testName = {
      contains: query.search,
      mode: "insensitive",
    };
  }

  const [tests, total] = await Promise.all([
    prismaDb.testQuestion.findMany({
      where,
      include: {
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
        video: {
          select: {
            id: true,
            videoName: true,
            subject: true,
            chapter: true,
            course: {
              select: {
                id: true,
                courseName: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prismaDb.testQuestion.count({ where }),
  ]);

  return { tests, total };
};

export const getTestByIdRepository = async (testId: string) => {
  return prismaDb.testQuestion.findUnique({
    where: { id: testId },
    include: {
      video: {
        select: {
          id: true,
          videoName: true,
          subject: true,
          chapter: true,
          course: {
            select: {
              id: true,
              courseName: true,
            },
          },
        },
      },
      questions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

export const getTestsWithQuestionsByVideoIdRepository = async (videoId: string) => {
  return prismaDb.testQuestion.findMany({
    where: { videoId },
    include: {
      video: {
        select: {
          id: true,
          videoName: true,
          subject: true,
          chapter: true,
          course: {
            select: {
              id: true,
              courseName: true,
            },
          },
        },
      },
      questions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateTestRepository = async (testId: string, payload: UpdateTestDto) => {
  return prismaDb.testQuestion.update({
    where: { id: testId },
    data: payload,
    include: {
      video: {
        select: {
          id: true,
          videoName: true,
          subject: true,
          chapter: true,
          course: {
            select: {
              id: true,
              courseName: true,
            },
          },
        },
      },
      questions: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

export const deleteTestRepository = async (testId: string) => {
  return prismaDb.testQuestion.delete({
    where: { id: testId },
  });
};

export const addQuestionRepository = async (testId: string, payload: AddQuestionDto) => {
  return prismaDb.testQuestionItem.create({
    data: {
      testId,
      ...payload,
    },
  });
};

export const getQuestionByIdRepository = async (testId: string, questionId: string) => {
  return prismaDb.testQuestionItem.findFirst({
    where: {
      id: questionId,
      testId,
    },
  });
};

export const updateQuestionRepository = async (
  questionId: string,
  payload: UpdateQuestionDto,
) => {
  return prismaDb.testQuestionItem.update({
    where: { id: questionId },
    data: payload,
  });
};

export const deleteQuestionRepository = async (questionId: string) => {
  return prismaDb.testQuestionItem.delete({
    where: { id: questionId },
  });
};

export const getTestWithQuestionsRepository = async (testId: string) => {
  return prismaDb.testQuestion.findUnique({
    where: { id: testId },
    include: {
      questions: {
        orderBy: {
          createdAt: "asc",
        },
      },
      video: {
        select: {
          id: true,
        },
      },
    },
  });
};

export const createStudentAttemptRepository = async (data: {
  studentId: string;
  videoId: string;
  testId: string;
  status: "IN_PROGRESS" | "COMPLETED";
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  marksPerQuestion: number;
  totalMarks: number;
  obtainedMarks: number;
  startedAt: Date;
  submittedAt?: Date;
  answers: {
    questionId: string;
    selectedOption: "A" | "B" | "C" | "D";
    isCorrect: boolean;
  }[];
}) => {
  return prismaDb.studentAttempt.create({
    data: {
      studentId: data.studentId,
      videoId: data.videoId,
      testId: data.testId,
      status: data.status,
      totalQuestions: data.totalQuestions,
      correctAnswers: data.correctAnswers,
      wrongAnswers: data.wrongAnswers,
      marksPerQuestion: data.marksPerQuestion,
      totalMarks: data.totalMarks,
      obtainedMarks: data.obtainedMarks,
      startedAt: data.startedAt,
      submittedAt: data.submittedAt,
      answers: {
        create: data.answers,
      },
    },
    include: {
      answers: {
        include: {
          question: true,
        },
      },
    },
  });
};

const attemptInclude = {
  student: {
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      class: true,
    },
  },
  video: {
    select: {
      id: true,
      videoName: true,
      subject: true,
      chapter: true,
      course: {
        select: {
          id: true,
          courseName: true,
        },
      },
    },
  },
  test: {
    select: {
      id: true,
      testName: true,
    },
  },
  answers: {
    include: {
      question: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
};

export const getStudentAttemptByIdRepository = async (attemptId: string) => {
  return prismaDb.studentAttempt.findUnique({
    where: { id: attemptId },
    include: attemptInclude,
  });
};

export const getStudentAttemptsRepository = async (query: GetAttemptsQueryDto) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: {
    testId?: string;
    videoId?: string;
    studentId?: string;
    status?: "IN_PROGRESS" | "COMPLETED";
  } = {};

  if (query.testId) {
    where.testId = query.testId;
  }

  if (query.videoId) {
    where.videoId = query.videoId;
  }

  if (query.studentId) {
    where.studentId = query.studentId;
  }

  if (query.status) {
    where.status = query.status;
  }

  const [attempts, total] = await Promise.all([
    prismaDb.studentAttempt.findMany({
      where,
      include: attemptInclude,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prismaDb.studentAttempt.count({ where }),
  ]);

  return { attempts, total };
};

export const getStudentAttemptsByStudentRepository = async (studentId: string) => {
  return prismaDb.studentAttempt.findMany({
    where: { studentId },
    include: attemptInclude,
    orderBy: {
      createdAt: "desc",
    },
  });
};
