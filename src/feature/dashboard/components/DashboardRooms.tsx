import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import type { DashboardStats } from "../types/dashboard.types";
import { formatCurrency } from "../utils/dashboard.formatters";

interface Props {
    stats: DashboardStats;
}

export function DashboardRooms({ stats }: Props) {
    const r = stats.estadisticasHabitaciones;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Home className="w-5 h-5" />
                    Análisis de Habitaciones
                </CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <RoomMetric
                        title="Precio Promedio de Renta"
                        value={formatCurrency(r.precioPromedioRenta)}
                    />
                    <RoomMetric title="Total de Habitaciones" value={r.total} />
                    <RoomMetric
                        title="Porcentaje de Ocupación"
                        value={`${r.porcentajeOcupacion.toFixed(1)}%`}
                        bar={r.porcentajeOcupacion}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function RoomMetric({ title, value, bar }: { title: string; value: any; bar?: number }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>

            {bar ? (
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{value}</p>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${bar}%` }}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-2xl font-bold">{value}</p>
            )}
        </div>
    );
}
