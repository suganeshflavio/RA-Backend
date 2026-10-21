export interface CreateVideoDto {

    courseId: string;

    subject?: string;

    chapter?: string;

    videoName: string;

    videoFileId: string;

    videoFileName: string;

    videoSize?: number;

    notesFileId?: string;

    notesFileName?: string;

    description?: string;

    duration?: string;

    order?: number;

    isPreview?: boolean;

    isActive?: boolean;

}

export interface GetVideoQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    courseId?: string;

    subject?: string;

    chapter?: string;

    isActive?: boolean;

}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {}
