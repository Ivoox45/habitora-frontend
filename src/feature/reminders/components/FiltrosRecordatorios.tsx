import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import type { FiltrosRecordatorios, EstadoRecordatorio } from "../types";

export function FiltrosRecordatorios({ filtrosActuales, onFiltrosChange }: { filtrosActuales: FiltrosRecordatorios; onFiltrosChange: (f: FiltrosRecordatorios) => void; }) {
  const estado = filtrosActuales.estado ?? "";
  const tipo = filtrosActuales.tipo ?? "";
  const estados = useMemo(() => ["PROGRAMADO", "ENVIADO", "FALLIDO", "CANCELADO"], []);
  const tipos = useMemo(() => ["AUTOMATICO", "MANUAL"], []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <Label>Estado</Label>
        <Select value={estado} onValueChange={(v) => onFiltrosChange({ ...filtrosActuales, estado: (v as EstadoRecordatorio) || undefined })}>
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {estados.map((e) => (<SelectItem key={e} value={e}>{e}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tipo</Label>
        <Select value={tipo} onValueChange={(v) => onFiltrosChange({ ...filtrosActuales, tipo: (v as "AUTOMATICO" | "MANUAL") || undefined })}>
          <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {tipos.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
