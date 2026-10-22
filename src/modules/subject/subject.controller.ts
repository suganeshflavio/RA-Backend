import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";
import { createSubjectSchema, updateSubjectSchema } from "./subject.validation";
import {
    createSubjectService,
    deleteSubjectService,
    getSubjectByIdService,
    getSubjectsService,
    permanentDeleteSubjectService,
    updateSubjectService
} from "./subject.service";

export const createSubject = asyncHandler(async (req: Request, res: Response) => {

    const payload = createSubjectSchema.parse(req.body);

    const subject = await createSubjectService(payload);

    return successResponse(res, "Subject Created Successfully", subject, 201);

});

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {

    const data = await getSubjectsService({

        page: req.query.page ? Number(req.query.page) : 1,

        limit: req.query.limit ? Number(req.query.limit) : 10,

        search: req.query.search as string,

        isActive: resolveIsActive(req.query.isActive)

    });

    return successResponse(res, "Subjects fetched successfully", data);

});

export const getSubjectById = asyncHandler(async (req: Request, res: Response) => {

    const subject = await getSubjectByIdService(req.params.id as string);

    return successResponse(res, "Subject fetched successfully", subject);

});

export const updateSubject = asyncHandler(async (req: Request, res: Response) => {

    const payload = updateSubjectSchema.parse(req.body);

    const subject = await updateSubjectService(req.params.id as string, payload);

    return successResponse(res, "Subject Updated Successfully", subject);

});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {

    const subject = await deleteSubjectService(req.params.id as string);

    return successResponse(res, "Subject Deactivated Successfully", subject);

});

export const permanentDeleteSubject = asyncHandler(async (req: Request, res: Response) => {

    const result = await permanentDeleteSubjectService(req.params.id as string);

    return successResponse(res, "Subject Permanently Deleted", result);

});
