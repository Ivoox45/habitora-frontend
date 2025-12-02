// src/feature/properties/utils/properties.formatters.ts

/**
 * Normaliza el nombre de la propiedad:
 * - Trim
 * - Primera letra mayúscula
 */
export function formatPropertyName(nombre: string): string {
    if (!nombre) return "Propiedad sin nombre";

    const n = nombre.trim();
    return n.charAt(0).toUpperCase() + n.slice(1);
}

/**
 * Formatea la dirección:
 * - Trim
 * - Si está vacía, valor por defecto
 */
export function formatAddress(direccion: string): string {
    const d = direccion?.trim();
    return d.length > 0 ? d : "Dirección no registrada";
}

/**
 * Devuelve un texto legible para los pisos:
 * Ej: 5 → "5 pisos"
 */
export function formatFloorCount(cantidadPisos: number): string {
    if (!cantidadPisos || cantidadPisos < 0) return "0 pisos";
    if (cantidadPisos === 1) return "1 piso";
    return `${cantidadPisos} pisos`;
}

/**
 * Piso de residencia del dueño:
 * - Si no se registró, devolver texto amigable
 */
export function formatOwnerFloor(pisoResidenciaDueno: number): string {
    if (!pisoResidenciaDueno || pisoResidenciaDueno < 0) {
        return "No registrado";
    }
    return `Piso ${pisoResidenciaDueno}`;
}
