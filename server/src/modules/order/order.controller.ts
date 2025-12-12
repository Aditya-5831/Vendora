import { NextFunction, Request, Response } from "express";
import { createOrderSchema } from "./order.dto.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { orderService } from "./order.service.js";

export const orderController = {
    createOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id
            const { shippingAddressId } = req.body;
            const parsed = createOrderSchema.safeParse(req.body);

            if (!shippingAddressId) {
                throw new AppError("Shipping address ID is required", 400);
            }

            if (!parsed.success) {
                throw new AppError("Validation failed", 400);
            }

            const { data } = parsed;

            const order = await orderService.createOrder(data, shippingAddressId, userId);

            res.status(201).json({
                success: true,
                message: "Order placed successfully",
                order
            })


        } catch (error) {
            next(error);
        }
    },

    getUserOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;

            const orders = await orderService.getUserOrders(userId);

            res.status(201).json({
                success: true,
                message: "Order placed successfully",
                orders
            })


        } catch (error) {
            next(error);
        }
    },
}