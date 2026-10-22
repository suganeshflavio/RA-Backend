import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateChapterDto, GetChapterQueryDto, UpdateChapterDto } from "./chapter.types";

export const getClassByIdRepository = async (
    classId: string
) => {

    return prisma.class.findUnique({
        where: { id: classId }
    });

};

export const findChapterByName = async (
    classId: string,
    name: string
) => {

    return prisma.chapter.findFirst({
        where: { classId, name }
    });

};

export const createChapterRepository = async (
    payload: CreateChapterDto
) => {

    return prisma.chapter.create({
        data: payload
    });

};

export const getChaptersRepository = async (
    query: GetChapterQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.ChapterWhereInput = {};

    if (query.classId) {
        where.classId = query.classId;
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

    const [chapters, total] = await Promise.all([

        prisma.chapter.findMany({
            where,
            include: {
                class: {
                    select: {
                        id: true,
                        name: true,
                        subject: {
                            select: { id: true, name: true }
                        }
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { name: "asc" }
        }),

        prisma.chapter.count({ where })

    ]);

    return { chapters, total };

};

export const getChapterByIdRepository = async (
    chapterId: string
) => {

    return prisma.chapter.findUnique({

        where: { id: chapterId },

        include: {

            class: {
                select: {
                    id: true,
                    name: true,
                    subject: {
                        select: { id: true, name: true }
                    }
                }
            },

            topics: {
                select: { id: true, name: true, isActive: true, order: true },
                orderBy: { order: "asc" }
            }

        }

    });

};

export const updateChapterRepository = async (
    chapterId: string,
    payload: UpdateChapterDto
) => {

    return prisma.chapter.update({
        where: { id: chapterId },
        data: payload
    });

};

export const setChapterActiveRepository = async (
    chapterId: string,
    isActive: boolean
) => {

    return prisma.chapter.update({
        where: { id: chapterId },
        data: { isActive }
    });

};

export const permanentDeleteChapterRepository = async (
    chapterId: string
) => {

    return prisma.chapter.delete({
        where: { id: chapterId }
    });

};
