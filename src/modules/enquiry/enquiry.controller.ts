import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import {
    createEnquirySchema,
    getEnquiriesQuerySchema
} from "./enquiry.validation";
import {
    createEnquiryService,
    getEnquiriesService
} from "./enquiry.service";

export const createEnquiry = asyncHandler(async (req: Request, res: Response) => {
    const payload = createEnquirySchema.parse(req.body);
    const enquiry = await createEnquiryService(payload);

    return successResponse(res, "Enquiry submitted successfully", enquiry, 201);
});

export const getEnquiries = asyncHandler(async (req: Request, res: Response) => {
    const query = getEnquiriesQuerySchema.parse(req.query);
    const data = await getEnquiriesService(query);

    return successResponse(res, "Enquiries fetched successfully", data);
});
