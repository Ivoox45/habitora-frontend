// src/feature/properties/types/properties.types.ts

/**
 * Propiedad (Property) base type
 */
export type Propiedad = {
    id: number;
    nombre: string;
    direccion: string;
    cantidadPisos: number;
    pisoResidenciaDueno: number;
};
