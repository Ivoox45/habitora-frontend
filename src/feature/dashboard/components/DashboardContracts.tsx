import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "../types/dashboard.types";

interface Props {
    stats: DashboardStats;
}

export function DashboardContracts({ stats }: Props) {
    const d = stats.estadisticasContratos;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resumen de Contratos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                    <Metric title="Activos" value={d.activos} />
                    <Metric title="Cancelados" value={d.cancelados} muted />
                    <Metric
                        title="Sin Firmar"
                        value={d.sinFirmar}
                        badge={d.sinFirmar > 0 ? "Requiere atención" : undefined}
                        badgeColor="text-amber-600 border-amber-600"
                    />
                    <Metric
                        title="Próximos a vencer"
                        value={d.proximosAVencer}
                        badge={d.proximosAVencer > 0 ? "30 días" : undefined}
                        badgeIcon={Calendar}
                        badgeColor="text-orange-600 border-orange-600"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function Metric({
    title,
    value,
    muted,
    badge,
    badgeColor,
    badgeIcon: Icon,
}: any) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
                <p className={`text-2xl font-bold ${muted ? "text-muted-foreground" : ""}`}>
                    {value}
                </p>
                {badge && (
                    <Badge variant="outline" className={badgeColor}>
                        {Icon && <Icon className="w-3 h-3 mr-1" />} {badge}
                    </Badge>
                )}
            </div>
        </div>
    );
}
