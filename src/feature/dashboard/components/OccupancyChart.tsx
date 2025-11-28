// src/feature/dashboard/components/OccupancyChart.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { OcupacionPiso } from "../types";

interface OccupancyChartProps {
  data: OcupacionPiso[];
}

export function OccupancyChart({ data }: OccupancyChartProps) {
  const chartData = data.map((item) => ({
    piso: item.pisoCodigo,
    ocupadas: item.ocupadas,
    disponibles: item.disponibles,
    porcentaje: item.porcentajeOcupacion,
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Ocupación por Piso</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución de habitaciones ocupadas y disponibles
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              type="number"
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              type="category"
              dataKey="piso"
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Legend />
            <Bar
              dataKey="ocupadas"
              stackId="a"
              fill="hsl(var(--primary))"
              name="Ocupadas"
              radius={[0, 4, 4, 0]}
            />
            <Bar
              dataKey="disponibles"
              stackId="a"
              fill="hsl(var(--muted))"
              name="Disponibles"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
