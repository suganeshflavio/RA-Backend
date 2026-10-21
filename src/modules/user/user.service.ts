import { hashPassword } from "../../utils/bcrypt";
import { AppError } from "../../utils/errors/AppError";

import {

    createStudent,

    findStudentByEmail,
    getUserByIdRepository,
    getUsersRepository,
    updateUserRepository,
    setUserActiveRepository,
    permanentDeleteUserRepository

} from "./user.repository";

interface CreateStudentPayload {

    name: string;

    email: string;

    password: string;

    mobile?: string;

    class?: string;

}

interface UpdateStudentPayload {

    name?: string;

    email?: string;

    password?: string;

    mobile?: string;

    class?: string;

    isActive?: boolean;

}

export const createStudentService = async (

    payload: CreateStudentPayload

) => {

    const existingUser = await findStudentByEmail(

        payload.email

    );

    if (existingUser) {

        throw new AppError("Email already exists", 400);

    }

    const hashedPassword = await hashPassword(

        payload.password

    );

    const user = await createStudent({

        ...payload,

        password: hashedPassword

    });

    return {

        id: user.id,

        name: user.name,

        email: user.email

    };

};


export const getUsersService = async (
    page: number,
    limit: number,
    search?: string,
    isActive?: boolean
) => {

    const result = await getUsersRepository(
        page,
        limit,
        search,
        isActive
    );

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getUserByIdService = async (
    userId: string
) => {

    const user = await getUserByIdRepository(userId);

    if (!user) {

        throw new AppError(
            "User not found",
            404
        );

    }

    return user;

};

export const updateUserService = async (
    userId: string,
    payload: UpdateStudentPayload
) => {

    const existingUser = await getUserByIdRepository(userId);

    if (!existingUser) {

        throw new AppError("User not found", 404);

    }

    if (payload.email) {

        const duplicate = await findStudentByEmail(payload.email);

        if (duplicate && duplicate.id !== userId) {

            throw new AppError("Email already exists", 400);

        }

    }

    const { password, ...rest } = payload;

    const data: UpdateStudentPayload = { ...rest };

    if (password) {

        data.password = await hashPassword(password);

    }

    return updateUserRepository(userId, data);

};

export const deleteUserService = async (
    userId: string
) => {

    const existingUser = await getUserByIdRepository(userId);

    if (!existingUser) {

        throw new AppError("User not found", 404);

    }

    return setUserActiveRepository(userId, false);

};

export const permanentDeleteUserService = async (
    userId: string
) => {

    const existingUser = await getUserByIdRepository(userId);

    if (!existingUser) {

        throw new AppError("User not found", 404);

    }

    await permanentDeleteUserRepository(userId);

    return { id: userId };

};

