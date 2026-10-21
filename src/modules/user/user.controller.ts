import { Request, Response } from "express";

import { createUserSchema, updateUserSchema } from "./user.validation";

import {
    createStudentService,
    getUserByIdService,
    getUsersService,
    updateUserService,
    deleteUserService,
    permanentDeleteUserService
} from "./user.service";

import {

    successResponse,

    errorResponse

} from "../../utils/response";
import { asyncHandler } from "../../utils/asyncHandler";
import { resolveIsActive } from "../../utils/resolveIsActive";

export const createStudent = async (

    req: Request,

    res: Response

) => {

    // try {

        const payload = createUserSchema.parse(

            req.body

        );

        const student = await createStudentService(

            payload

        );

        return successResponse(

            res,

            "Student Created Successfully",

            student,

            201

        );

    // }

    // catch (error: any) {

        // return errorResponse(

        //     res,

        //     error.message,

        //     400

        // );

    // }

};


export const getUsers = asyncHandler(async (req: Request, res: Response) => {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = req.query.search as string;

    const isActive = resolveIsActive(req.query.isActive);

    const data = await getUsersService(
        page,
        limit,
        search,
        isActive
    );

    return successResponse(
        res,
        "Users fetched successfully",
        data
    );

});

export const getUserById = asyncHandler(
    async (req: Request, res: Response) => {

        const user = await getUserByIdService(
            req.params.id as string
        );
        console.log(req.params.id);

        return successResponse(

            res,

            "User fetched successfully",

            user

        );

    }

);

export const updateUser = asyncHandler(
    async (req: Request, res: Response) => {

        const payload = updateUserSchema.parse(
            req.body
        );

        const user = await updateUserService(
            req.params.id as string,
            payload
        );

        return successResponse(
            res,
            "User Updated Successfully",
            user
        );

    }
);

export const deleteUser = asyncHandler(
    async (req: Request, res: Response) => {

        const user = await deleteUserService(req.params.id as string);

        return successResponse(
            res,
            "User Deactivated Successfully",
            user
        );

    }
);

export const permanentDeleteUser = asyncHandler(
    async (req: Request, res: Response) => {

        const result = await permanentDeleteUserService(req.params.id as string);

        return successResponse(
            res,
            "User Permanently Deleted",
            result
        );

    }
);