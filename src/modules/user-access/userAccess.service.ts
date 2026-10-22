import prisma from "../../config/prisma";
import { AppError } from "../../utils/errors/AppError";

export const assignUserAccessService = async (
  userId: string,
  courses: {
    courseId: string;
    videoIds?: string[];
    notesIds?: string[];
    testIds?: string[];
  }[]
) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Remove all previous access
  await Promise.all([
    prisma.userAccess.deleteMany({ where: { userId } }),
    prisma.userNotesAccess.deleteMany({ where: { userId } }),
    prisma.userMcqTestAccess.deleteMany({ where: { userId } }),
  ]);

  for (const courseItem of courses) {

    const course = await prisma.course.findUnique({
      where: {
        id: courseItem.courseId,
      },
    });

    if (!course) {
      throw new AppError(`Course not found: ${courseItem.courseId}`, 404);
    }

    for (const videoId of courseItem.videoIds ?? []) {

      const courseVideo = await prisma.courseVideo.findFirst({
        where: {
          courseId: courseItem.courseId,
          videoId,
        },
      });

      if (!courseVideo) {
        throw new AppError(
          `Video '${videoId}' is not linked to course '${course.courseName}'`,
          400
        );
      }

      await prisma.userAccess.create({
        data: {
          userId,
          courseId: courseItem.courseId,
          videoId,
        },
      });

    }

    for (const notesId of courseItem.notesIds ?? []) {

      const courseNotes = await prisma.courseNotes.findFirst({
        where: {
          courseId: courseItem.courseId,
          notesId,
        },
      });

      if (!courseNotes) {
        throw new AppError(
          `Notes '${notesId}' is not linked to course '${course.courseName}'`,
          400
        );
      }

      await prisma.userNotesAccess.create({
        data: {
          userId,
          courseId: courseItem.courseId,
          notesId,
        },
      });

    }

    for (const testId of courseItem.testIds ?? []) {

      const courseMcqTest = await prisma.courseMcqTest.findFirst({
        where: {
          courseId: courseItem.courseId,
          testId,
        },
      });

      if (!courseMcqTest) {
        throw new AppError(
          `MCQ test '${testId}' is not linked to course '${course.courseName}'`,
          400
        );
      }

      await prisma.userMcqTestAccess.create({
        data: {
          userId,
          courseId: courseItem.courseId,
          testId,
        },
      });

    }
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isAccess: true,
    },
  });

  return true;
};


export const getUserAccessByUserIdService = async (
  userId: string
) => {

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      class: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [videoAccesses, notesAccesses, testAccesses] = await Promise.all([
    prisma.userAccess.findMany({
      where: { userId, isActive: true },
      include: {
        course: { select: { id: true, courseName: true } },
        video: { select: { id: true, videoName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.userNotesAccess.findMany({
      where: { userId, isActive: true },
      include: {
        course: { select: { id: true, courseName: true } },
        notes: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.userMcqTestAccess.findMany({
      where: { userId, isActive: true },
      include: {
        course: { select: { id: true, courseName: true } },
        test: { select: { id: true, testName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const courseMap = new Map<string, {
    courseId: string;
    courseName: string;
    videos: { videoId: string; videoName: string }[];
    notes: { notesId: string; title: string }[];
    mcqTests: { testId: string; testName: string }[];
  }>();

  const getCourseEntry = (courseId: string, courseName: string) => {
    if (!courseMap.has(courseId)) {
      courseMap.set(courseId, {
        courseId,
        courseName,
        videos: [],
        notes: [],
        mcqTests: [],
      });
    }

    return courseMap.get(courseId)!;
  };

  for (const access of videoAccesses) {
    getCourseEntry(access.course.id, access.course.courseName).videos.push({
      videoId: access.video.id,
      videoName: access.video.videoName,
    });
  }

  for (const access of notesAccesses) {
    getCourseEntry(access.course.id, access.course.courseName).notes.push({
      notesId: access.notes.id,
      title: access.notes.title,
    });
  }

  for (const access of testAccesses) {
    getCourseEntry(access.course.id, access.course.courseName).mcqTests.push({
      testId: access.test.id,
      testName: access.test.testName,
    });
  }

  return {
    user,
    courses: Array.from(courseMap.values()),
  };
};
