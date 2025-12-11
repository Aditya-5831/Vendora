import { NextFunction, Request, Response } from "express";
import { addAddressSchema, updateAddressSchema } from "./user.dto.js";
import { AppError } from "../../middlewares/error.middleware.js";
import { userService } from "./user.service.js";

export const userController = {
    addAddress: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;
            const parserd = addAddressSchema.safeParse(req.body);

            if (!parserd.success) {
                throw new AppError("Validation failed", 400)
            }

            const { data } = parserd;

            const address = await userService.addAddress(userId, data)

            res.status(201).json({
                success: true,
                message: "Address added successfully",
                address
            })

        } catch (error) {
            next(error)
        }
    },

    getAddress: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user.id;

            const addresses = await userService.getAddresses(userId);

            res.status(200).json({
                success: true,
                message: "Addresses fetched successfully",
                addresses
            })


        } catch (error) {
            next(error)
        }
    },

    updateAddress: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { addressId } = req.params;

            if (!addressId) {
                throw new AppError("Address ID is required", 400);
            }

            const existingAddress = await userService.getSingleAddress(addressId);

            if (!existingAddress) {
                throw new AppError("Address not found", 404);
            }

            const parsed = updateAddressSchema.safeParse(req.body);

            if (!parsed.success) {
                throw new AppError("Validation failed", 400);
            }

            const { data } = parsed;

            const updatedAddress = await userService.updateAddress(addressId, data)

            res.status(200).json({
                success: true,
                message: "Address update successfully",
                updatedAddress
            })

        } catch (error) {
            next(error)
        }
    },

    deleteAddress: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { addressId } = req.params;

            if (!addressId) {
                throw new AppError("Address ID is required", 400);
            }

            const deletedAddress = await userService.deleteAddress(addressId);

            res.status(200).json({
                success: true,
                message: "Address deleted successfully",
                deletedAddress
            })

        } catch (error) {
            next(error)
        }
    },

    addToWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.body;
            const { id } = req.user;

            if (!productId) {
                throw new AppError("Product ID is required", 400);
            }

            const wishlistItem = await userService.addToWishlist(id, productId);

            res.status(200).json({
                success: true,
                message: "Added to the wishlist successfully",
                wishlistItem
            })

        } catch (error) {
            next(error)
        }
    },

    removeFromWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { productId } = req.params;
            const { id } = req.user;

            if (!productId) {
                throw new AppError("Product ID is required", 400);
            }

            const removedItem = await userService.removeFromWishlist(id, productId);

            res.status(200).json({
                success: true,
                message: "Removed from wishlist successfully",
                removedItem
            })

        } catch (error) {
            next(error)
        }
    },

    getWishlist: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.user;

            const wishlist = await userService.getWishlist(id);

            res.status(200).json({
                success: true,
                message: "wishlist fetched successfully",
                wishlist
            })

        } catch (error) {
            next(error)
        }
    },
}