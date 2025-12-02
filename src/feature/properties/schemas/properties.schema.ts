// src/feature/properties/schemas/properties.schema.ts
import { z } from "zod";

export const PropertySchema = z.object({
    id: z.number(),
    nombre: z.string().min(1).default("Sin nombre"),
    direccion: z.string().min(1).default("Sin dirección"),
    cantidadPisos: z.number().int().nonnegative(),
    pisoResidenciaDueno: z.number().int().nonnegative(),
});

export const PropertiesArraySchema = z.array(PropertySchema);

// DTO inferido desde Zod
export type PropertyDTO = z.infer<typeof PropertySchema>;
