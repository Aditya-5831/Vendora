import { db } from "../../config/db.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { AddAddressDto, UpdateAddressDto } from "./user.dto.js";

export const userService = {
    addAddress: async (userId: string, data: AddAddressDto) => {
        if (data.isDefault) {
            await db.address.updateMany({
                where: {
                    userId,
                    isDefault: true
                },
                data: {
                    isDefault: false
                }
            })
        }

        const address = await db.address.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                ...data
            }
        })

        return address;
    },

    getSingleAddress: async (addressId: string) => {
        const address = await db.address.findUnique({
            where: {
                id: addressId
            }
        })

        return address;
    },

    getAddresses: async (userId: string) => {
        const addresses = await db.address.findMany({
            where: {
                userId
            }
        })

        return addresses;
    },

    updateAddress: async (addressId: string, data: UpdateAddressDto) => {
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );


        const updatedAddress = await db.address.update({
            where: {
                id: addressId
            },

            data: cleanData
        })

        return updatedAddress;
    },

    deleteAddress: async (addressId: string) => {
        const deletedAddress = await db.address.delete({
            where: {
                id: addressId
            }
        })

        if (!deletedAddress) {
            throw new AppError("Failed to delete address", 400);
        }

        return deletedAddress;

    },

    getWishlist: async (userId: string) => {
        const wishlist = await db.wishlist.findUnique({
            where: {
                userId
            },

            include: {
                wishlistItems: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!wishlist) {
            throw new AppError("Wishlist not found", 404);
        }

        return wishlist
    },

    addToWishlist: async (userId: string, productId: string) => {
        let wishlist = await db.wishlist.findUnique({
            where: {
                userId
            }
        })

        if (!wishlist) {
            throw new AppError("Wishlist not found", 404);
        }

        if (!wishlist) {
            wishlist = await db.wishlist.create({
                data: {
                    userId,
                }
            })
        }

        const existingItem = await db.wishlistItem.findFirst({
            where: {
                wishlistId: wishlist.id,
                productId
            }
        })

        if (existingItem) {
            throw new AppError("Product already in wishlist", 400)
        }

        const newItem = await db.wishlistItem.create({
            data: {
                wishlistId: wishlist.id,
                productId
            }
        })

        return newItem;

    },

    removeFromWishlist: async (userId: string, productId: string) => {
        const wishlist = await userService.getWishlist(userId);

        const existingItem = await db.wishlistItem.findFirst({
            where: {
                wishlistId: wishlist.id,
                productId
            }
        })

        if (!existingItem) {
            throw new AppError("Product not in wishlist", 404)
        }

        const removedItem = await db.wishlistItem.delete({
            where: {
                id: existingItem.id
            }
        })

        return removedItem;
    }
}