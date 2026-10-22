import { AppError } from "../../utils/errors/AppError";
import { GetCourseQueryDto } from "./course.types";
import { deactivateCourseCascadeRepository, getCoursesRepository, updateCourseRepository } from "./course.repository";
import { CreateCourseDto } from "./course.types";
import { getCourseByIdRepository } from "./course.repository";
import { UpdateCourseDto } from "./course.types";

import {
    createCourseRepository,
    findCourseByName,
    setCourseActiveRepository,
    permanentDeleteCourseRepository,
    getSubjectByIdRepository,
    getClassByIdRepository,
    getTopicByIdRepository,
    getVideoByIdRepository,
    getNotesByIdRepository,
    getMcqTestByIdRepository,
    linkSubjectRepository,
    unlinkSubjectRepository,
    findCourseSubjectRepository,
    linkTopicRepository,
    unlinkTopicRepository,
    findCourseTopicRepository,
    linkVideoRepository,
    unlinkVideoRepository,
    findCourseVideoRepository,
    linkNotesRepository,
    unlinkNotesRepository,
    findCourseNotesRepository,
    linkMcqTestRepository,
    unlinkMcqTestRepository,
    findCourseMcqTestRepository
} from "./course.repository";

export const createCourseService = async (
    payload: CreateCourseDto
) => {

    const existingCourse = await findCourseByName(
        payload.courseName
    );

    if (existingCourse) {
        throw new AppError(
            "Course already exists",
            409
        );
    }

      if (payload.accessType === "free") {

    payload.enableEmi = false;

    payload.price = null as any;

    payload.strikePrice = null as any;

    payload.validityMonths = null as any;

    payload.installments = null as any;
  }


    const course = await createCourseRepository(payload);

    return course;
};


export const getCoursesService = async (
    query: GetCourseQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getCoursesRepository(
        page,
        limit,
        query.search,
        query.isActive
    );

    return {

        ...result,

        page,

        limit,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getCourseByIdService = async (
    courseId: string
) => {

    const course = await getCourseByIdRepository(
        courseId
    );

    if (!course) {

        throw new AppError(
            "Course not found",
            404
        );

    }

    return course;

};

export const updateCourseService = async (

    courseId: string,

    payload: UpdateCourseDto

) => {

    const existingCourse = await getCourseByIdRepository(

        courseId

    );

    if (!existingCourse) {

        throw new AppError(

            "Course not found",

            404

        );

    }

    if (payload.courseName) {

        const duplicate = await findCourseByName(

            payload.courseName

        );

        if (

            duplicate &&

            duplicate.id !== courseId

        ) {

            throw new AppError(

                "Course name already exists",

                409

            );

        }

    }

    const course = await updateCourseRepository(

        courseId,

        payload

    );

    if (payload.isActive === false) {

        await deactivateCourseCascadeRepository(courseId);

    }

    return course;

};

export const deleteCourseService = async (
    courseId: string
) => {

    const existingCourse = await getCourseByIdRepository(courseId);

    if (!existingCourse) {

        throw new AppError("Course not found", 404);

    }

    const course = await setCourseActiveRepository(courseId, false);

    await deactivateCourseCascadeRepository(courseId);

    return course;

};

export const permanentDeleteCourseService = async (
    courseId: string
) => {

    const existingCourse = await getCourseByIdRepository(courseId);

    if (!existingCourse) {

        throw new AppError("Course not found", 404);

    }

    await permanentDeleteCourseRepository(courseId);

    return { id: courseId };

};

const ensureCourseExists = async (courseId: string) => {

    const course = await getCourseByIdRepository(courseId);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    return course;

};

export const linkCourseSubjectService = async (
    courseId: string,
    subjectId: string,
    order?: number,
    classId?: string
) => {

    await ensureCourseExists(courseId);

    const subject = await getSubjectByIdRepository(subjectId);

    if (!subject) {
        throw new AppError("Subject not found", 404);
    }

    if (classId) {

        const klass = await getClassByIdRepository(classId);

        if (!klass) {
            throw new AppError("Class not found", 404);
        }

        if (klass.subjectId !== subjectId) {
            throw new AppError("Class does not belong to this subject", 400);
        }

    }

    const existing = await findCourseSubjectRepository(courseId, subjectId, classId);

    if (existing) {
        throw new AppError("Subject already linked to this course for that class", 409);
    }

    return linkSubjectRepository(courseId, subjectId, order, classId);

};

export const unlinkCourseSubjectService = async (
    courseId: string,
    courseSubjectId: string
) => {

    await ensureCourseExists(courseId);

    await unlinkSubjectRepository(courseId, courseSubjectId);

    return { courseId, courseSubjectId };

};

export const linkCourseTopicService = async (
    courseId: string,
    topicId: string,
    order?: number
) => {

    await ensureCourseExists(courseId);

    const topic = await getTopicByIdRepository(topicId);

    if (!topic) {
        throw new AppError("Topic not found", 404);
    }

    const existing = await findCourseTopicRepository(courseId, topicId);

    if (existing) {
        throw new AppError("Topic already linked to this course", 409);
    }

    return linkTopicRepository(courseId, topicId, order);

};

export const unlinkCourseTopicService = async (
    courseId: string,
    courseTopicId: string
) => {

    await ensureCourseExists(courseId);

    await unlinkTopicRepository(courseId, courseTopicId);

    return { courseId, courseTopicId };

};

const ensureClassExists = async (classId?: string) => {

    if (!classId) return;

    const klass = await getClassByIdRepository(classId);

    if (!klass) {
        throw new AppError("Class not found", 404);
    }

};

export const linkCourseVideoService = async (
    courseId: string,
    videoId: string,
    order?: number,
    classId?: string
) => {

    await ensureCourseExists(courseId);

    const video = await getVideoByIdRepository(videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    await ensureClassExists(classId);

    const existing = await findCourseVideoRepository(courseId, videoId, classId);

    if (existing) {
        throw new AppError("Video already linked to this course for that class", 409);
    }

    return linkVideoRepository(courseId, videoId, order, classId);

};

export const unlinkCourseVideoService = async (
    courseId: string,
    courseVideoId: string
) => {

    await ensureCourseExists(courseId);

    await unlinkVideoRepository(courseId, courseVideoId);

    return { courseId, courseVideoId };

};

export const linkCourseNotesService = async (
    courseId: string,
    notesId: string,
    order?: number,
    classId?: string
) => {

    await ensureCourseExists(courseId);

    const notes = await getNotesByIdRepository(notesId);

    if (!notes) {
        throw new AppError("Notes not found", 404);
    }

    await ensureClassExists(classId);

    const existing = await findCourseNotesRepository(courseId, notesId, classId);

    if (existing) {
        throw new AppError("Notes already linked to this course for that class", 409);
    }

    return linkNotesRepository(courseId, notesId, order, classId);

};

export const unlinkCourseNotesService = async (
    courseId: string,
    courseNotesId: string
) => {

    await ensureCourseExists(courseId);

    await unlinkNotesRepository(courseId, courseNotesId);

    return { courseId, courseNotesId };

};

export const linkCourseMcqTestService = async (
    courseId: string,
    testId: string,
    order?: number,
    classId?: string
) => {

    await ensureCourseExists(courseId);

    const test = await getMcqTestByIdRepository(testId);

    if (!test) {
        throw new AppError("MCQ test not found", 404);
    }

    await ensureClassExists(classId);

    const existing = await findCourseMcqTestRepository(courseId, testId, classId);

    if (existing) {
        throw new AppError("MCQ test already linked to this course for that class", 409);
    }

    return linkMcqTestRepository(courseId, testId, order, classId);

};

export const unlinkCourseMcqTestService = async (
    courseId: string,
    courseMcqTestId: string
) => {

    await ensureCourseExists(courseId);

    await unlinkMcqTestRepository(courseId, courseMcqTestId);

    return { courseId, courseMcqTestId };

};
