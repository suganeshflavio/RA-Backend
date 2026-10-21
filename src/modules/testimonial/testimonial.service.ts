import { AppError } from "../../utils/errors/AppError";
import { CreateTestimonialDto, GetTestimonialsQueryDto, UpdateTestimonialDto } from "./testimonial.types";
import {
    createTestimonialRepository,
    deleteTestimonialRepository,
    getTestimonialByIdRepository,
    getTestimonialsRepository,
    updateTestimonialRepository
} from "./testimonial.repository";

const formatTestimonial = (testimonial: {
    id: string;
    star: number;
    review: string;
    isActive: boolean;
    createdAt: Date;
    user: { id: string; name: string };
}) => ({

    id: testimonial.id,

    username: testimonial.user.name,

    star: testimonial.star,

    review: testimonial.review,

    isActive: testimonial.isActive,

    createdAt: testimonial.createdAt

});

export const createTestimonialService = async (
    payload: CreateTestimonialDto
) => {

    const testimonial = await createTestimonialRepository(payload);

    return formatTestimonial(testimonial);

};

export const getTestimonialsService = async (
    query: GetTestimonialsQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getTestimonialsRepository(query);

    return {

        testimonials: result.testimonials.map(formatTestimonial),

        page,

        limit,

        total: result.total,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const getPublicTestimonialsService = async (
    query: GetTestimonialsQueryDto
) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const result = await getTestimonialsRepository(query, true);

    return {

        testimonials: result.testimonials.map(formatTestimonial),

        page,

        limit,

        total: result.total,

        totalPages: Math.ceil(result.total / limit)

    };

};

export const updateTestimonialService = async (

    testimonialId: string,

    payload: UpdateTestimonialDto

) => {

    const existing = await getTestimonialByIdRepository(testimonialId);

    if (!existing) {
        throw new AppError("Testimonial not found", 404);
    }

    const updated = await updateTestimonialRepository(testimonialId, payload);

    return formatTestimonial(updated);

};

export const deleteTestimonialService = async (
    testimonialId: string
) => {

    const existing = await getTestimonialByIdRepository(testimonialId);

    if (!existing) {
        throw new AppError("Testimonial not found", 404);
    }

    await deleteTestimonialRepository(testimonialId);

    return { id: testimonialId };

};
