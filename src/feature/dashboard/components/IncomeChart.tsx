// src/feature/dashboard/components/IncomeChart.tsx

import { memo, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import { useTheme } from "@/components/theme-provider";
import type { IngresoMensual } from "../types/dashboard.types";

interface Props {
  data: IngresoMensual[];
}

export const IncomeChart = memo(function IncomeChart({ data }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartData = useMemo(() => {
    const labels = data.map((i) => i.mesNombre.split(" ")[0]);
    const montos = data.map((i) => i.monto);

    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: montos,
          backgroundColor: isDark
            ? "rgba(16,185,129,0.8)"
            : "rgba(16,185,129,0.9)",
          borderColor: "rgba(16,185,129,1)",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [data, isDark]);

  return (
    <Card className="w-full md:col-span-4">
      <CardHeader>
        <CardTitle>Ingresos Mensuales</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] relative">
          <Bar data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
});
