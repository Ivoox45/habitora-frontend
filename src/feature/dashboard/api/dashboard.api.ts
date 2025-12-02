import axiosInstance from "@/lib/axios";
import { DashboardStatsSchema } from "../schemas/dashboard.schema";
import { mapDashboardStats } from "../utils/dashboard.mappers";

export async function fetchDashboardStats(propertyId: number) {
    const { data } = await axiosInstance.get(`/api/propiedades/${propertyId}/dashboard`);

    const parsed = DashboardStatsSchema.parse(data);
    return mapDashboardStats(parsed);
}
