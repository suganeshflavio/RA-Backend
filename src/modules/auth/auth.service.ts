import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { generateToken } from "../../utils/jwt";

import {
    clearSession,
    findUserByEmail,
    updateSession,
    updatePasswordAndClearSession
} from "./auth.repository";
import { createStudent } from "../user/user.repository";
import { AppError } from "../../utils/errors/AppError";

// import { v4 as uuid } from "uuid";
import { randomUUID } from "node:crypto";
interface LoginPayload {

    email: string;

    password: string;

    deviceId: string;

}

interface RegisterPayload extends LoginPayload {
    name: string;
    email: string;
    mobile: string;
    class: string;
}

export const registerStudent = async (payload: RegisterPayload) => {
    const existingUser = await findUserByEmail(payload.email);

    if (existingUser) {
        throw new AppError("Email already exists", 400);
    }

    const password = await hashPassword(payload.password);
    const user = await createStudent({
        name: payload.name,
        email: payload.email,
        mobile: payload.mobile,
        class: payload.class,
        password,
        deviceId: payload.deviceId
    });

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        class: user.class,
        role: user.role
    };
};

export const checkStudentEmail = async (email: string) => {
    const user = await findUserByEmail(email);

    if (user?.role !== "STUDENT") {
        throw new AppError("Email not found", 404);
    }

    return { exists: true };
};

export const resetStudentPassword = async (email: string, password: string) => {
    const user = await findUserByEmail(email);

    if (user?.role !== "STUDENT") {
        throw new AppError("Email not found", 404);
    }

    await updatePasswordAndClearSession(user.id, await hashPassword(password));
};

export const adminLogin = async (
    payload: LoginPayload
) => {

    const user = await findUserByEmail(payload.email);

    if (!user) {

        throw new Error("Invalid Email or Password");

    }

    if (user.role !== "ADMIN") {

        throw new Error("Unauthorized");

    }

    const passwordMatched = await comparePassword(

        payload.password,

        user.password

    );

    if (!passwordMatched) {

        throw new Error("Invalid Email or Password");

    }

    const sessionToken = randomUUID();

    await updateSession(

        user.id,

        sessionToken,

        payload.deviceId

    );

    const token = generateToken({

        userId: user.id,

        role: user.role,

        sessionToken

    });

    return {

        token,

        user: {

            id: user.id,

            name: user.name,

            email: user.email

        }

    };

};


export const studentLogin = async (
    payload: LoginPayload
) => {
const user = await findUserByEmail(payload.email);

if (!user) {
    throw new Error("Invalid Email or Password");
}

if(user.role !== "STUDENT"){
    throw new Error("Unauthorized User");
}

if(!user.isActive){
    throw new Error("Account Deactivated. Contact Admin.");
}

const passwordMatched = await comparePassword(
    payload.password,
    user.password
);

if (!passwordMatched) {
    throw new Error("Invalid Email or Password");
}

if (
    user.deviceId &&
    user.deviceId !== payload.deviceId
) {

    throw new Error(
        "Your account is already logged in on another device."
    );

}

const sessionToken = randomUUID();

await updateSession(
    user.id,
    sessionToken,
    payload.deviceId
);

const token = generateToken({
    userId: user.id,
    role: user.role,
    sessionToken
});

return {
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email
    }
};
}


export const logout = async (
    userId: string
) => {

    await clearSession(userId);

};