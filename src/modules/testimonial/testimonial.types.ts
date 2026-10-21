export interface CreateTestimonialDto {
    userId: string;
    star: number;
    review: string;
}

export interface UpdateTestimonialDto {
    star?: number;
    review?: string;
    isActive?: boolean;
}

export interface GetTestimonialsQueryDto {
    page?: number;
    limit?: number;
}
