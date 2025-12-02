// src/feature/properties/utils/rooms.formatters.ts

/**
 * Formatea número como moneda peruana
 */
export function formatRentPrice(value: number): string {
    return new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
    }).format(value);
}

/**
 * Devuelve el label textual para el piso
 */
export function formatFloorLabel(floorNumber: number): string {
    const labels = [
        "",
        "Primer piso",
        "Segundo piso",
        "Tercer piso",
        "Cuarto piso",
        "Quinto piso",
        "Sexto piso",
        "Séptimo piso",
        "Octavo piso",
    ];

    return labels[floorNumber] ?? `Piso ${floorNumber}`;
}

/**
 * Normaliza búsqueda (para filtros locales si quieres)
 */
export function normalizeSearch(text: string): string {
    return text.trim().toLowerCase();
}
