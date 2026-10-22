export interface CreateVideoDto {

    videoName: string;

    videoFileId: string;

    videoFileName: string;

    videoSize?: number;

    description?: string;

    duration?: string;

    isPreview?: boolean;

    isActive?: boolean;

}

export interface GetVideoQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    isActive?: boolean;

}

export interface UpdateVideoDto extends Partial<CreateVideoDto> {}
