export type Tenant = {
    id: number;
    nombreCompleto: string;
    numeroDni: string;
    email: string;
    telefonoWhatsapp: string;
    cantidadContratos: number;
};

export type CreateTenantPayload = {
    numeroDni: string;
    email: string;
    telefonoWhatsapp: string;
    nombreCompleto?: string;
};

export type UpdateTenantPayload = {
    nombreCompleto: string;
    numeroDni: string;
    email: string;
    telefonoWhatsapp: string;
};
