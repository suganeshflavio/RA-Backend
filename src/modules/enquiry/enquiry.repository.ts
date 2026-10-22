import prisma from "../../config/prisma";
import { CreateEnquiryDto, GetEnquiriesQueryDto } from "./enquiry.types";

export const createEnquiryRepository = async (payload: CreateEnquiryDto) => {
    return prisma.enquiry.create({
        data: payload
    });
};

export const getEnquiriesRepository = async (query: GetEnquiriesQueryDto) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [enquiries, total] = await Promise.all([
        prisma.enquiry.findMany({
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.enquiry.count()
    ]);

    return {
        enquiries,
        total
    };
};
