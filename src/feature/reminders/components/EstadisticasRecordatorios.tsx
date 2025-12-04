import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { EstadisticasRecordatorios } from "../types";

export function EstadisticasRecordatoriosCards({ estadisticas, isLoading }: { estadisticas?: EstadisticasRecordatorios; isLoading?: boolean; }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-6 w-24" /><Skeleton className="h-4 w-32 mt-2" /></CardContent></Card>
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card><CardContent className="p-4"><div className="text-2xl font-bold">{estadisticas?.totalProgramados || 0}</div><div className="text-xs text-muted-foreground">Programados</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-2xl font-bold">{estadisticas?.totalEnviados || 0}</div><div className="text-xs text-muted-foreground">Enviados</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-2xl font-bold">{estadisticas?.totalFallidos || 0}</div><div className="text-xs text-muted-foreground">Fallidos</div></CardContent></Card>
      <Card><CardContent className="p-4"><div className="text-2xl font-bold">{estadisticas?.totalCancelados || 0}</div><div className="text-xs text-muted-foreground">Cancelados</div></CardContent></Card>
    </div>
  );
}
