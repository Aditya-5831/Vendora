import { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service.js";
import { addToCartSchema } from "./cart.dto.js";
import { AppError } from "../../middlewares/error.middleware.js";

export const cartController = {
    getCart: (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;

            const cart = cartService.getCart(userId);

            res.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                cart
            })

        } catch (error) {
            next(error)
        }
    },

    addToCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = addToCartSchema.safeParse(req.body);
            const userId = req.user.id;

            if (!parsed.success) {
                throw new AppError("Validation failed", 400);
            }

            const { data } = parsed;

            const newItem = await cartService.addToCart(data, userId)

            res.status(201).json({
                success: true,
                message: "Product added to the cart successfully",
                newItem
            })
        } catch (error) {
            next(error)
        }
    },

    removeFromCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const { productId } = req.params;

            if (!productId) {
                throw new AppError("Product ID is required", 400);
            }

            const newItem = await cartService.removeFromCart(userId, productId)

            res.status(201).json({
                success: true,
                message: "Product removed from the cart successfully",
                newItem
            })
        } catch (error) {
            next(error)
        }
    },

    clearCart: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;

            const newItem = await cartService.clearCart(userId)

            res.status(200).json({
                success: true,
                message: "Cart cleared successfully",
                newItem
            })

        } catch (error) {
            next(error)
        }
    },

}