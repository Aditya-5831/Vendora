import { z } from 'zod';

export const addReviewSchema = z.object({
    rating: z.number().min(1, { message: "Required" }),
    reviewText: z.string().min(1, { message: "Required" })
})

export type AddReviewDto = z.infer<typeof addReviewSchema>;