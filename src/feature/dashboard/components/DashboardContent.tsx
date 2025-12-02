import { StatCard } from "./StatCard";
import { IncomeChart } from "./IncomeChart";
import { OccupancyChart } from "./OccupancyChart";
import {
    Home,
    Users,
    TrendingUp,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import type { DashboardStats } from "../types/dashboard.types";
import { formatCurrency } from "../utils/dashboard.formatters";
import { DashboardContracts } from "./DashboardContracts";
import { DashboardRooms } from "./DashboardRooms";

interface Props {
    stats: DashboardStats;
}

export function DashboardContent({ stats }: Props) {
    return (
        <>
            {/* Métricas principales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Habitaciones"
                    value={stats.resumenGeneral.totalHabitaciones}
                    icon={Home}
                    description={`${stats.resumenGeneral.habitacionesOcupadas} ocupadas, ${stats.resumenGeneral.habitacionesDisponibles} disponibles`}
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Tasa de Ocupación"
                    value={`${stats.resumenGeneral.tasaOcupacion.toFixed(1)}%`}
                    icon={TrendingUp}
                    description={`${stats.resumenGeneral.habitacionesOcupadas} de ${stats.resumenGeneral.totalHabitaciones} habitaciones`}
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Inquilinos Activos"
                    value={stats.resumenGeneral.totalInquilinos}
                    icon={Users}
                    description={`${stats.resumenGeneral.contratosActivos} contratos activos`}
                    iconColor="text-purple-600"
                />
                <StatCard
                    title="Ingresos del Mes"
                    value={formatCurrency(stats.resumenGeneral.ingresosMesActual)}
                    icon={DollarSign}
                    trend={{
                        value: stats.ingresos.variacionMensual,
                        isPositive: stats.ingresos.variacionMensual >= 0,
                    }}
                    iconColor="text-emerald-600"
                />
            </div>

            {/* Ingresos y Facturas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total del Año"
                    value={formatCurrency(stats.ingresos.totalAno)}
                    icon={DollarSign}
                    description="Ingresos acumulados"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Pendientes por Cobrar"
                    value={formatCurrency(stats.ingresos.pendientesPorCobrar)}
                    icon={Clock}
                    description={`${stats.estadisticasFacturas.totalAbiertas + stats.estadisticasFacturas.totalVencidas} facturas`}
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Facturas Pagadas"
                    value={stats.estadisticasFacturas.totalPagadas}
                    icon={CheckCircle}
                    description="Facturas completadas"
                    iconColor="text-green-600"
                />
                <StatCard
                    title="Facturas Vencidas"
                    value={stats.estadisticasFacturas.totalVencidas}
                    icon={XCircle}
                    description={formatCurrency(stats.estadisticasFacturas.montoVencido)}
                    iconColor="text-red-600"
                />
            </div>

            {/* Gráficos */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
                <IncomeChart data={stats.ingresosPorMes} />
                <OccupancyChart data={stats.ocupacionPorPiso} />
            </div>

            {/* Resumen Contratos */}
            <DashboardContracts stats={stats} />

            {/* Habitaciones */}
            <DashboardRooms stats={stats} />
        </>
    );
}
