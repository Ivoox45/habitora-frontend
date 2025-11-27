import { EmptyState } from "@/components/EmptyState";
import { Bell } from "lucide-react";

export const RemindersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Recordatorios</h2>
        <p className="text-sm text-muted-foreground">
          Mantén el control de pagos pendientes y fechas importantes
        </p>
      </div>
      
      <EmptyState
        icon={Bell}
        title="Módulo de recordatorios próximamente"
        description="Pronto podrás configurar recordatorios automáticos para pagos vencidos, contratos por renovar y más."
      />
    </div>
  );
};
