import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { resolveIsActive } from "../../utils/resolveIsActive";
import {
    createTopicSchema,
    linkMcqTestSchema,
    linkNotesSchema,
    linkVideoSchema,
    updateTopicSchema
} from "./topic.validation";
import {
    createTopicService,
    deleteTopicService,
    getTopicByIdService,
    getTopicsService,
    linkMcqTestToTopicService,
    linkNotesToTopicService,
    linkVideoToTopicService,
    permanentDeleteTopicService,
    unlinkMcqTestFromTopicService,
    unlinkNotesFromTopicService,
    unlinkVideoFromTopicService,
    updateTopicService
} from "./topic.service";

export const createTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = createTopicSchema.parse(req.body);

    const topic = await createTopicService(payload);

    return successResponse(res, "Topic Created Successfully", topic, 201);

});

export const getTopics = asyncHandler(async (req: Request, res: Response) => {

    const data = await getTopicsService({

        page: req.query.page ? Number(req.query.page) : 1,

        limit: req.query.limit ? Number(req.query.limit) : 10,

        search: req.query.search as string,

        chapterId: req.query.chapterId as string,

        isActive: resolveIsActive(req.query.isActive)

    });

    return successResponse(res, "Topics fetched successfully", data);

});

export const getTopicById = asyncHandler(async (req: Request, res: Response) => {

    const topic = await getTopicByIdService(req.params.id as string);

    return successResponse(res, "Topic fetched successfully", topic);

});

export const updateTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = updateTopicSchema.parse(req.body);

    const topic = await updateTopicService(req.params.id as string, payload);

    return successResponse(res, "Topic Updated Successfully", topic);

});

export const deleteTopic = asyncHandler(async (req: Request, res: Response) => {

    const topic = await deleteTopicService(req.params.id as string);

    return successResponse(res, "Topic Deactivated Successfully", topic);

});

export const permanentDeleteTopic = asyncHandler(async (req: Request, res: Response) => {

    const result = await permanentDeleteTopicService(req.params.id as string);

    return successResponse(res, "Topic Permanently Deleted", result);

});

export const linkVideoToTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkVideoSchema.parse(req.body);

    const topic = await linkVideoToTopicService(req.params.id as string, payload.videoId);

    return successResponse(res, "Video linked to topic successfully", topic);

});

export const unlinkVideoFromTopic = asyncHandler(async (req: Request, res: Response) => {

    const topic = await unlinkVideoFromTopicService(
        req.params.id as string,
        req.params.videoId as string
    );

    return successResponse(res, "Video unlinked from topic successfully", topic);

});

export const linkMcqTestToTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkMcqTestSchema.parse(req.body);

    const topic = await linkMcqTestToTopicService(req.params.id as string, payload.testId);

    return successResponse(res, "MCQ test linked to topic successfully", topic);

});

export const unlinkMcqTestFromTopic = asyncHandler(async (req: Request, res: Response) => {

    const topic = await unlinkMcqTestFromTopicService(
        req.params.id as string,
        req.params.testId as string
    );

    return successResponse(res, "MCQ test unlinked from topic successfully", topic);

});

export const linkNotesToTopic = asyncHandler(async (req: Request, res: Response) => {

    const payload = linkNotesSchema.parse(req.body);

    const topic = await linkNotesToTopicService(req.params.id as string, payload.notesId);

    return successResponse(res, "Notes linked to topic successfully", topic);

});

export const unlinkNotesFromTopic = asyncHandler(async (req: Request, res: Response) => {

    const topic = await unlinkNotesFromTopicService(
        req.params.id as string,
        req.params.notesId as string
    );

    return successResponse(res, "Notes unlinked from topic successfully", topic);

});
