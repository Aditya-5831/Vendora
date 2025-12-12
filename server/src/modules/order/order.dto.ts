import { z } from "zod";

export const createOrderItemSchema = z.object({
    productId: z.string().min(1, { message: "Required" }),
    price: z.coerce.number().positive().min(1, { message: "Required" }),
    quantity: z.number().int().positive().min(1, { message: "Required" })
});

export const createOrderSchema = z.object({
    totalPrice: z.coerce.number().positive().min(1, { message: "Required" }),
    orderItems: z.array(createOrderItemSchema).min(1, { message: "Required" })
})

export type createOrderDto = z.infer<typeof createOrderSchema>;