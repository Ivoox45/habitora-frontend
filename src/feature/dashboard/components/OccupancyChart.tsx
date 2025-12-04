// src/feature/dashboard/components/OccupancyChart.tsx

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import type { OcupacionPiso } from "../types/dashboard.types";

interface Props {
  data: OcupacionPiso[];
}

export const OccupancyChart = memo(function OccupancyChart({ data }: Props) {
  // Estadísticas clave
  const totalOcupadas = data.reduce((acc, item) => acc + item.ocupadas, 0);
  const totalDisponibles = data.reduce((acc, item) => acc + item.disponibles, 0);
  const totalHabitaciones = totalOcupadas + totalDisponibles;
  const porcentajeOcupacion = totalHabitaciones > 0 
    ? ((totalOcupadas / totalHabitaciones) * 100).toFixed(1) 
    : "0.0";

  // Adaptar datos para el chart de shadcn (Recharts)
  const chartData = data.map((item) => ({
    piso: item.pisoCodigo,
    ocupadas: item.ocupadas,
    disponibles: item.disponibles,
  }));

  // Configuración de colores y leyenda
  const chartConfig = {
    ocupadas: {
      label: "Ocupadas",
      color: "#6366f1", // indigo
    },
    disponibles: {
      label: "Disponibles",
      color: "#94a3b8", // slate
    },
  };

  return (
    <Card className="w-full md:col-span-3">
      <CardHeader>
        <CardTitle>Ocupación por Piso</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución de habitaciones ocupadas y disponibles
        </p>
        <div className="flex gap-6 mt-3">
          <div>
            <div className="text-xs text-muted-foreground">Ocupadas</div>
            <div className="text-2xl font-bold text-indigo-500">{totalOcupadas}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Disponibles</div>
            <div className="text-2xl font-bold text-slate-500">{totalDisponibles}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">% Ocupación</div>
            <div className="text-2xl font-bold">{porcentajeOcupacion}%</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] sm:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="horizontal">
              <XAxis type="category" dataKey="piso" axisLine={false} tickLine={false} />
              <YAxis type="number" axisLine={false} tickLine={false} />
              <Bar dataKey="ocupadas" stackId="a" radius={[0, 0, 0, 0]} fill="#6366f1" />
              <Bar dataKey="disponibles" stackId="a" radius={[4, 4, 0, 0]} fill="#94a3b8" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
