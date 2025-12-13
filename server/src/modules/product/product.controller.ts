import { NextFunction, Request, Response } from "express";
import { productService } from "./product.service.js";
import { AppError } from "../../middlewares/error.middleware.js";

export const productController = {
    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await productService.getAllProducts();

            res.status(200).json({
                success: true,
                message: "All products fetched successfully",
                products
            })

        } catch (error) {
            next(error)
        }
    },

    getSingleProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.params;

            if (!productId) {
                throw new AppError("Product ID is required", 400);
            }

            const product = await productService.getSingleProduct(productId);

            res.status(200).json({
                success: true,
                message: "product fetched successfully",
                product
            })

        } catch (error) {
            next(error)
        }
    }
}