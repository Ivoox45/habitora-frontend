// src/feature/dashboard/pages/DashboardPage.tsx

import { useParams } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { StatCard } from "../components/StatCard";
import { IncomeChart } from "../components/IncomeChart";
import { OccupancyChart } from "../components/OccupancyChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const parsePropertyId = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

export const DashboardPage = () => {
  const { propiedadId: paramPropiedadId } = useParams();
  const { currentPropertyId } = useCurrentPropertyStore();
  const propertyId = parsePropertyId(paramPropiedadId ?? currentPropertyId);

  const { data: stats, isLoading, isError } = useDashboardStats(propertyId);

  if (!propertyId) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
          <AlertCircle className="w-5 h-5" />
          <p>Selecciona una propiedad para ver el dashboard.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-7">
          <Skeleton className="col-span-4 h-96" />
          <Skeleton className="col-span-3 h-96" />
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
          <AlertCircle className="w-5 h-5" />
          <p>Error al cargar las estadísticas del dashboard.</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general de tu propiedad
        </p>
      </div>

      {/* Stats Cards - Fila 1: Métricas principales */}
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

      {/* Stats Cards - Fila 2: Ingresos y Facturas */}
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
      <div className="grid gap-4 md:grid-cols-7">
        <IncomeChart data={stats.ingresosPorMes} />
        <OccupancyChart data={stats.ocupacionPorPiso} />
      </div>

      {/* Resumen de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumen de Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Contratos Activos
              </p>
              <p className="text-2xl font-bold">
                {stats.estadisticasContratos.activos}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Cancelados
              </p>
              <p className="text-2xl font-bold text-muted-foreground">
                {stats.estadisticasContratos.cancelados}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Pendientes de Firma
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-amber-600">
                  {stats.estadisticasContratos.sinFirmar}
                </p>
                {stats.estadisticasContratos.sinFirmar > 0 && (
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Requiere atención
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Próximos a Vencer
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-orange-600">
                  {stats.estadisticasContratos.proximosAVencer}
                </p>
                {stats.estadisticasContratos.proximosAVencer > 0 && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    30 días
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional de habitaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Análisis de Habitaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Precio Promedio de Renta
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.estadisticasHabitaciones.precioPromedioRenta)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total de Habitaciones
              </p>
              <p className="text-2xl font-bold">
                {stats.estadisticasHabitaciones.total}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Porcentaje de Ocupación
              </p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">
                  {stats.estadisticasHabitaciones.porcentajeOcupacion.toFixed(1)}%
                </p>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${stats.estadisticasHabitaciones.porcentajeOcupacion}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
