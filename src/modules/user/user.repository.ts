import prisma from "../../config/prisma";
import { Prisma } from "@prisma/client";

export const findStudentByEmail = async (
    email: string
) => {

    return prisma.user.findUnique({

        where: {

            email

        }

    });

};

export const createStudent = async (

    data: {

        name: string;

        email: string;

        password: string;

        mobile?: string;

        class?: string;

        deviceId?: string;

    }

) => {

    return prisma.user.create({

        data: {

            ...data,

            role: "STUDENT"

        }

    });

};



export const getUsersRepository = async (
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean
) => {

    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
        mobile: {
          contains: search,
        },
      },
            {
                email: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ];
    }

    if (typeof isActive === "boolean") {
        where.isActive = isActive;
    }

    const [users, total] = await Promise.all([

        prisma.user.findMany({

            where,

            skip,

            take: limit,

            orderBy: {

                createdAt: "desc"

            },

            select: {

                id: true,
                name: true,
                email: true,
                mobile: true,
                class: true,
                isActive: true,
                isAccess: true,
                role: true,
                createdAt: true,
                updatedAt: true

            }

        }),

        prisma.user.count({

            where

        })

    ]);

    return {

        users,

        total

    };

};

export const getUserByIdRepository = async (
    id: string
) => {

    return prisma.user.findUnique({

        where: {
            id
        },

        select: {

            id: true,

            name: true,

            mobile: true,

            class: true,

            email: true,

            role: true,

            isActive: true,

            isAccess: true,

            createdAt: true,

            updatedAt: true

        }

    });

};


export const setUserActiveRepository = async (
    userId: string,
    isActive: boolean
) => {

    return prisma.user.update({

        where: {

            id: userId

        },

        data: {

            isActive

        },

        select: {

            id: true,

            name: true,

            mobile: true,

            class: true,

            email: true,

            role: true,

            isActive: true,

            isAccess: true

        }

    });

};

export const permanentDeleteUserRepository = async (
    userId: string
) => {

    return prisma.user.delete({
        where: {
            id: userId
        }
    });

};

export const updateUserRepository = async (

    userId: string,

    payload: Prisma.UserUpdateInput

) => {

    return prisma.user.update({

        where: {

            id: userId

        },

        data: payload,

        select: {

            id: true,

            name: true,

            mobile: true,

            class: true,

            email: true,

            role: true,

            isActive: true,

            isAccess: true

        }

    });

};