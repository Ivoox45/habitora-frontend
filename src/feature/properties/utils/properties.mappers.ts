import { PropertySchema, PropertiesArraySchema } from "../schemas/properties.schema";
import type { Propiedad } from "../types/properties.types";
import type { PropertyDTO } from "../schemas/properties.schema";

// Validación individual
export function mapBackendProperty(raw: unknown): Propiedad {
    const dto: PropertyDTO = PropertySchema.parse(raw);
    return {
        id: dto.id,
        nombre: dto.nombre.trim(),
        direccion: dto.direccion.trim(),
        cantidadPisos: dto.cantidadPisos,
        pisoResidenciaDueno: dto.pisoResidenciaDueno,
    };
}

// Validación de array
export function mapBackendProperties(raw: unknown): Propiedad[] {
    const dtoArray = PropertiesArraySchema.parse(raw);
    return dtoArray.map((dto) => ({
        id: dto.id,
        nombre: dto.nombre.trim(),
        direccion: dto.direccion.trim(),
        cantidadPisos: dto.cantidadPisos,
        pisoResidenciaDueno: dto.pisoResidenciaDueno,
    }));
}
