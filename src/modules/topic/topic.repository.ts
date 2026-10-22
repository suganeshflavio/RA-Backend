import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateTopicDto, GetTopicQueryDto, UpdateTopicDto } from "./topic.types";

export const getChapterByIdRepository = async (
    chapterId: string
) => {

    return prisma.chapter.findUnique({
        where: { id: chapterId }
    });

};

export const getVideoByIdRepository = async (
    videoId: string
) => {

    return prisma.video.findUnique({
        where: { id: videoId }
    });

};

export const getMcqTestByIdRepository = async (
    testId: string
) => {

    return prisma.testQuestion.findUnique({
        where: { id: testId }
    });

};

export const getNotesByIdRepository = async (
    notesId: string
) => {

    return prisma.notes.findUnique({
        where: { id: notesId }
    });

};

export const createTopicRepository = async (
    payload: CreateTopicDto
) => {

    return prisma.topic.create({
        data: payload
    });

};

export const getTopicsRepository = async (
    query: GetTopicQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.TopicWhereInput = {};

    if (query.chapterId) {
        where.chapterId = query.chapterId;
    }

    if (query.search) {

        where.name = {
            contains: query.search,
            mode: "insensitive"
        };

    }

    if (typeof query.isActive === "boolean") {

        where.isActive = query.isActive;

    }

    const [topics, total] = await Promise.all([

        prisma.topic.findMany({
            where,
            include: {
                chapter: {
                    select: {
                        id: true,
                        name: true,
                        class: {
                            select: {
                                id: true,
                                name: true,
                                subject: {
                                    select: { id: true, name: true }
                                }
                            }
                        }
                    }
                },
                _count: {
                    select: { videos: true, mcqTests: true, notes: true }
                }
            },
            skip,
            take: limit,
            orderBy: [{ order: "asc" }, { name: "asc" }]
        }),

        prisma.topic.count({ where })

    ]);

    return { topics, total };

};

export const getTopicByIdRepository = async (
    topicId: string
) => {

    return prisma.topic.findUnique({

        where: { id: topicId },

        include: {

            chapter: {
                select: {
                    id: true,
                    name: true,
                    class: {
                        select: {
                            id: true,
                            name: true,
                            subject: {
                                select: { id: true, name: true }
                            }
                        }
                    }
                }
            },

            videos: {
                select: { id: true, videoName: true, isActive: true }
            },

            mcqTests: {
                select: { id: true, testName: true }
            },

            notes: {
                select: { id: true, title: true, isActive: true }
            }

        }

    });

};

export const updateTopicRepository = async (
    topicId: string,
    payload: UpdateTopicDto
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: payload
    });

};

export const setTopicActiveRepository = async (
    topicId: string,
    isActive: boolean
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: { isActive }
    });

};

export const permanentDeleteTopicRepository = async (
    topicId: string
) => {

    return prisma.topic.delete({
        where: { id: topicId }
    });

};

export const linkVideoRepository = async (
    topicId: string,
    videoId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            videos: {
                connect: { id: videoId }
            }
        }
    });

};

export const unlinkVideoRepository = async (
    topicId: string,
    videoId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            videos: {
                disconnect: { id: videoId }
            }
        }
    });

};

export const linkMcqTestRepository = async (
    topicId: string,
    testId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            mcqTests: {
                connect: { id: testId }
            }
        }
    });

};

export const unlinkMcqTestRepository = async (
    topicId: string,
    testId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            mcqTests: {
                disconnect: { id: testId }
            }
        }
    });

};

export const linkNotesRepository = async (
    topicId: string,
    notesId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            notes: {
                connect: { id: notesId }
            }
        }
    });

};

export const unlinkNotesRepository = async (
    topicId: string,
    notesId: string
) => {

    return prisma.topic.update({
        where: { id: topicId },
        data: {
            notes: {
                disconnect: { id: notesId }
            }
        }
    });

};
