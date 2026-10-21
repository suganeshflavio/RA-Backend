import { Prisma } from "@prisma/client";

export interface InstallmentDto {
    installment: number;
    price: number;
}

export interface CreateCourseDto {
    courseName: string;
    // description?: string;
    thumbnail?: string;

    accessType?: "free" | "paid";

    price?: number;

    strikePrice?: number;

    validityMonths?: number;

    enableEmi?: boolean;

    installments?: Prisma.InputJsonValue;

    subjects: string[];
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