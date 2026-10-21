import { AppError } from "../../utils/errors/AppError";
import { GetCourseQueryDto } from "./course.types";
import { deactivateCourseCascadeRepository, getCoursesRepository, updateCourseRepository } from "./course.repository";
import { CreateCourseDto } from "./course.types";
import { getCourseByIdRepository } from "./course.repository";
import { UpdateCourseDto } from "./course.types";
import { deleteB2File } from "../../utils/b2";
import { deleteFromCloudinary } from "../../utils/uploadToCloudinary";

import {
    createCourseRepository,
    findCourseByName,
    setCourseActiveRepository,
    getCourseVideoFilesRepository,
    permanentDeleteCourseRepository
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

    const videos = await getCourseVideoFilesRepository(courseId);

    await Promise.all(

        videos.flatMap((video) => [

            video.videoFileId && video.videoFileName
                ? deleteB2File(video.videoFileId, video.videoFileName)
                : null,

            video.notesFileId
                ? deleteFromCloudinary(video.notesFileId)
                : null

        ].filter((entry): entry is Promise<void> => entry !== null))

    );

    await permanentDeleteCourseRepository(courseId);

    return { id: courseId };

};