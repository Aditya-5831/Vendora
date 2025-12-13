import { db } from "../../config/db.js"
import { AppError } from "../../middlewares/error.middleware.js";

export const productService = {
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

        if (!product) {
            throw new AppError("Product not found", 404);
        }

        return product;
    }
}