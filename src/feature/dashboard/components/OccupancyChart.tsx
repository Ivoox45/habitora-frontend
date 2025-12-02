// src/feature/dashboard/components/OccupancyChart.tsx

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { useTheme } from "@/components/theme-provider";
import type { OcupacionPiso } from "../types/dashboard.types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  data: OcupacionPiso[];
}

export const OccupancyChart = memo(function OccupancyChart({ data }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const labels = data.map((item) => item.pisoCodigo);
  const ocupadas = data.map((item) => item.ocupadas);
  const disponibles = data.map((item) => item.disponibles);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Ocupadas",
        data: ocupadas,
        backgroundColor: isDark
          ? "rgba(99, 102, 241, 0.8)"
          : "rgba(99, 102, 241, 0.9)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: "Disponibles",
        data: disponibles,
        backgroundColor: isDark
          ? "rgba(148, 163, 184, 0.5)"
          : "rgba(203, 213, 225, 0.8)",
        borderColor: "rgba(148, 163, 184, 1)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#fff" : "#0f172a",
          font: { size: 12, weight: 500 },
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#0f172aec" : "#ffffffee",
        titleColor: isDark ? "#fff" : "#0f172a",
        bodyColor: isDark ? "#fff" : "#0f172a",
        borderColor: isDark ? "#ffffff20" : "#00000020",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: isDark ? "#fff" : "#0f172a",
          font: { size: 11 },
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: isDark ? "#fff" : "#0f172a",
          font: { size: 11, weight: 500 },
        },
      },
    },
    animation: {
      duration: 700,
      easing: "easeInOutQuart",
    },
  };

  return (
    <Card className="w-full md:col-span-3">
      <CardHeader>
        <CardTitle>Ocupación por Piso</CardTitle>
        <p className="text-sm text-muted-foreground">
          Distribución de habitaciones ocupadas y disponibles
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] sm:h-[350px] relative">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
});
