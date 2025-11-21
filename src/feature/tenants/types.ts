export type Tenant = {
  id: number;
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
  cantidadContratos: number;
};

export type CreateTenantPayload = {
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
};

export type UpdateTenantPayload = {
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
};
