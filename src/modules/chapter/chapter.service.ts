import { AppError } from "../../utils/errors/AppError";
import { CreateChapterDto, GetChapterQueryDto, UpdateChapterDto } from "./chapter.types";
import {
    createChapterRepository,
    findChapterByName,
    getChapterByIdRepository,
    getChaptersRepository,
    getClassByIdRepository,
    permanentDeleteChapterRepository,
    setChapterActiveRepository,
    updateChapterRepository
} from "./chapter.repository";

export const createChapterService = async (
    payload: CreateChapterDto
) => {

    const klass = await getClassByIdRepository(payload.classId);

    if (!klass) {
        throw new AppError("Class not found", 404);
    }

    const existing = await findChapterByName(payload.classId, payload.name);

    if (existing) {
        throw new AppError("Chapter already exists under this class", 409);
    }

    return createChapterRepository(payload);

};

export const getChaptersService = async (
    query: GetChapterQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getChaptersRepository(query);

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getChapterByIdService = async (
    chapterId: string
) => {

    const chapter = await getChapterByIdRepository(chapterId);

    if (!chapter) {
        throw new AppError("Chapter not found", 404);
    }

    return chapter;

};

export const updateChapterService = async (
    chapterId: string,
    payload: UpdateChapterDto
) => {

    const existing = await getChapterByIdRepository(chapterId);

    if (!existing) {
        throw new AppError("Chapter not found", 404);
    }

    if (payload.name) {

        const duplicate = await findChapterByName(existing.classId, payload.name);

        if (duplicate && duplicate.id !== chapterId) {
            throw new AppError("Chapter name already exists under this class", 409);
        }

    }

    return updateChapterRepository(chapterId, payload);

};

export const deleteChapterService = async (
    chapterId: string
) => {

    const existing = await getChapterByIdRepository(chapterId);

    if (!existing) {
        throw new AppError("Chapter not found", 404);
    }

    return setChapterActiveRepository(chapterId, false);

};

export const permanentDeleteChapterService = async (
    chapterId: string
) => {

    const existing = await getChapterByIdRepository(chapterId);

    if (!existing) {
        throw new AppError("Chapter not found", 404);
    }

    await permanentDeleteChapterRepository(chapterId);

    return { id: chapterId };

};
