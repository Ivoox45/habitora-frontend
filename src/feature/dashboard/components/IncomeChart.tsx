// src/feature/dashboard/components/IncomeChart.tsx

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
import type { IngresoMensual } from "../types";

interface IncomeChartProps {
  data: IngresoMensual[];
}

export function IncomeChart({ data }: IncomeChartProps) {
  const chartData = data.map((item) => ({
    name: item.mesNombre.split(" ")[0], // Solo el mes
    monto: item.monto,
    cantidadPagos: item.cantidadPagos,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
        <p className="text-sm text-muted-foreground">
          Evolución de ingresos en los últimos 6 meses
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickFormatter={(value) => `S/ ${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value: number) => [`S/ ${value.toFixed(2)}`, "Monto"]}
            />
            <Legend />
            <Bar
              dataKey="monto"
              fill="hsl(var(--primary))"
              radius={[8, 8, 0, 0]}
              name="Ingresos"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
