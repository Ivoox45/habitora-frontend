export type CanalRecordatorio = "WHATSAPP";

export type EstadoRecordatorio = "PROGRAMADO" | "ENVIADO" | "FALLIDO" | "CANCELADO";

export interface Recordatorio {
  id: number;
  facturaId: number;
  contratoId: number;
  inquilinoId: number;
  inquilinoNombre: string;
  habitacionCodigo: string;
  programadoPara: string;
  enviadoEn?: string;
  canal: CanalRecordatorio;
  telefonoDestino: string;
  mensaje: string;
  idMensajeProveedor?: string;
  estado: EstadoRecordatorio;
  tipo: "AUTOMATICO" | "MANUAL";
  creadoPorUsuarioId?: number;
}

export interface EstadisticasRecordatorios {
  totalProgramados: number;
  totalEnviados: number;
  totalFallidos: number;
  totalCancelados: number;
  tasaExito: number;
  proximosEnvios: number;
}

export interface FiltrosRecordatorios {
  estado?: EstadoRecordatorio;
  tipo?: "AUTOMATICO" | "MANUAL";
  fechaDesde?: string;
  fechaHasta?: string;
  inquilinoNombre?: string;
}

export interface ReminderConfigDto {
  propiedadId: number;
  diasAntes?: number | null;
  canal?: "WHATSAPP";
  telefonoRemitente?: string | null;
  estaActivo?: boolean | null;
  horaEnvio?: string | null; // HH:mm
  offsets?: string | null; // csv e.g. "-3,-2,-1,0,1,2"
  mensajeTemplate?: string | null;
}
