export function useTenantHelpers() {
    return {
        sanitizeName: (s: string) =>
            s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]/g, ""),
        sanitizeDni: (s: string) => s.replace(/\D/g, "").slice(0, 8),
        sanitizePhone: (s: string) => s.replace(/\D/g, "").slice(0, 9),
    };
}
