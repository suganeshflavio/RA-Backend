export interface CreateCommentDto {
    videoId: string;
    userId: string;
    message: string;
}

export interface ReplyCommentDto {
    userId: string;
    message: string;
}

export interface GetAdminCommentsQueryDto {
    page?: number;
    limit?: number;
    videoName?: string;
}
