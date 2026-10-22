import { AppError } from "../../utils/errors/AppError";
import { deleteB2File, getB2SignedUrl } from "../../utils/b2";
import { CreateNotesDto, GetNotesQueryDto, UpdateNotesDto } from "./notes.types";
import {
    createNotesRepository,
    getNotesByIdRepository,
    getNotesListRepository,
    permanentDeleteNotesRepository,
    setNotesActiveRepository,
    updateNotesRepository
} from "./notes.repository";

// All uploads go to B2, whose keys always look like "notes/<ts>-<name>".
// Notes uploaded before the B2 migration have a bare Cloudinary public
// id/original filename (no slash) in these same columns instead — those
// still display fine (notesUrl was stored as a direct, permanent Cloudinary
// URL), they just can't be deleted from Cloudinary via the app anymore.
const isB2Key = (fileName?: string | null): fileName is string =>
    !!fileName && fileName.includes("/");

const enrichNotes = async <T extends {
    notesFileName: string | null;
    notesUrl: string | null;
}>(notes: T) => {

    const notesUrl = isB2Key(notes.notesFileName)
        ? await getB2SignedUrl(notes.notesFileName)
        : notes.notesUrl;

    return {
        ...notes,
        notesUrl
    };

};

const deleteOldNotesFile = async (
    fileId: string,
    fileName: string | null
) => {

    if (isB2Key(fileName)) {
        await deleteB2File(fileId, fileName).catch(() => {});
    }

};

export const createNotesService = async (
    payload: CreateNotesDto
) => {

    return createNotesRepository(payload);

};

export const getNotesListService = async (
    query: GetNotesQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getNotesListRepository(query);

    const notes = await Promise.all(result.notes.map(enrichNotes));

    return {

        ...result,

        notes,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getNotesByIdService = async (
    notesId: string
) => {

    const notes = await getNotesByIdRepository(notesId);

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    return enrichNotes(notes);

};

export const updateNotesService = async (
    notesId: string,
    payload: UpdateNotesDto
) => {

    const notes = await getNotesByIdRepository(notesId);

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    const updated = await updateNotesRepository(notesId, payload);

    if (
        payload.notesFileId &&
        notes.notesFileId &&
        payload.notesFileId !== notes.notesFileId
    ) {

        await deleteOldNotesFile(notes.notesFileId, notes.notesFileName);

    }

    return updated;

};

export const deleteNotesService = async (
    notesId: string
) => {

    const notes = await getNotesByIdRepository(notesId);

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    return setNotesActiveRepository(notesId, false);

};

export const permanentDeleteNotesService = async (
    notesId: string
) => {

    const notes = await getNotesByIdRepository(notesId);

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    if (notes.notesFileId) {
        await deleteOldNotesFile(notes.notesFileId, notes.notesFileName);
    }

    await permanentDeleteNotesRepository(notesId);

    return { id: notesId };

};
