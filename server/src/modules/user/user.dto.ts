import { z } from "zod";

export const addAddressSchema = z.object({
    label: z.string().min(1, { message: "Required" }),
    fullName: z.string().min(1, { message: "Required" }),
    street: z.string().min(1, { message: "Required" }),
    city: z.string().min(1, { message: "Required" }),
    state: z.string().min(1, { message: "Required" }),
    zipCode: z.string().min(1, { message: "Required" }),
    phoneNumber: z.string().min(1, { message: "Required" }),
    isDefault: z.boolean(),
})


export const updateAddressSchema = z.object({
    label: z.string().min(1, { message: "Required" }).optional(),
    fullName: z.string().min(1, { message: "Required" }).optional(),
    street: z.string().min(1, { message: "Required" }).optional(),
    city: z.string().min(1, { message: "Required" }).optional(),
    state: z.string().min(1, { message: "Required" }).optional(),
    zipCode: z.string().min(1, { message: "Required" }).optional(),
    phoneNumber: z.string().min(1, { message: "Required" }).optional(),
    isDefault: z.boolean().optional(),
})

export type AddAddressDto = z.infer<typeof addAddressSchema>;
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>;