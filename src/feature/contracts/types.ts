// src/feature/contracts/types.ts

// --- Estados de contrato ---
export type ContratoEstado = "ACTIVO" | "CANCELADO";

// --- Listado básico (para tabla) ---
export type ContratoListado = {
  id: number;
  estado: ContratoEstado | string;
  fechaInicio: string;   // ISO: "2025-11-21"
  fechaFin: string;      // ISO
  montoDeposito: number;
  inquilinoId: number;
  inquilinoNombre: string;
  inquilinoDni: string;
  habitacionId: number;
  habitacionCodigo: string;
};

// --- Detalle de contrato (para ver / firmar) ---
export type ContratoDetalle = {
  id: number;
  propiedadId: number;
  estado: ContratoEstado | string;
  fechaInicio: string;
  fechaFin: string;
  montoDeposito: number;
  inquilinoId: number;
  inquilinoNombre: string;
  inquilinoDni: string;
  inquilinoEmail: string;
  inquilinoTelefono: string;
  habitacionId: number;
  habitacionCodigo: string;
  habitacionEstado: string;
  habitacionPrecioRenta: string;
  tieneFirma: boolean;
};

export type ContratosFilters = {
  estado?: ContratoEstado;
  search?: string;
};

export type CrearContratoPayload = {
  inquilinoId: number;
  habitacionId: number;
  fechaInicio: string;   // "2025-11-21"
  fechaFin: string;      // "2025-11-22"
  montoDeposito: number;
};

export type SubirFirmaContratoPayload = {
  file: string; // base64 limpio
};

// ---------- NUEVO: tipos para selects ----------

// Habitaciones disponibles (respuesta de /habitaciones)
export type AvailableRoom = {
  id: number;
  propiedadId: number;
  pisoId: number;
  codigo: string;
  estado: string;       // "DISPONIBLE" / "OCUPADA"
  precioRenta: string;  // "0.00", "1200.00"
};

export type AvailableRoomsByFloor = {
  pisoId: number;
  numeroPiso: number;
  habitaciones: AvailableRoom[];
};

// Inquilinos disponibles (respuesta de /inquilinos)
export type Tenant = {
  id: number;
  nombreCompleto: string;
  numeroDni: string;
  email: string;
  telefonoWhatsapp: string;
  cantidadContratos: number;
};

export type TenantsFilters = {
  disponibles?: boolean;
  query?: string;
};
