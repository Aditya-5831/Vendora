import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.string().min(1, { message: "Required" }),
    quantity: z.number().int().min(1).default(1)
})

export type AddToCartDto = z.infer<typeof addToCartSchema>;