import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateVideoDto, GetVideoQueryDto, UpdateVideoDto } from "./video.types";

export const createVideoRepository = async (
    payload: CreateVideoDto
) => {

    return prisma.video.create({
        data: payload
    });

};

export const getCourseRepository = async (
    courseId: string
) => {

    return prisma.course.findUnique({
        where: {
            id: courseId
        }
    });

};

export const getVideosRepository = async (

    query: GetVideoQueryDto

) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {};

    if (query.courseId) {

        where.courseId = query.courseId;

    }

    if (query.subject) {

        where.subject = {

            equals: query.subject,

            mode: "insensitive"

        };

    }

    if (query.chapter) {

        where.chapter = {

            equals: query.chapter,

            mode: "insensitive"

        };

    }

    if (query.search) {

        where.videoName = {

            contains: query.search,

            mode: "insensitive"

        };

    }

    if (typeof query.isActive === "boolean") {

        where.isActive = query.isActive;

    }

    const [videos, total] = await Promise.all([

        prisma.video.findMany({

            where,

            include: {

                course: {

                    select: {

                        id: true,

                        courseName: true

                    }

                }

            },

            skip,

            take: limit,

            orderBy: {

                createdAt: "asc"

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


export const getVideoByIdRepository = async (
    videoId: string
) => {

    return prisma.video.findUnique({

        where: {

            id: videoId

        },

         include: {

            course: {

                select: {

                    id: true,

                    courseName: true

                }

            }

        }


    });

};

export const updateVideoRepository = async (

    videoId: string,

    payload: UpdateVideoDto

) => {

    return prisma.video.update({

        where: {

            id: videoId

        },

        data: payload

    });

};

export const setVideoActiveRepository = async (
    videoId: string,
    isActive: boolean
) => {

    return prisma.video.update({
        where: {
            id: videoId
        },
        data: {
            isActive
        }
    });

};

export const permanentDeleteVideoRepository = async (
    videoId: string
) => {

    return prisma.video.delete({
        where: {
            id: videoId
        }
    });

};

export const deactivateVideoAccessRepository = async (
    videoId: string
) => {

    await prisma.userAccess.updateMany({
        where: {
            videoId
        },
        data: {
            isActive: false
        }
    });

};
