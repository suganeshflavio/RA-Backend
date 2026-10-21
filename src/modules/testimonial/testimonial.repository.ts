import prisma from "../../config/prisma";
import { CreateTestimonialDto, GetTestimonialsQueryDto, UpdateTestimonialDto } from "./testimonial.types";

const testimonialUserSelect = {
    select: {
        id: true,
        name: true
    }
} as const;

export const createTestimonialRepository = async (
    payload: CreateTestimonialDto
) => {

    return prisma.testimonial.create({
        data: payload,
        include: {
            user: testimonialUserSelect
        }
    });

};

export const getTestimonialByIdRepository = async (
    testimonialId: string
) => {

    return prisma.testimonial.findUnique({
        where: {
            id: testimonialId
        }
    });

};

export const getTestimonialsRepository = async (

    query: GetTestimonialsQueryDto,

    isActive?: boolean

) => {

    const page = query.page || 1;

    const limit = query.limit || 10;

    const skip = (page - 1) * limit;

    const where = typeof isActive === "boolean" ? { isActive } : {};

    const [testimonials, total] = await Promise.all([

        prisma.testimonial.findMany({

            where,

            include: {
                user: testimonialUserSelect
            },

            skip,

            take: limit,

            orderBy: {
                createdAt: "desc"
            }

        }),

        prisma.testimonial.count({
            where
        })

    ]);

    return {
        testimonials,
        total
    };

};

export const updateTestimonialRepository = async (

    testimonialId: string,

    payload: UpdateTestimonialDto

) => {

    return prisma.testimonial.update({
        where: {
            id: testimonialId
        },
        data: payload,
        include: {
            user: testimonialUserSelect
        }
    });

};

export const deleteTestimonialRepository = async (
    testimonialId: string
) => {

    return prisma.testimonial.delete({
        where: {
            id: testimonialId
        }
    });

};
