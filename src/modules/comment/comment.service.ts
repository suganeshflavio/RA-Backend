import { AppError } from "../../utils/errors/AppError";
import { CreateCommentDto, GetAdminCommentsQueryDto, ReplyCommentDto } from "./comment.types";
import {
    createCommentRepository,
    deleteCommentRepository,
    getAdminCommentsRepository,
    getCommentByIdRepository,
    getVideoCommentsRepository,
    videoExistsRepository
} from "./comment.repository";

export const createCommentService = async (
    payload: CreateCommentDto
) => {

    const video = await videoExistsRepository(payload.videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    return createCommentRepository(payload);

};

export const replyCommentService = async (
    commentId: string,
    payload: ReplyCommentDto
) => {

    const parentComment = await getCommentByIdRepository(commentId);

    if (!parentComment) {
        throw new AppError("Comment not found", 404);
    }

    return createCommentRepository({
        videoId: parentComment.videoId,
        userId: payload.userId,
        message: payload.message,
        parentId: parentComment.id
    });

};

export const getVideoCommentsService = async (
    videoId: string
) => {

    const video = await videoExistsRepository(videoId);

    if (!video) {
        throw new AppError("Video not found", 404);
    }

    return getVideoCommentsRepository(videoId);

};

export const getAdminCommentsService = async (
    query: GetAdminCommentsQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getAdminCommentsRepository(query);

    const videos = result.videos.map((video) => ({

        videoId: video.id,

        courseName: video.course.courseName,

        subjectName: video.subject,

        chapterName: video.chapter,

        videoName: video.videoName,

        comments: video.comments.map((comment) => ({

            id: comment.id,

            username: comment.user.name,

            role: comment.user.role,

            message: comment.message,

            dateandtime: comment.createdAt,

            parentId: comment.parentId

        }))

    }));

    return {

        videos,

        page,

        limit,

        total: result.total,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const deleteCommentService = async (
    commentId: string
) => {

    const comment = await getCommentByIdRepository(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    await deleteCommentRepository(commentId);

    return { id: commentId };

};
