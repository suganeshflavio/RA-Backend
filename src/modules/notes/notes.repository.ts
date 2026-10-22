import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateNotesDto, GetNotesQueryDto, UpdateNotesDto } from "./notes.types";

export const createNotesRepository = async (
    payload: CreateNotesDto
) => {

    return prisma.notes.create({
        data: payload
    });

};

export const getNotesListRepository = async (
    query: GetNotesQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.NotesWhereInput = {};

    if (query.search) {

        where.title = {
            contains: query.search,
            mode: "insensitive"
        };

    }

    if (typeof query.isActive === "boolean") {

        where.isActive = query.isActive;

    }

    const [notes, total] = await Promise.all([

        prisma.notes.findMany({

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

        prisma.notes.count({
            where
        })

    ]);

    return {
        notes,
        total
    };

};

export const getNotesByIdRepository = async (
    notesId: string
) => {

    return prisma.notes.findUnique({

        where: {
            id: notesId
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

export const updateNotesRepository = async (
    notesId: string,
    payload: UpdateNotesDto
) => {

    return prisma.notes.update({
        where: {
            id: notesId
        },
        data: payload
    });

};

export const setNotesActiveRepository = async (
    notesId: string,
    isActive: boolean
) => {

    return prisma.notes.update({
        where: {
            id: notesId
        },
        data: {
            isActive
        }
    });

};

export const permanentDeleteNotesRepository = async (
    notesId: string
) => {

    return prisma.notes.delete({
        where: {
            id: notesId
        }
    });

};
