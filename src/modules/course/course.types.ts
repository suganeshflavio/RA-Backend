import { Prisma } from "@prisma/client";

export interface InstallmentDto {
    installment: number;
    price: number;
}

export interface CreateCourseDto {
    courseName: string;

    thumbnail?: string;

    accessType?: "free" | "paid";

    price?: number;

    strikePrice?: number;

    validityMonths?: number;

    enableEmi?: boolean;

    installments?: Prisma.InputJsonValue;
}

export interface GetCourseQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {

    isActive?: boolean;

}

export interface LinkSubjectDto {
    subjectId: string;
    order?: number;
}

export interface LinkVideoDto {
    videoId: string;
    order?: number;
}

export interface LinkNotesDto {
    notesId: string;
    order?: number;
}

export interface LinkMcqTestDto {
    testId: string;
    order?: number;
}
