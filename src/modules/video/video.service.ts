import { AppError } from "../../utils/errors/AppError";
import { CreateVideoDto, GetVideoQueryDto, UpdateVideoDto } from "./video.types";
import { getB2SignedUrl, getB2UploadUrl, sanitizeFileName, encodeB2FileName, deleteB2File } from "../../utils/b2";
import { deleteFromCloudinary } from "../../utils/uploadToCloudinary";
import {
    createVideoRepository,
    deactivateVideoAccessRepository,
    getCourseRepository,
    getVideoByIdRepository,
    getVideosRepository,
    updateVideoRepository,
    setVideoActiveRepository,
    permanentDeleteVideoRepository
} from "./video.repository";

const enrichVideo = async <T extends {
    videoFileName: string | null;
    notesUrl: string | null;
}>(video: T) => {

    const videoUrl = video.videoFileName
        ? await getB2SignedUrl(video.videoFileName)
        : null;

    return {
        ...video,
        videoUrl
    };

};

export const createVideoService = async (
    payload: CreateVideoDto
) => {

    const course = await getCourseRepository(payload.courseId);

    if (!course) {
        throw new AppError("Course not found", 404);
    }

    if (!course.isActive) {
        throw new AppError("Course is inactive", 400);
    }

    return createVideoRepository(payload);

};

export const getVideosService = async (

    query: GetVideoQueryDto

) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getVideosRepository(query);

    const videos = await Promise.all(result.videos.map(enrichVideo));

    return {

        ...result,

        videos,

        page,

        limit,

        totalPages: Math.ceil(

            result.total / limit

        )

    };

};


export const updateVideoService = async (

    videoId: string,

    payload: UpdateVideoDto

) => {

    const video = await getVideoByIdRepository(

        videoId

    );

    if (!video) {

        throw new AppError(

            "Video not found",

            404

        );

    }

    if (payload.courseId) {

        const course = await getCourseRepository(

            payload.courseId

        );

        if (!course) {

            throw new AppError(

                "Course not found",

                404

            );

        }

        if (!course.isActive) {

            throw new AppError(

                "Course is inactive",

                400

            );

        }

    }

    const updatedVideo = await updateVideoRepository(

        videoId,

        payload

    );

    if (
        payload.videoFileName &&
        video.videoFileId &&
        video.videoFileName &&
        payload.videoFileName !== video.videoFileName
    ) {

        await deleteB2File(video.videoFileId, video.videoFileName).catch(() => {});

    }

    if (
        payload.notesFileId &&
        video.notesFileId &&
        payload.notesFileId !== video.notesFileId
    ) {

        await deleteFromCloudinary(video.notesFileId);

    }

    if (payload.isActive === false) {

        await deactivateVideoAccessRepository(videoId);

    }

    return updatedVideo;

};

export const getVideoByIdService = async (
    videoId: string
) => {

    const video = await getVideoByIdRepository(videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    return enrichVideo(video);
};

export const deleteVideoService = async (
    videoId: string
) => {

    const video = await getVideoByIdRepository(videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    const updated = await setVideoActiveRepository(videoId, false);

    await deactivateVideoAccessRepository(videoId);

    return updated;

};

export const permanentDeleteVideoService = async (
    videoId: string
) => {

    const video = await getVideoByIdRepository(videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    await Promise.all([
        video.videoFileId && video.videoFileName
            ? deleteB2File(video.videoFileId, video.videoFileName)
            : Promise.resolve(),
        video.notesFileId
            ? deleteFromCloudinary(video.notesFileId)
            : Promise.resolve()
    ]);

    await permanentDeleteVideoRepository(videoId);

    return { id: videoId };

};

export const requestVideoUploadUrlService = async (
    payload: { fileName: string; courseId?: string }
) => {

    const key = `videos/${payload.courseId ?? "misc"}/${Date.now()}-${sanitizeFileName(payload.fileName)}`;

    const { uploadUrl, authorizationToken } = await getB2UploadUrl();

    return {
        uploadUrl,
        fileName: key,
        headers: {
            Authorization: authorizationToken,
            "X-Bz-File-Name": encodeB2FileName(key),
            "Content-Type": "video/mp4",
            "X-Bz-Content-Sha1": "do_not_verify"
        }
    };

};
