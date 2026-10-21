import prisma from "../../config/prisma";

const prismaDb = prisma as any;

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

export const getStudentAttemptsRepository = async (query: {
  page?: number;
  limit?: number;
  testId?: string;
  videoId?: string;
  studentId?: string;
  status?: "IN_PROGRESS" | "COMPLETED";
}) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where: {
    testId?: string;
    videoId?: string;
    studentId?: string;
    status?: "IN_PROGRESS" | "COMPLETED";
  } = {};

  if (query.testId) where.testId = query.testId;
  if (query.videoId) where.videoId = query.videoId;
  if (query.studentId) where.studentId = query.studentId;
  if (query.status) where.status = query.status;

  const [attempts, total] = await Promise.all([
    prismaDb.studentAttempt.findMany({
      where,
      include: attemptInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prismaDb.studentAttempt.count({ where }),
  ]);

  return { attempts, total, page, limit };
};

export const getStudentAttemptByIdRepository = async (attemptId: string) => {
  return prismaDb.studentAttempt.findUnique({
    where: { id: attemptId },
    include: attemptInclude,
  });
};

export const getStudentAttemptsByStudentRepository = async (studentId: string) => {
  return prismaDb.studentAttempt.findMany({
    where: { studentId },
    include: attemptInclude,
    orderBy: { createdAt: "desc" },
  });
};
