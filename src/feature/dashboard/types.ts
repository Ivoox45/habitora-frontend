// src/feature/dashboard/types.ts

export interface DashboardStats {
  resumenGeneral: ResumenGeneral;
  estadisticasHabitaciones: EstadisticasHabitaciones;
  ingresos: Ingresos;
  estadisticasFacturas: EstadisticasFacturas;
  estadisticasContratos: EstadisticasContratos;
  ingresosPorMes: IngresoMensual[];
  ocupacionPorPiso: OcupacionPiso[];
}

export interface ResumenGeneral {
  totalHabitaciones: number;
  habitacionesOcupadas: number;
  habitacionesDisponibles: number;
  totalInquilinos: number;
  contratosActivos: number;
  ingresosMesActual: number;
  tasaOcupacion: number;
}

export interface EstadisticasHabitaciones {
  total: number;
  ocupadas: number;
  disponibles: number;
  porcentajeOcupacion: number;
  precioPromedioRenta: number;
}

export interface Ingresos {
  mesActual: number;
  mesAnterior: number;
  totalAno: number;
  variacionMensual: number;
  pendientesPorCobrar: number;
}

export interface EstadisticasFacturas {
  totalAbiertas: number;
  totalPagadas: number;
  totalVencidas: number;
  montoPendiente: number;
  montoVencido: number;
}

export interface EstadisticasContratos {
  activos: number;
  cancelados: number;
  sinFirmar: number;
  proximosAVencer: number;
}

export interface IngresoMensual {
  mes: string;
  mesNombre: string;
  monto: number;
  cantidadPagos: number;
}

export interface OcupacionPiso {
  pisoCodigo: string;
  totalHabitaciones: number;
  ocupadas: number;
  disponibles: number;
  porcentajeOcupacion: number;
}
