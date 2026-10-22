export interface CreateSubjectDto {

    name: string;

    isActive?: boolean;

}

export interface UpdateSubjectDto extends Partial<CreateSubjectDto> {}

export interface GetSubjectQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    isActive?: boolean;

}
