import { Router } from "express";
import { cartController } from "./cart.controller.js";

const router = Router();

// Get cart
router.get("/", cartController.getCart);

// Add to cart
router.post("/", cartController.addToCart);

// Remove from cart
router.put("/:productId", cartController.removeFromCart);

// Clear cart
router.delete("/", cartController.clearCart);

export default router;