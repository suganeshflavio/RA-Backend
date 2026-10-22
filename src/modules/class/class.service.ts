import { AppError } from "../../utils/errors/AppError";
import { CreateClassDto, GetClassQueryDto, UpdateClassDto } from "./class.types";
import {
    createClassRepository,
    findClassByName,
    getClassByIdRepository,
    getClassesRepository,
    getSubjectByIdRepository,
    permanentDeleteClassRepository,
    setClassActiveRepository,
    updateClassRepository
} from "./class.repository";

export const createClassService = async (
    payload: CreateClassDto
) => {

    const subject = await getSubjectByIdRepository(payload.subjectId);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    const existing = await findClassByName(payload.subjectId, payload.name);

    if (existing) {
        throw new AppError("Class already exists under this subject", 409);
    }

    return createClassRepository(payload);

};

export const getClassesService = async (
    query: GetClassQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getClassesRepository(query);

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getClassByIdService = async (
    classId: string
) => {

    const klass = await getClassByIdRepository(classId);

    if (!klass) {
        throw new AppError("Class not found", 404);
    }

    return klass;

};

export const updateClassService = async (
    classId: string,
    payload: UpdateClassDto
) => {

    const existing = await getClassByIdRepository(classId);

    if (!existing) {
        throw new AppError("Class not found", 404);
    }

    if (payload.name) {

        const duplicate = await findClassByName(existing.subjectId, payload.name);

        if (duplicate && duplicate.id !== classId) {
            throw new AppError("Class name already exists under this subject", 409);
        }

    }

    return updateClassRepository(classId, payload);

};

export const deleteClassService = async (
    classId: string
) => {

    const existing = await getClassByIdRepository(classId);

    if (!existing) {
        throw new AppError("Class not found", 404);
    }

    return setClassActiveRepository(classId, false);

};

export const permanentDeleteClassService = async (
    classId: string
) => {

    const existing = await getClassByIdRepository(classId);

    if (!existing) {
        throw new AppError("Class not found", 404);
    }

    await permanentDeleteClassRepository(classId);

    return { id: classId };

};
