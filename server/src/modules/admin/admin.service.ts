import cloudinary from "../../config/cloudinary.js"
import { db } from "../../config/db.js"
import type { OrderStatus } from "../../generated/prisma/enums.js"
import { AppError } from "../../middlewares/error.middleware.js"
import { CreateProductDto, UpdateProductDto } from "./admin.dto.js"

export const adminService = {
    uploadImages: async (files: Express.Multer.File[]) => {
        const uploadPromise = files.map((file: Express.Multer.File) => {
            return cloudinary.uploader.upload(file.path, {
                folder: "products",
            })
        })

        const uploadResult = await Promise.all(uploadPromise);
        const imageUrls = uploadResult.map(result => result.secure_url);

        return imageUrls
    },

    createProduct: async (data: CreateProductDto, imageUrls: string[]) => {
        const product = await db.product.create({
            data: { images: imageUrls, ...data }
        })

        return product;
    },

    getAllProducts: async () => {
        const products = await db.product.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return products;
    },

    getSingleProduct: async (productId: string) => {
        const product = await db.product.findUnique({
            where: {
                id: productId
            }
        })

        return product;
    },

    updateProduct: async (productId: string, data: UpdateProductDto, imageUrls: string[]) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        )

        const updatedProduct = await db.product.update({
            where: {
                id: productId
            },

            data: { images: imageUrls, ...cleanData }
        })

        if (!updatedProduct) {
            throw new AppError("Failed to update product", 403);
        }

        return updatedProduct;
    },

    deleteProduct: async (productId: string) => {
        const deletedProduct = await db.product.delete({
            where: {
                id: productId
            }
        })

        if (!deletedProduct) {
            throw new AppError("Failed to delete product", 403);
        }

        return deletedProduct;

    },

    getSingleOrder: async (orderId: string) => {
        const order = await db.order.findUnique({
            where: {
                id: orderId
            }
        })

        return order;
    },

    getAllOrders: async () => {
        const orders = await db.order.findMany({
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: true
            },

            orderBy: {
                createdAt: "desc"
            }
        })

        return orders;
    },

    updateOrderStatus: async (orderId: string, status: string) => {
        const existingOrder = await adminService.getSingleOrder(orderId);

        if (!existingOrder) {
            throw new AppError("Order not found", 404)
        }

        let shippedAt = existingOrder.shippedAt;
        let deliveredAt = existingOrder.deliveredAt;

        if (status === "shipped" && !shippedAt) {
            shippedAt = new Date();
        }

        if (status === "delivered" && !deliveredAt) {
            deliveredAt = new Date();
        }

        const order = await db.order.update({
            where: {
                id: orderId
            },

            data: {
                orderStatus: status.toUpperCase() as OrderStatus,
                shippedAt,
                deliveredAt
            }
        })

        return order;
    },

    getAllCustomers: async () => {
        const customers = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })

        return customers;
    },

    getDashboardStats: async () => {
        const totalCustomers = await db.user.count();

        const totalProducts = await db.product.count();

        const totalOrders = await db.order.count();

        const totalRevenue = await db.order.aggregate({
            _sum: {
                totalPrice: true
            }
        })

        return { totalCustomers, totalProducts, totalOrders, totalRevenue }
    }
}