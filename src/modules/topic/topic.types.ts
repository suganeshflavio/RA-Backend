export interface CreateTopicDto {

    name: string;

    chapterId: string;

    order?: number;

    isActive?: boolean;

}

export interface UpdateTopicDto extends Partial<Omit<CreateTopicDto, "chapterId">> {}

export interface GetTopicQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    chapterId?: string;

    isActive?: boolean;

}
