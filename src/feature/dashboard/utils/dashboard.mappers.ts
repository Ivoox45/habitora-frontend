import type { DashboardStatsDTO } from "../schemas/dashboard.schema";
import type { DashboardStats } from "../types/dashboard.types";

export function mapDashboardStats(dto: DashboardStatsDTO): DashboardStats {
    return {
        ...dto,

        resumenGeneral: {
            ...dto.resumenGeneral,
            tasaOcupacion: Number(dto.resumenGeneral.tasaOcupacion ?? 0),
        },

        estadisticasHabitaciones: {
            ...dto.estadisticasHabitaciones,
            porcentajeOcupacion: Number(dto.estadisticasHabitaciones.porcentajeOcupacion ?? 0),
            precioPromedioRenta: Number(dto.estadisticasHabitaciones.precioPromedioRenta ?? 0),
        },

        ingresos: {
            ...dto.ingresos,
            mesActual: Number(dto.ingresos.mesActual ?? 0),
            mesAnterior: Number(dto.ingresos.mesAnterior ?? 0),
            totalAno: Number(dto.ingresos.totalAno ?? 0),
            variacionMensual: Number(dto.ingresos.variacionMensual ?? 0),
            pendientesPorCobrar: Number(dto.ingresos.pendientesPorCobrar ?? 0),
        },

        estadisticasFacturas: {
            ...dto.estadisticasFacturas,
            montoPendiente: Number(dto.estadisticasFacturas.montoPendiente ?? 0),
            montoVencido: Number(dto.estadisticasFacturas.montoVencido ?? 0),
        },

        estadisticasContratos: {
            ...dto.estadisticasContratos,
        },

        ingresosPorMes: dto.ingresosPorMes.map((m) => ({
            ...m,
            mesNombre: m.mesNombre ?? "Mes",
            monto: Number(m.monto ?? 0),
            cantidadPagos: Number(m.cantidadPagos ?? 0),
        })),

        ocupacionPorPiso: dto.ocupacionPorPiso.map((o, index) => ({
            ...o,
            pisoCodigo: o.pisoCodigo || `Piso ${index + 1}`,
            porcentajeOcupacion: Number(o.porcentajeOcupacion ?? 0),
            ocupadas: Number(o.ocupadas ?? 0),
            disponibles: Number(o.disponibles ?? 0),
            totalHabitaciones: Number(o.totalHabitaciones ?? 0),
        })),
    };
}