// src/feature/dashboard/hooks/useDashboardStats.ts

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../api/dashboard";
import type { DashboardStats } from "../types";

export const useDashboardStats = (propertyId: number | null) => {
  return useQuery<DashboardStats, Error>({
    queryKey: ["dashboard", "stats", propertyId],
    enabled: !!propertyId && propertyId > 0,
    queryFn: () => getDashboardStats(propertyId as number),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
