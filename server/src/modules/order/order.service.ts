import { db } from "../../config/db.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { createOrderDto } from "./order.dto.js";

export const orderService = {
    createOrder: async (data: createOrderDto, userId: string, shippingAddressId: string) => {
        return db.$transaction(async prisma => {
            const address = await prisma.address.findFirst({
                where: {
                    id: shippingAddressId
                }
            })

            if (!address) {
                throw new AppError("Invalid shipping address", 400);
            }

            let calculatedTotal = 0;

            for (const item of data.orderItems) {
                const product = await prisma.product.findUnique({
                    where: {
                        id: item.productId
                    }
                })

                if (!product) {
                    throw new AppError("Product not found", 404);
                }

                if (product.stock < item.quantity) {
                    throw new AppError(`Insufficient stock for ${product.name}`, 400);
                }

                calculatedTotal = calculatedTotal + item.price * item.quantity
            }

            const order = await db.order.create({
                data: {
                    userId,
                    shippingAddressId,
                    totalPrice: data.totalPrice,
                    orderItems: {
                        create: data.orderItems.map(item => ({
                            productId: item.productId,
                            price: item.price,
                            quantity: item.quantity
                        }))
                    }
                },

                include: {
                    orderItems: true
                }
            });

            for (const item of data.orderItems) {
                await prisma.product.update({
                    where: {
                        id: item.productId
                    },

                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                })
            }

            return order;
        })

    },

    getUserOrders: async (userId: string) => {
        const orders = await db.order.findMany({
            where: {
                userId
            },

            orderBy: {
                createdAt: "desc"
            },

            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        return orders;
    }
}