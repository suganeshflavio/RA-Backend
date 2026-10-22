import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateCourseDto } from "./course.types";
import { UpdateCourseDto } from "./course.types";

export const findCourseByName = async (
    courseName: string
) => {

    return prisma.course.findFirst({
        where: {
            courseName
        }
    });

};

export const createCourseRepository = async (
    payload: CreateCourseDto
) => {

    return prisma.course.create({
        data: payload
    });

};

export const getCoursesRepository = async (
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean
) => {

    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {};

    if (search) {
        where.courseName = {
            contains: search,
            mode: "insensitive"
        };
    }

    if (typeof isActive === "boolean") {
        where.isActive = isActive;
    }

    const [courses, total] = await Promise.all([

        prisma.course.findMany({

            where,

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc"
            }

        }),

        prisma.course.count({
            where
        })

    ]);

    return {

        courses,

        total

    };

};

const courseDetailInclude = {

    subjects: {
        orderBy: { order: "asc" as const },
        include: {
            subject: {
                select: { id: true, name: true }
            },
            class: {
                select: { id: true, name: true }
            }
        }
    },

    topics: {
        orderBy: { order: "asc" as const },
        include: {
            topic: {
                select: {
                    id: true,
                    name: true,
                    chapter: {
                        select: {
                            id: true,
                            name: true,
                            class: {
                                select: {
                                    id: true,
                                    name: true,
                                    subject: { select: { id: true, name: true } }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    videos: {
        orderBy: { order: "asc" as const },
        include: {
            video: {
                select: { id: true, videoName: true, isActive: true }
            },
            class: {
                select: { id: true, name: true }
            }
        }
    },

    notes: {
        orderBy: { order: "asc" as const },
        include: {
            notes: {
                select: { id: true, title: true, isActive: true }
            },
            class: {
                select: { id: true, name: true }
            }
        }
    },

    mcqTests: {
        orderBy: { order: "asc" as const },
        include: {
            test: {
                select: { id: true, testName: true }
            },
            class: {
                select: { id: true, name: true }
            }
        }
    }

};

export const getCourseByIdRepository = async (
    courseId: string
) => {

    return prisma.course.findUnique({

        where: {
            id: courseId
        },

        include: courseDetailInclude

    });

};

export const updateCourseRepository = async (

    courseId: string,

    payload: UpdateCourseDto

) => {

    return prisma.course.update({

        where: {

            id: courseId

        },

        data: payload

    });

};

export const deactivateCourseCascadeRepository = async (
    courseId: string
) => {

    await prisma.$transaction([

        prisma.courseVideo.updateMany({
            where: {
                courseId
            },
            data: {
                isActive: false
            }
        }),

        prisma.userAccess.updateMany({
            where: {
                courseId
            },
            data: {
                isActive: false
            }
        })

    ]);

};

export const setCourseActiveRepository = async (
    courseId: string,
    isActive: boolean
) => {

    return prisma.course.update({
        where: {
            id: courseId
        },
        data: {
            isActive
        }
    });

};

export const permanentDeleteCourseRepository = async (
    courseId: string
) => {

    return prisma.course.delete({
        where: {
            id: courseId
        }
    });

};

export const getSubjectByIdRepository = async (subjectId: string) => {
    return prisma.subject.findUnique({ where: { id: subjectId } });
};

export const getClassByIdRepository = async (classId: string) => {
    return prisma.class.findUnique({ where: { id: classId } });
};

export const getTopicByIdRepository = async (topicId: string) => {
    return prisma.topic.findUnique({ where: { id: topicId } });
};

export const getVideoByIdRepository = async (videoId: string) => {
    return prisma.video.findUnique({ where: { id: videoId } });
};

export const getNotesByIdRepository = async (notesId: string) => {
    return prisma.notes.findUnique({ where: { id: notesId } });
};

export const getMcqTestByIdRepository = async (testId: string) => {
    return prisma.testQuestion.findUnique({ where: { id: testId } });
};

export const linkSubjectRepository = async (
    courseId: string,
    subjectId: string,
    order?: number,
    classId?: string
) => {

    return prisma.courseSubject.create({
        data: { courseId, subjectId, order, classId: classId ?? null }
    });

};

export const unlinkSubjectRepository = async (
    courseId: string,
    courseSubjectId: string
) => {

    await prisma.courseSubject.deleteMany({
        where: { id: courseSubjectId, courseId }
    });

};

export const findCourseSubjectRepository = async (
    courseId: string,
    subjectId: string,
    classId?: string
) => {

    return prisma.courseSubject.findFirst({
        where: { courseId, subjectId, classId: classId ?? null }
    });

};

export const linkTopicRepository = async (
    courseId: string,
    topicId: string,
    order?: number
) => {

    return prisma.courseTopic.create({
        data: { courseId, topicId, order }
    });

};

export const unlinkTopicRepository = async (
    courseId: string,
    courseTopicId: string
) => {

    await prisma.courseTopic.deleteMany({
        where: { id: courseTopicId, courseId }
    });

};

export const findCourseTopicRepository = async (
    courseId: string,
    topicId: string
) => {

    return prisma.courseTopic.findUnique({
        where: { courseId_topicId: { courseId, topicId } }
    });

};

export const linkVideoRepository = async (
    courseId: string,
    videoId: string,
    order?: number,
    classId?: string
) => {

    return prisma.courseVideo.create({
        data: { courseId, videoId, order, classId: classId ?? null }
    });

};

export const unlinkVideoRepository = async (
    courseId: string,
    courseVideoId: string
) => {

    await prisma.courseVideo.deleteMany({
        where: { id: courseVideoId, courseId }
    });

};

export const findCourseVideoRepository = async (
    courseId: string,
    videoId: string,
    classId?: string
) => {

    return prisma.courseVideo.findFirst({
        where: { courseId, videoId, classId: classId ?? null }
    });

};

export const linkNotesRepository = async (
    courseId: string,
    notesId: string,
    order?: number,
    classId?: string
) => {

    return prisma.courseNotes.create({
        data: { courseId, notesId, order, classId: classId ?? null }
    });

};

export const unlinkNotesRepository = async (
    courseId: string,
    courseNotesId: string
) => {

    await prisma.courseNotes.deleteMany({
        where: { id: courseNotesId, courseId }
    });

};

export const findCourseNotesRepository = async (
    courseId: string,
    notesId: string,
    classId?: string
) => {

    return prisma.courseNotes.findFirst({
        where: { courseId, notesId, classId: classId ?? null }
    });

};

export const linkMcqTestRepository = async (
    courseId: string,
    testId: string,
    order?: number,
    classId?: string
) => {

    return prisma.courseMcqTest.create({
        data: { courseId, testId, order, classId: classId ?? null }
    });

};

export const unlinkMcqTestRepository = async (
    courseId: string,
    courseMcqTestId: string
) => {

    await prisma.courseMcqTest.deleteMany({
        where: { id: courseMcqTestId, courseId }
    });

};

export const findCourseMcqTestRepository = async (
    courseId: string,
    testId: string,
    classId?: string
) => {

    return prisma.courseMcqTest.findFirst({
        where: { courseId, testId, classId: classId ?? null }
    });

};
