import { Request, Response } from "express";
import { updateCourseSchema } from "./course.validation";
import { asyncHandler } from "../../utils/asyncHandler";

import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";

import { createCourseSchema } from "./course.validation";

import {
    createCourseService,
    getCourseByIdService,
    getCoursesService,
    updateCourseService,
    deleteCourseService,
    permanentDeleteCourseService
} from "./course.service";

export const createCourse = asyncHandler(

    async (
        req: Request,
        res: Response
    ) => {

        const payload = createCourseSchema.parse(
            req.body
        );

        const course = await createCourseService(
            payload
        );

        return successResponse(

            res,

            "Course Created Successfully",

            course,

            201

        );

    }

);


export const getCourses = asyncHandler(

    async (req: Request, res: Response) => {

        const data = await getCoursesService({

            page: req.query.page
                ? Number(req.query.page)
                : 1,

            limit: req.query.limit
                ? Number(req.query.limit)
                : 10,

            search: req.query.search as string,

            isActive: resolveIsActive(req.query.isActive)

        });

        return successResponse(

            res,

            "Courses fetched successfully",

            data

        );

    }

);


export const getCourseById = asyncHandler(

    async (req: Request, res: Response) => {

        const { id } = req.params;

        const course = await getCourseByIdService(id as string);

        return successResponse(

            res,

            "Course fetched successfully",

            course

        );

    }

);


export const updateCourse = asyncHandler(

    async (

        req: Request,

        res: Response

    ) => {

        const payload = updateCourseSchema.parse(

            req.body

        );

        const course = await updateCourseService(

            req.params.id as string,

            payload

        );

        return successResponse(

            res,

            "Course Updated Successfully",

            course

        );

    }

);


export const deleteCourse = asyncHandler(

    async (req: Request, res: Response) => {

        const course = await deleteCourseService(req.params.id as string);

        return successResponse(

            res,

            "Course Deactivated Successfully",

            course

        );

    }

);


export const permanentDeleteCourse = asyncHandler(

    async (req: Request, res: Response) => {

        const result = await permanentDeleteCourseService(req.params.id as string);

        return successResponse(

            res,

            "Course Permanently Deleted",

            result

        );

    }

);