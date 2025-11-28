// src/feature/dashboard/api/dashboard.ts

import axiosInstance from "@/lib/axios";
import type { DashboardStats } from "../types";

export async function getDashboardStats(
  propertyId: number
): Promise<DashboardStats> {
  const response = await axiosInstance.get<DashboardStats>(
    `/api/propiedades/${propertyId}/dashboard`
  );
  return response.data;
}
