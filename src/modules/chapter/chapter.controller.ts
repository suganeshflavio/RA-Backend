import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";
import { createChapterSchema, updateChapterSchema } from "./chapter.validation";
import {
    createChapterService,
    deleteChapterService,
    getChapterByIdService,
    getChaptersService,
    permanentDeleteChapterService,
    updateChapterService
} from "./chapter.service";

export const createChapter = asyncHandler(async (req: Request, res: Response) => {

    const payload = createChapterSchema.parse(req.body);

    const chapter = await createChapterService(payload);

    return successResponse(res, "Chapter Created Successfully", chapter, 201);

});

export const getChapters = asyncHandler(async (req: Request, res: Response) => {

    const data = await getChaptersService({

        page: req.query.page ? Number(req.query.page) : 1,

        limit: req.query.limit ? Number(req.query.limit) : 10,

        search: req.query.search as string,

        classId: req.query.classId as string,

        isActive: resolveIsActive(req.query.isActive)

    });

    return successResponse(res, "Chapters fetched successfully", data);

});

export const getChapterById = asyncHandler(async (req: Request, res: Response) => {

    const chapter = await getChapterByIdService(req.params.id as string);

    return successResponse(res, "Chapter fetched successfully", chapter);

});

export const updateChapter = asyncHandler(async (req: Request, res: Response) => {

    const payload = updateChapterSchema.parse(req.body);

    const chapter = await updateChapterService(req.params.id as string, payload);

    return successResponse(res, "Chapter Updated Successfully", chapter);

});

export const deleteChapter = asyncHandler(async (req: Request, res: Response) => {

    const chapter = await deleteChapterService(req.params.id as string);

    return successResponse(res, "Chapter Deactivated Successfully", chapter);

});

export const permanentDeleteChapter = asyncHandler(async (req: Request, res: Response) => {

    const result = await permanentDeleteChapterService(req.params.id as string);

    return successResponse(res, "Chapter Permanently Deleted", result);

});
