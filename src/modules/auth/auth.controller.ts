import { Request, Response } from "express";

import {
    adminLoginSchema,
    forgotPasswordEmailSchema,
    resetPasswordSchema,
    studentLoginSchema,
    studentRegisterSchema
} from "./auth.validation";

import {
    adminLogin,
    checkStudentEmail,
    logout,
    registerStudent,
    resetStudentPassword,
    studentLogin
} from "./auth.service";

import {
    errorResponse,
    successResponse
} from "../../utils/response";

export const adminLoginController = async (

    req: Request,

    res: Response

) => {

    try {

        const payload = adminLoginSchema.parse(req.body);

        const data = await adminLogin(payload);

        return successResponse(

            res,

            "Login Successful",

            data

        );

    }

    catch (error: any) {

        return errorResponse(

            res,

            error.message,

            400

        );

    }

};

export const studentLoginController = async (
    req: Request,
    res: Response
) => {

    try {

        const payload = studentLoginSchema.parse(req.body);

        const data = await studentLogin(payload);

        return successResponse(
            res,
            "Login Successful",
            data
        );

    } catch (error: any) {

        return errorResponse(
            res,
            error.message,
            400
        );

    }

};


export const logoutController = async (
    req: Request,
    res: Response
) => {

    await logout(
        req.user!.userId
    );

    return successResponse(
        res,
        "Logout Successful"
    );

};

export const studentRegisterController = async (
    req: Request,
    res: Response
) => {
    try {
        const payload = studentRegisterSchema.parse(req.body);
        const data = await registerStudent(payload);

        return successResponse(res, "Registration Successful", data, 201);
    } catch (error: any) {
        return errorResponse(res, error.message, error.statusCode || 400);
    }
};

export const checkStudentEmailController = async (
    req: Request,
    res: Response
) => {
    try {
        const { email } = forgotPasswordEmailSchema.parse(req.body);
        const data = await checkStudentEmail(email);

        return successResponse(res, "Email exists", data);
    } catch (error: any) {
        return errorResponse(res, error.message, error.statusCode || 400);
    }
};

export const resetStudentPasswordController = async (
    req: Request,
    res: Response
) => {
    try {
        const payload = resetPasswordSchema.parse(req.body);
        await resetStudentPassword(payload.email, payload.password);

        return successResponse(res, "Password changed successfully");
    } catch (error: any) {
        return errorResponse(res, error.message, error.statusCode || 400);
    }
};