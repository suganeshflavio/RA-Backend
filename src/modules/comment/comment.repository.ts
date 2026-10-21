import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { GetAdminCommentsQueryDto } from "./comment.types";

const commentUserSelect = {
    select: {
        id: true,
        name: true,
        role: true
    }
} as const;

export const videoExistsRepository = async (
    videoId: string
) => {

    return prisma.video.findUnique({
        where: {
            id: videoId
        },
        select: {
            id: true
        }
    });

};

export const createCommentRepository = async (
    data: {
        videoId: string;
        userId: string;
        message: string;
        parentId?: string;
    }
) => {

    return prisma.comment.create({
        data,
        include: {
            user: commentUserSelect
        }
    });

};

export const getCommentByIdRepository = async (
    commentId: string
) => {

    return prisma.comment.findUnique({
        where: {
            id: commentId
        }
    });

};

export const getVideoCommentsRepository = async (
    videoId: string
) => {

    return prisma.comment.findMany({

        where: {
            videoId,
            parentId: null
        },

        include: {
            user: commentUserSelect,
            replies: {
                orderBy: {
                    createdAt: "asc"
                },
                include: {
                    user: commentUserSelect
                }
            }
        },

        orderBy: {
            createdAt: "asc"
        }

    });

};

export const getAdminCommentsRepository = async (
    query: GetAdminCommentsQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {

        comments: {
            some: {}
        }

    };

    if (query.courseName) {

        where.course = {
            courseName: {
                contains: query.courseName,
                mode: "insensitive"
            }
        };

    }

    if (query.subjectName) {

        where.subject = {
            contains: query.subjectName,
            mode: "insensitive"
        };

    }

    if (query.chapterName) {

        where.chapter = {
            contains: query.chapterName,
            mode: "insensitive"
        };

    }

    if (query.videoName) {

        where.videoName = {
            contains: query.videoName,
            mode: "insensitive"
        };

    }

    const [videos, total] = await Promise.all([

        prisma.video.findMany({

            where,

            include: {
                course: {
                    select: {
                        courseName: true
                    }
                },
                comments: {
                    orderBy: {
                        createdAt: "asc"
                    },
                    include: {
                        user: commentUserSelect
                    }
                }
            },

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc"
            }

        }),

        prisma.video.count({
            where
        })

    ]);

    return {
        videos,
        total
    };

};

export const deleteCommentRepository = async (
    commentId: string
) => {

    return prisma.comment.delete({
        where: {
            id: commentId
        }
    });

};
