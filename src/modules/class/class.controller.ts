import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";
import { createClassSchema, updateClassSchema } from "./class.validation";
import {
    createClassService,
    deleteClassService,
    getClassByIdService,
    getClassesService,
    permanentDeleteClassService,
    updateClassService
} from "./class.service";

export const createClass = asyncHandler(async (req: Request, res: Response) => {

    const payload = createClassSchema.parse(req.body);

    const klass = await createClassService(payload);

    return successResponse(res, "Class Created Successfully", klass, 201);

});

export const getClasses = asyncHandler(async (req: Request, res: Response) => {

    const data = await getClassesService({

        page: req.query.page ? Number(req.query.page) : 1,

        limit: req.query.limit ? Number(req.query.limit) : 10,

        search: req.query.search as string,

        subjectId: req.query.subjectId as string,

        isActive: resolveIsActive(req.query.isActive)

    });

    return successResponse(res, "Classes fetched successfully", data);

});

export const getClassById = asyncHandler(async (req: Request, res: Response) => {

    const klass = await getClassByIdService(req.params.id as string);

    return successResponse(res, "Class fetched successfully", klass);

});

export const updateClass = asyncHandler(async (req: Request, res: Response) => {

    const payload = updateClassSchema.parse(req.body);

    const klass = await updateClassService(req.params.id as string, payload);

    return successResponse(res, "Class Updated Successfully", klass);

});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {

    const klass = await deleteClassService(req.params.id as string);

    return successResponse(res, "Class Deactivated Successfully", klass);

});

export const permanentDeleteClass = asyncHandler(async (req: Request, res: Response) => {

    const result = await permanentDeleteClassService(req.params.id as string);

    return successResponse(res, "Class Permanently Deleted", result);

});
