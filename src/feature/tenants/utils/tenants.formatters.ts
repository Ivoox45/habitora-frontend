export function formatPhone(pe: string): string {
    return `+51 ${pe}`;
}

export function formatName(name: string): string {
    return name
        .split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
        .join(" ");
}
