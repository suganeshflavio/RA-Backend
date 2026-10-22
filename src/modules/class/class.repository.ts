import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateClassDto, GetClassQueryDto, UpdateClassDto } from "./class.types";

export const getSubjectByIdRepository = async (
    subjectId: string
) => {

    return prisma.subject.findUnique({
        where: { id: subjectId }
    });

};

export const findClassByName = async (
    subjectId: string,
    name: string
) => {

    return prisma.class.findFirst({
        where: { subjectId, name }
    });

};

export const createClassRepository = async (
    payload: CreateClassDto
) => {

    return prisma.class.create({
        data: payload
    });

};

export const getClassesRepository = async (
    query: GetClassQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.ClassWhereInput = {};

    if (query.subjectId) {
        where.subjectId = query.subjectId;
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

    const [classes, total] = await Promise.all([

        prisma.class.findMany({
            where,
            include: {
                subject: {
                    select: { id: true, name: true }
                }
            },
            skip,
            take: limit,
            orderBy: { name: "asc" }
        }),

        prisma.class.count({ where })

    ]);

    return { classes, total };

};

export const getClassByIdRepository = async (
    classId: string
) => {

    return prisma.class.findUnique({

        where: { id: classId },

        include: {

            subject: {
                select: { id: true, name: true }
            },

            chapters: {
                select: { id: true, name: true, isActive: true },
                orderBy: { name: "asc" }
            }

        }

    });

};

export const updateClassRepository = async (
    classId: string,
    payload: UpdateClassDto
) => {

    return prisma.class.update({
        where: { id: classId },
        data: payload
    });

};

export const setClassActiveRepository = async (
    classId: string,
    isActive: boolean
) => {

    return prisma.class.update({
        where: { id: classId },
        data: { isActive }
    });

};

export const permanentDeleteClassRepository = async (
    classId: string
) => {

    return prisma.class.delete({
        where: { id: classId }
    });

};
