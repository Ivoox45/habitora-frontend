import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { Recordatorio } from "../types";

export function RecordatoriosTable({ recordatorios, isLoading }: { recordatorios: Recordatorio[]; isLoading?: boolean; }) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (<Skeleton key={i} className="h-8 w-full" />))}
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Inquilino</TableHead>
          <TableHead>Habitación</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Programado</TableHead>
          <TableHead>Enviado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recordatorios.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.id}</TableCell>
            <TableCell>{r.inquilinoNombre}</TableCell>
            <TableCell>{r.habitacionCodigo}</TableCell>
            <TableCell>{r.tipo}</TableCell>
            <TableCell>{r.estado}</TableCell>
            <TableCell>{r.programadoPara}</TableCell>
            <TableCell>{r.enviadoEn || "-"}</TableCell>
          </TableRow>
        ))}
        {recordatorios.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">No hay recordatorios</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
