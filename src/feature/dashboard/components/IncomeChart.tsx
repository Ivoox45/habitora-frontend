// src/feature/dashboard/components/IncomeChart.tsx

import { memo} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";
import type { IngresoMensual } from "../types/dashboard.types";


interface Props {
  data: IngresoMensual[];
}

export const IncomeChart = memo(function IncomeChart({ data }: Props) {
  // Estadísticas clave
  const total = data.reduce((acc, i) => acc + i.monto, 0);
  const max = Math.max(...data.map(i => i.monto), 0);
  const min = Math.min(...data.map(i => i.monto), 0);

  // Adaptar datos para el chart de shadcn (Recharts)
  const chartData = data.map((i) => ({
    name: i.mesNombre.split(" ")[0],
    monto: i.monto,
  }));

  // Configuración de colores y leyenda
  const chartConfig = {
    monto: {
      label: "Ingresos",
      color: "#3b82f6", // azul moderno
    },
  };


  return (
    <Card className="w-full md:col-span-4">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <div className="flex gap-8 mt-2">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">S/ {total.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Máximo</div>
            <div className="text-lg font-semibold">S/ {max.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Mínimo</div>
            <div className="text-lg font-semibold">S/ {min.toLocaleString()}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={16}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Bar dataKey="monto" radius={[8, 8, 0, 0]} fill="#3b82f6" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
