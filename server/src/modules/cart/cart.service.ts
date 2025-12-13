import { db } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js"
import { AddToCartDto } from "./cart.dto.js";

export const cartService = {
    getCart: async (userId: string) => {
        const cart = await db.cart.findUnique({
            where: {
                userId
            }
        })

        if (!cart) {
            throw new AppError("Cart not found", 404);
        }

        return cart;
    },

    addToCart: async (data: AddToCartDto, userId: string) => {

        const product = await db.product.findUnique({
            where: {
                id: data.productId
            }
        })

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        if (product.stock < data.quantity) {
            throw new AppError("Insufficient stock", 400);
        }

        let cart = await db.cart.findUnique({
            where: {
                userId,
            }
        })

        if (!cart) {
            cart = await db.cart.create({
                data: {
                    userId
                }
            })
        }

        const existingItem = await db.cartItems.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: data.productId
                }
            }
        })

        if (existingItem) {
            return await db.cartItems.update({
                where: {
                    id: existingItem.id
                },
                data: {
                    quantity: existingItem.quantity + data.quantity
                }
            })
        }

        const newItem = await db.cartItems.create({
            data: {
                cartId: cart.id,
                productId: data.productId,
                quantity: data.quantity
            }
        })

        return newItem;

    },

    removeFromCart: async (userId: string, productId: string) => {
        const cart = await db.cart.findUnique({
            where: {
                userId,
            }
        })

        if (!cart) {
            throw new AppError("Cart not found", 404);
        }

        const cartItem = await db.cartItems.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                }
            }
        })

        if (!cartItem) {
            throw new AppError("Product not in cart", 404);
        }

        if (cartItem.quantity === 1) {
            await db.cartItems.update({
                where: {
                    id: cartItem.id
                },
                data: {
                    quantity: cartItem.quantity - 1
                }
            })
        }

        const removedItem = await db.cartItems.update({
            where: {
                id: cartItem.id
            },

            data: {
                quantity: cartItem.quantity - 1
            }
        })

        return removedItem;
    },

    clearCart: async (userId: string) => {
        const cart = await db.cart.findUnique({
            where: {
                userId
            }
        })

        if (!cart) {
            throw new AppError("Cart not found", 404);
        }

        const clearedCart = await db.cartItems.deleteMany({
            where: {
                cartId: cart.id
            }
        })

        return clearedCart;
    }
}