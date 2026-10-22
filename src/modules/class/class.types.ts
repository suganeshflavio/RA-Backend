export interface CreateClassDto {

    name: string;

    subjectId: string;

    isActive?: boolean;

}

export interface UpdateClassDto extends Partial<Omit<CreateClassDto, "subjectId">> {}

export interface GetClassQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    subjectId?: string;

    isActive?: boolean;

}
