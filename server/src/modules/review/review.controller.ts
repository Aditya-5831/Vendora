import { NextFunction, Request, Response } from "express";
import { addReviewSchema } from "./review.dto.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { reviewService } from "./review.service.js";

export const reviewController = {
    addReview: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = addReviewSchema.safeParse(req.body);
            const userId = req.user.id;
            const { productId } = req.body;

            if (!productId) {
                throw new AppError("Product ID is required", 400);
            }

            if (!parsed.success) {
                throw new AppError("Validation failed");
            }

            const { data } = parsed;

            const review = await reviewService.addReview(data, userId, productId)

            res.status(201).json({
                success: true,
                message: "Review added successfully",
                review
            })


        } catch (error) {
            next(error)
        }
    },

    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { reviewId } = req.params;
            const userId = req.user.id;

            if (!reviewId) {
                throw new AppError("Review ID is required", 400);
            }

            const deletedReview = await reviewService.deleteReview(reviewId, userId);

            res.status(201).json({
                success: true,
                message: "Review deleted successfully",
                deletedReview
            })

        } catch (error) {
            next(error)
        }
    }
}