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
  nombreCompleto?: string; // opcional: el backend lo completa desde DNI si no se envía
};

export type UpdateTenantPayload = {
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
};
