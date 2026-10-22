import { AppError } from "../../utils/errors/AppError";
import { CreateTopicDto, GetTopicQueryDto, UpdateTopicDto } from "./topic.types";
import {
    createTopicRepository,
    getChapterByIdRepository,
    getMcqTestByIdRepository,
    getNotesByIdRepository,
    getTopicByIdRepository,
    getTopicsRepository,
    getVideoByIdRepository,
    linkMcqTestRepository,
    linkNotesRepository,
    linkVideoRepository,
    permanentDeleteTopicRepository,
    setTopicActiveRepository,
    unlinkMcqTestRepository,
    unlinkNotesRepository,
    unlinkVideoRepository,
    updateTopicRepository
} from "./topic.repository";

export const createTopicService = async (
    payload: CreateTopicDto
) => {

    const chapter = await getChapterByIdRepository(payload.chapterId);

    if (!chapter) {
        throw new AppError("Chapter not found", 404);
    }

    return createTopicRepository(payload);

};

export const getTopicsService = async (
    query: GetTopicQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getTopicsRepository(query);

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getTopicByIdService = async (
    topicId: string
) => {

    const topic = await getTopicByIdRepository(topicId);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    return topic;

};

export const updateTopicService = async (
    topicId: string,
    payload: UpdateTopicDto
) => {

    const existing = await getTopicByIdRepository(topicId);

    if (!existing) {
        throw new AppError("Topic not found", 404);
    }

    return updateTopicRepository(topicId, payload);

};

export const deleteTopicService = async (
    topicId: string
) => {

    const existing = await getTopicByIdRepository(topicId);

    if (!existing) {
        throw new AppError("Topic not found", 404);
    }

    return setTopicActiveRepository(topicId, false);

};

export const permanentDeleteTopicService = async (
    topicId: string
) => {

    const existing = await getTopicByIdRepository(topicId);

    if (!existing) {
        throw new AppError("Topic not found", 404);
    }

    await permanentDeleteTopicRepository(topicId);

    return { id: topicId };

};

export const linkVideoToTopicService = async (
    topicId: string,
    videoId: string
) => {

    const [topic, video] = await Promise.all([
        getTopicByIdRepository(topicId),
        getVideoByIdRepository(videoId)
    ]);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    return linkVideoRepository(topicId, videoId);

};

export const unlinkVideoFromTopicService = async (
    topicId: string,
    videoId: string
) => {

    const topic = await getTopicByIdRepository(topicId);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    return unlinkVideoRepository(topicId, videoId);

};

export const linkMcqTestToTopicService = async (
    topicId: string,
    testId: string
) => {

    const [topic, test] = await Promise.all([
        getTopicByIdRepository(topicId),
        getMcqTestByIdRepository(testId)
    ]);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    if (!test) {
        throw new AppError("MCQ test not found", 404);
    }

    return linkMcqTestRepository(topicId, testId);

};

export const unlinkMcqTestFromTopicService = async (
    topicId: string,
    testId: string
) => {

    const topic = await getTopicByIdRepository(topicId);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    return unlinkMcqTestRepository(topicId, testId);

};

export const linkNotesToTopicService = async (
    topicId: string,
    notesId: string
) => {

    const [topic, notes] = await Promise.all([
        getTopicByIdRepository(topicId),
        getNotesByIdRepository(notesId)
    ]);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    return linkNotesRepository(topicId, notesId);

};

export const unlinkNotesFromTopicService = async (
    topicId: string,
    notesId: string
) => {

    const topic = await getTopicByIdRepository(topicId);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    return unlinkNotesRepository(topicId, notesId);

};
