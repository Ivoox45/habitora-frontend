import { z } from "zod";

export const ResumenGeneralSchema = z.object({
    totalHabitaciones: z.number(),
    habitacionesOcupadas: z.number(),
    habitacionesDisponibles: z.number(),
    totalInquilinos: z.number(),
    contratosActivos: z.number(),
    ingresosMesActual: z.number(),
    tasaOcupacion: z.number(),
});

export const EstadisticasHabitacionesSchema = z.object({
    total: z.number(),
    ocupadas: z.number(),
    disponibles: z.number(),
    porcentajeOcupacion: z.number(),
    precioPromedioRenta: z.number(),
});

export const IngresoMensualSchema = z.object({
    mes: z.string(),
    mesNombre: z.string().nullable().optional().default("Mes"),
    monto: z.number(),
    cantidadPagos: z.number().nullable().optional().default(0),
});

export const OcupacionPisoSchema = z.object({
    pisoCodigo: z.string().nullable().optional().default("N/A"),
    totalHabitaciones: z.number(),
    ocupadas: z.number(),
    disponibles: z.number(),
    porcentajeOcupacion: z.number(),
});

export const IngresosSchema = z.object({
    mesActual: z.number(),
    mesAnterior: z.number(),
    totalAno: z.number(),
    variacionMensual: z.number().nullable().optional().default(0),
    pendientesPorCobrar: z.number().nullable().optional().default(0),
});

export const EstadisticasFacturasSchema = z.object({
    totalAbiertas: z.number(),
    totalPagadas: z.number(),
    totalVencidas: z.number(),
    montoPendiente: z.number().nullable().optional().default(0),
    montoVencido: z.number().nullable().optional().default(0),
});

export const EstadisticasContratosSchema = z.object({
    activos: z.number(),
    cancelados: z.number(),
    sinFirmar: z.number(),
    proximosAVencer: z.number(),
});

export const DashboardStatsSchema = z.object({
    resumenGeneral: ResumenGeneralSchema,
    estadisticasHabitaciones: EstadisticasHabitacionesSchema,
    ingresos: IngresosSchema,
    estadisticasFacturas: EstadisticasFacturasSchema,
    estadisticasContratos: EstadisticasContratosSchema,
    ingresosPorMes: z.array(IngresoMensualSchema),
    ocupacionPorPiso: z.array(OcupacionPisoSchema),
});

export type DashboardStatsDTO = z.infer<typeof DashboardStatsSchema>;
