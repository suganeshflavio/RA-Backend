export type CreateEnquiryDto = {
    name: string;
    email: string;
    category: string;
    message: string;
};

export type GetEnquiriesQueryDto = {
    page?: number;
    limit?: number;
};
