import { Request, Response, NextFunction } from "express";
import { createProductSchema, updateProductSchema } from "./admin.dto.js";
import { adminService } from "./admin.service.js";
import { AppError } from "../../middlewares/error.middleware.js";

export const adminController = {
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = createProductSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new AppError("Validation failed", 400)
            }

            const { data } = parsed;

            if (!req.files || req.files.length === 0) {
                throw new AppError("At least one image is required", 400)
            }

            const files = req.files as Express.Multer.File[];


            if (files.length > 5) {
                throw new AppError("No more than 5 images are allowed", 400);
            }

            const imageUrls = await adminService.uploadImages(files)

            const product = await adminService.createProduct(data, imageUrls)

            res.status(201).json({
                success: true,
                message: "Product created successfully",
                product
            })

        } catch (error) {
            next(error)
        }
    },

    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await adminService.getAllProducts()

            res.status(200).json({
                success: true,
                message: "Products fetched successfully",
                products
            })

        } catch (error) {
            next(error)
        }
    },

    updateProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.params;

            if (!productId) {
                throw new AppError("Product ID is Required");
            }

            const product = await adminService.getSingleProduct(productId)

            if (!product) {
                throw new AppError("Product not found", 404)
            }

            const parsed = updateProductSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new AppError("Validation failed", 400)
            }

            const { data } = parsed;

            const imageUrls = await adminService.uploadImages(req.files as Express.Multer.File[]);

            const updatedProduct = await adminService.updateProduct(productId, data, imageUrls);

            res.status(200).json({
                success: true,
                message: "Product updated successfully",
                updatedProduct
            })

        } catch (error) {
            next(error)
        }
    },

    deleteProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.params;

            if (!productId) {
                throw new AppError("Product ID is Required");
            }

            const deletedProduct = await adminService.deleteProduct(productId);

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                deletedProduct
            })

        } catch (error) {
            next(error)
        }
    },

    getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orders = await adminService.getAllOrders()

            return res.status(200).json({
                success: true,
                message: "Product deleted successfully",
                orders
            })

        } catch (error) {
            next(error)
        }
    },

    updateOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body;

            if (!orderId) {
                throw new AppError("Order ID is Required");
            }

            const order = await adminService.getSingleOrder(orderId);

            if (!order) {
                throw new AppError("Order not found", 400);
            }

            if (!status || !["pending", "shipped", "delivered"].includes(status)) {
                throw new AppError("Invalid status", 400)
            }

            const updatedOrder = await adminService.updateOrderStatus(orderId, status);

            res.status(200).json({
                success: true,
                message: "Order status updated successfully",
                updatedOrder
            })

        } catch (error) {
            next(error)
        }
    },

    getAllCustomers: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customers = await adminService.getAllCustomers()

            return res.status(200).json({
                success: true,
                message: "Customer fetched successfully",
                customers
            })

        } catch (error) {
            next(error)
        }
    },

    getDashboardStats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await adminService.getDashboardStats();

            return res.status(200).json({
                success: true,
                message: "Dashboard stats fetched successfully",
                stats
            })

        } catch (error) {
            next(error)
        }
    },
}