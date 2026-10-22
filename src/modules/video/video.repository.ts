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

export const getVideosRepository = async (

    query: GetVideoQueryDto

) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.VideoWhereInput = {};

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

                topics: {

                    select: {

                        id: true,

                        name: true

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

            topics: {

                select: {

                    id: true,

                    name: true

                }

            },

            courses: {

                select: {

                    courseId: true,

                    order: true,

                    isActive: true,

                    course: {

                        select: {

                            id: true,

                            courseName: true

                        }

                    }

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
