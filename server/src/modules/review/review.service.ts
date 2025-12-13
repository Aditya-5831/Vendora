import { db } from "../../config/db.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { AddReviewDto } from "./review.dto.js";

export const reviewService = {
    addReview: async (data: AddReviewDto, userId: string, productId: string) => {
        const product = await db.product.findUnique({
            where: {
                id: productId
            }
        })

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        const existingReview = await db.review.findFirst({
            where: {
                userId,
                productId
            }
        })

        if (existingReview) {
            throw new AppError("You have already reviewed this product", 400)
        }

        return await db.$transaction(async prisma => {
            const review = await prisma.review.create({
                data: {
                    rating: data.rating,
                    productId: product.id,
                    reviewText: data.reviewText,
                    userId
                }
            })

            const newTotalReviews = product.totalReviews + 1;

            const newAverageRating = ((product.averageRating * product.totalReviews) + data.rating) / newTotalReviews;

            await prisma.product.update({
                where: {
                    id: productId
                },
                data: {
                    totalReviews: newTotalReviews,
                    averageRating: Math.round(newAverageRating)
                }
            })

            return review;
        })
    },

    deleteReview: async (reviewId: string, userId: string) => {
        const review = await db.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if (!review) {
            throw new AppError("Review not found", 404);
        }

        if (review.userId !== userId) {
            throw new AppError("Your not authorized to delete this review", 403)
        }

        return await db.$transaction(async prisma => {
            const product = await db.product.findUnique({
                where: {
                    id: review.productId
                }
            })

            if (!product) {
                throw new AppError("Product not found", 404);
            }

            const deletedReview = await prisma.review.delete({
                where: {
                    id: reviewId
                }
            })

            const newTotalReviews = Math.max(product.totalReviews - 1, 0);

            const newAverageRating = newTotalReviews === 0 ? 0 : ((product.averageRating * product.totalReviews) - review.rating) / newTotalReviews;

            await prisma.product.update({
                where: {
                    id: product.id
                },
                data: {
                    totalReviews: newTotalReviews,
                    averageRating: Math.round(newAverageRating)
                }
            })

            return deletedReview;
        })

    }
}