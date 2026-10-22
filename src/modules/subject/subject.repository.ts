import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";
import { CreateSubjectDto, GetSubjectQueryDto, UpdateSubjectDto } from "./subject.types";

export const findSubjectByName = async (
    name: string
) => {

    return prisma.subject.findFirst({
        where: { name }
    });

};

export const createSubjectRepository = async (
    payload: CreateSubjectDto
) => {

    return prisma.subject.create({
        data: payload
    });

};

export const getSubjectsRepository = async (
    query: GetSubjectQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.SubjectWhereInput = {};

    if (query.search) {

        where.name = {
            contains: query.search,
            mode: "insensitive"
        };

    }

    if (typeof query.isActive === "boolean") {

        where.isActive = query.isActive;

    }

    const [subjects, total] = await Promise.all([

        prisma.subject.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: "asc" }
        }),

        prisma.subject.count({ where })

    ]);

    return { subjects, total };

};

export const getSubjectByIdRepository = async (
    subjectId: string
) => {

    return prisma.subject.findUnique({

        where: { id: subjectId },

        include: {

            classes: {
                select: {
                    id: true,
                    name: true,
                    isActive: true
                },
                orderBy: { name: "asc" }
            }

        }

    });

};

export const updateSubjectRepository = async (
    subjectId: string,
    payload: UpdateSubjectDto
) => {

    return prisma.subject.update({
        where: { id: subjectId },
        data: payload
    });

};

export const setSubjectActiveRepository = async (
    subjectId: string,
    isActive: boolean
) => {

    return prisma.subject.update({
        where: { id: subjectId },
        data: { isActive }
    });

};

export const permanentDeleteSubjectRepository = async (
    subjectId: string
) => {

    return prisma.subject.delete({
        where: { id: subjectId }
    });

};
