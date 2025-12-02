import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../api/dashboard.api";
import type { DashboardStats } from "../types/dashboard.types";

export function useDashboardStats(propertyId: number | null) {
  return useQuery<DashboardStats>({
    queryKey: ["dashboard", propertyId],
    enabled: !!propertyId,
    queryFn: () => fetchDashboardStats(propertyId!),
    staleTime: 1000 * 60 * 2,
  });
}
