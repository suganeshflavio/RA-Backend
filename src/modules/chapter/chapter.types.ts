export interface CreateChapterDto {

    name: string;

    classId: string;

    isActive?: boolean;

}

export interface UpdateChapterDto extends Partial<Omit<CreateChapterDto, "classId">> {}

export interface GetChapterQueryDto {

    page?: number;

    limit?: number;

    search?: string;

    classId?: string;

    isActive?: boolean;

}
