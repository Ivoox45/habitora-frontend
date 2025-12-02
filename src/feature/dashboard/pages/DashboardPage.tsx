import { useParams } from "react-router-dom";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { DashboardError } from "@/feature/dashboard/components/DashboardError";
import { DashboardHeader } from "@/feature/dashboard/components/DashboardHeader";
import { DashboardSkeleton } from "@/feature/dashboard/components/DashboardSkeleton";
import { DashboardContent } from "@/feature/dashboard/components/DashboardContent";
import { useDashboardStats } from "@/feature/dashboard/hooks/useDashboardStats";
import { parsePropertyId } from "@/feature/dashboard/utils/dashboard.formatters";


export function DashboardPage() {
  const { propiedadId } = useParams();
  const { currentPropertyId } = useCurrentPropertyStore();

  const paramId = parsePropertyId(propiedadId);
  const storeId = currentPropertyId ?? null;

  const propertyId = paramId ?? storeId;

  const { data, error, isLoading, isError } = useDashboardStats(propertyId);

  // DEBUG
  console.log("PROPERTY ID:", propertyId);
  console.log("RAW DATA:", data);
  console.log("ERROR:", error);

  if (!propertyId) {
    return <DashboardError message="Selecciona una propiedad." />;
  }

  if (isLoading) return <DashboardSkeleton />;

  if (isError || !data) {
    return <DashboardError message="Error al cargar el dashboard." />;
  }

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader />
      <DashboardContent stats={data} />
    </div>
  );
}
