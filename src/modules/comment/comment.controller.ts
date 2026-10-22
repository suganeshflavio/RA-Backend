import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { createCommentSchema, replyCommentSchema } from "./comment.validation";
import {
    createCommentService,
    deleteCommentService,
    getAdminCommentsService,
    getVideoCommentsService,
    replyCommentService
} from "./comment.service";

export const createComment = asyncHandler(async (req: Request, res: Response) => {

    const payload = createCommentSchema.parse(req.body);

    const comment = await createCommentService({
        ...payload,
        userId: req.user!.userId
    });

    return successResponse(res, "Comment Added Successfully", comment, 201);

});

export const replyComment = asyncHandler(async (req: Request, res: Response) => {

    const payload = replyCommentSchema.parse(req.body);

    const reply = await replyCommentService(req.params.id as string, {
        message: payload.message,
        userId: req.user!.userId
    });

    return successResponse(res, "Reply Added Successfully", reply, 201);

});

export const getVideoComments = asyncHandler(async (req: Request, res: Response) => {

    const comments = await getVideoCommentsService(req.params.videoId as string);

    return successResponse(res, "Comments fetched successfully", comments);

});

export const getAdminComments = asyncHandler(async (req: Request, res: Response) => {

    const data = await getAdminCommentsService({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        videoName: req.query.videoName as string
    });

    return successResponse(res, "Comments fetched successfully", data);

});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {

    const result = await deleteCommentService(req.params.id as string);

    return successResponse(res, "Comment Deleted Successfully", result);

});
