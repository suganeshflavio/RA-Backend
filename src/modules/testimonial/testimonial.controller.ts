import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { successResponse } from "../../utils/response";
import { createTestimonialSchema, updateTestimonialSchema } from "./testimonial.validation";
import {
    createTestimonialService,
    deleteTestimonialService,
    getPublicTestimonialsService,
    getTestimonialsService,
    updateTestimonialService
} from "./testimonial.service";

export const createTestimonial = asyncHandler(async (req: Request, res: Response) => {

    const payload = createTestimonialSchema.parse(req.body);

    const testimonial = await createTestimonialService({
        ...payload,
        userId: req.user!.userId
    });

    return successResponse(res, "Testimonial Submitted Successfully", testimonial, 201);

});

export const getTestimonials = asyncHandler(async (req: Request, res: Response) => {

    const data = await getTestimonialsService({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
    });

    return successResponse(res, "Testimonials fetched successfully", data);

});

export const getPublicTestimonials = asyncHandler(async (req: Request, res: Response) => {

    const data = await getPublicTestimonialsService({
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
    });

    return successResponse(res, "Testimonials fetched successfully", data);

});

export const updateTestimonial = asyncHandler(async (req: Request, res: Response) => {

    const payload = updateTestimonialSchema.parse(req.body);

    const testimonial = await updateTestimonialService(req.params.id as string, payload);

    return successResponse(res, "Testimonial Updated Successfully", testimonial);

});

export const deleteTestimonial = asyncHandler(async (req: Request, res: Response) => {

    const result = await deleteTestimonialService(req.params.id as string);

    return successResponse(res, "Testimonial Deleted Successfully", result);

});
