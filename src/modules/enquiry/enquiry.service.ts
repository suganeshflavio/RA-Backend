import {
    createEnquiryRepository,
    getEnquiriesRepository
} from "./enquiry.repository";
import { CreateEnquiryDto, GetEnquiriesQueryDto } from "./enquiry.types";

export const createEnquiryService = async (payload: CreateEnquiryDto) => {
    return createEnquiryRepository(payload);
};

export const getEnquiriesService = async (query: GetEnquiriesQueryDto) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const result = await getEnquiriesRepository(query);

    return {
        enquiries: result.enquiries,
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
    };
};
