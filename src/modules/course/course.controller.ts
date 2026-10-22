import { Request, Response } from "express";
import { updateCourseSchema } from "./course.validation";
import { asyncHandler } from "../../utils/asyncHandler";

import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";

import {
    createCourseSchema,
    linkTopicSchema,
    linkMcqTestSchema,
    linkNotesSchema,
    linkSubjectSchema,
    linkVideoSchema
} from "./course.validation";

import {
    createCourseService,
    getCourseByIdService,
    getCoursesService,
    updateCourseService,
    deleteCourseService,
    permanentDeleteCourseService,
    linkCourseSubjectService,
    unlinkCourseSubjectService,
    linkCourseTopicService,
    unlinkCourseTopicService,
    linkCourseVideoService,
    unlinkCourseVideoService,
    linkCourseNotesService,
    unlinkCourseNotesService,
    linkCourseMcqTestService,
    unlinkCourseMcqTestService
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

export const linkCourseSubject = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkSubjectSchema.parse(req.body);

    const result = await linkCourseSubjectService(
        req.params.id as string,
        payload.subjectId,
        payload.order,
        payload.classId
    );

    return successResponse(res, "Subject linked to course successfully", result, 201);

});

export const unlinkCourseSubject = asyncHandler(async (req: Request, res: Response) => {

    const result = await unlinkCourseSubjectService(
        req.params.id as string,
        req.params.linkId as string
    );

    return successResponse(res, "Subject unlinked from course successfully", result);

});

export const linkCourseTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkTopicSchema.parse(req.body);

    const result = await linkCourseTopicService(
        req.params.id as string,
        payload.topicId,
        payload.order
    );

    return successResponse(res, "Topic linked to course successfully", result, 201);

});

export const unlinkCourseTopic = asyncHandler(async (req: Request, res: Response) => {

    const result = await unlinkCourseTopicService(
        req.params.id as string,
        req.params.linkId as string
    );

    return successResponse(res, "Topic unlinked from course successfully", result);

});

export const linkCourseVideo = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkVideoSchema.parse(req.body);

    const result = await linkCourseVideoService(
        req.params.id as string,
        payload.videoId,
        payload.order,
        payload.classId
    );

    return successResponse(res, "Video linked to course successfully", result, 201);

});

export const unlinkCourseVideo = asyncHandler(async (req: Request, res: Response) => {

    const result = await unlinkCourseVideoService(
        req.params.id as string,
        req.params.linkId as string
    );

    return successResponse(res, "Video unlinked from course successfully", result);

});

export const linkCourseNotes = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkNotesSchema.parse(req.body);

    const result = await linkCourseNotesService(
        req.params.id as string,
        payload.notesId,
        payload.order,
        payload.classId
    );

    return successResponse(res, "Notes linked to course successfully", result, 201);

});

export const unlinkCourseNotes = asyncHandler(async (req: Request, res: Response) => {

    const result = await unlinkCourseNotesService(
        req.params.id as string,
        req.params.linkId as string
    );

    return successResponse(res, "Notes unlinked from course successfully", result);

});

export const linkCourseMcqTest = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkMcqTestSchema.parse(req.body);

    const result = await linkCourseMcqTestService(
        req.params.id as string,
        payload.testId,
        payload.order,
        payload.classId
    );

    return successResponse(res, "MCQ test linked to course successfully", result, 201);

});

export const unlinkCourseMcqTest = asyncHandler(async (req: Request, res: Response) => {

    const result = await unlinkCourseMcqTestService(
        req.params.id as string,
        req.params.linkId as string
    );

    return successResponse(res, "MCQ test unlinked from course successfully", result);

});
