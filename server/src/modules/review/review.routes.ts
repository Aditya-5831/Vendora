import { Router } from "express";
import { reviewController } from "./review.controller.js";

const router = Router();

// Add review
router.post("/", reviewController.addReview);

// Get review
router.delete("/:reviewId", reviewController.deleteReview)

export default router;