// src/feature/payments/components/FacturasTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertCircle, Receipt } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import type { Factura } from "../types";

interface FacturasTableProps {
  facturas: Factura[];
  onRegistrarPago: (factura: Factura) => void;
}

export function FacturasTable({ facturas, onRegistrarPago }: FacturasTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  const getEstadoBadge = (factura: Factura) => {
    if (factura.esPagada) {
      return <Badge className="bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400">Pagada</Badge>;
    }
    if (factura.esVencida) {
      return (
        <Badge className="bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400">
          Vencida {factura.diasRetraso > 0 && `(${factura.diasRetraso}d)`}
        </Badge>
      );
    }
    return <Badge className="bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400">Pendiente</Badge>;
  };

  if (facturas.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No hay facturas"
        description="Las facturas se generan automáticamente cuando creas un contrato de alquiler activo."
        compact
      />
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Inquilino</TableHead>
            <TableHead>Habitación</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell className="font-medium">{factura.inquilinoNombre}</TableCell>
              <TableCell>{factura.habitacionCodigo}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(factura.periodoInicio)} - {formatDate(factura.periodoFin)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {factura.esVencida && !factura.esPagada && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  {formatDate(factura.fechaVencimiento)}
                </div>
              </TableCell>
              <TableCell className="font-semibold">{formatMonto(factura.montoRenta)}</TableCell>
              <TableCell>{getEstadoBadge(factura)}</TableCell>
              <TableCell className="text-right">
                {!factura.esPagada && (
                  <Button
                    size="sm"
                    onClick={() => onRegistrarPago(factura)}
                    className="gap-1"
                  >
                    <DollarSign className="h-4 w-4" />
                    Registrar Pago
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
