import { z } from "zod";

export const TenantSchema = z.object({
    id: z.number(),
    nombreCompleto: z.string(),
    numeroDni: z.string().min(8).max(8),
    email: z.string().email(),
    telefonoWhatsapp: z.string().min(9).max(9),
    cantidadContratos: z.number().default(0),
});

export const CreateTenantSchema = z.object({
    numeroDni: z.string().min(8).max(8),
    email: z.string().email(),
    telefonoWhatsapp: z.string().min(9).max(9),
    nombreCompleto: z.string().optional(),
});

export const UpdateTenantSchema = z.object({
    nombreCompleto: z.string(),
    numeroDni: z.string().min(8).max(8),
    email: z.string().email(),
    telefonoWhatsapp: z.string().min(9).max(9),
});

export type TenantDTO = z.infer<typeof TenantSchema>;
export type CreateTenantDTO = z.infer<typeof CreateTenantSchema>;
export type UpdateTenantDTO = z.infer<typeof UpdateTenantSchema>;
