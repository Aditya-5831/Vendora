import { z } from 'zod';

export const createProductSchema = z.object({
    name: z.string().min(1, { message: "Required" }),
    description: z.string().min(1, { message: "Required" }),
    price: z.coerce.number().min(1, { message: "Required" }),
    stock: z.coerce.number().min(1, { message: "Required" }),
    category: z.string().min(1, { message: "Required" }),
})

export const updateProductSchema = z.object({
    name: z.string().min(1, { message: "Required" }).optional(),
    description: z.string().min(1, { message: "Required" }).optional(),
    price: z.coerce.number().min(1, { message: "Required" }).optional(),
    stock: z.coerce.number().min(1, { message: "Required" }).optional(),
    category: z.string().min(1, { message: "Required" }).optional(),
})

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;