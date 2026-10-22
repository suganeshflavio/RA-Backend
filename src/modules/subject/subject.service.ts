import { AppError } from "../../utils/errors/AppError";
import { CreateSubjectDto, GetSubjectQueryDto, UpdateSubjectDto } from "./subject.types";
import {
    createSubjectRepository,
    findSubjectByName,
    getSubjectByIdRepository,
    getSubjectsRepository,
    permanentDeleteSubjectRepository,
    setSubjectActiveRepository,
    updateSubjectRepository
} from "./subject.repository";

export const createSubjectService = async (
    payload: CreateSubjectDto
) => {

    const existing = await findSubjectByName(payload.name);

    if (existing) {
        throw new AppError("Subject already exists", 409);
    }

    return createSubjectRepository(payload);

};

export const getSubjectsService = async (
    query: GetSubjectQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getSubjectsRepository(query);

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getSubjectByIdService = async (
    subjectId: string
) => {

    const subject = await getSubjectByIdRepository(subjectId);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    return subject;

};

export const updateSubjectService = async (
    subjectId: string,
    payload: UpdateSubjectDto
) => {

    const existing = await getSubjectByIdRepository(subjectId);

    if (!existing) {
        throw new AppError("Subject not found", 404);
    }

    if (payload.name) {

        const duplicate = await findSubjectByName(payload.name);

        if (duplicate && duplicate.id !== subjectId) {
            throw new AppError("Subject name already exists", 409);
        }

    }

    return updateSubjectRepository(subjectId, payload);

};

export const deleteSubjectService = async (
    subjectId: string
) => {

    const existing = await getSubjectByIdRepository(subjectId);

    if (!existing) {
        throw new AppError("Subject not found", 404);
    }

    return setSubjectActiveRepository(subjectId, false);

};

export const permanentDeleteSubjectService = async (
    subjectId: string
) => {

    const existing = await getSubjectByIdRepository(subjectId);

    if (!existing) {
        throw new AppError("Subject not found", 404);
    }

    await permanentDeleteSubjectRepository(subjectId);

    return { id: subjectId };

};
