// src/feature/contracts/components/ContractsTable.tsx

import { useState } from "react";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import type { ContratoListado } from "../types";

type ContractsTableProps = {
  contracts: ContratoListado[];
  onViewDetails?: (contractId: number) => void;
  onSign?: (contractId: number) => void;
  onFinalize?: (contractId: number) => void;
  finalizingId?: number | null;
};

const getStatusBadge = (estado: string, tieneFirma: boolean) => {
  if (estado === "CANCELADO") {
    return (
      <Badge className="bg-slate-100 text-slate-700 border border-slate-200">
        Cancelado
      </Badge>
    );
  }

  if (estado === "ACTIVO" && !tieneFirma) {
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-200">
        Activo (sin firmar)
      </Badge>
    );
  }

  if (estado === "ACTIVO" && tieneFirma) {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
        Activo (firmado)
      </Badge>
    );
  }

  return <Badge variant="outline">{estado}</Badge>;
};

export function ContractsTable({
  contracts,
  onViewDetails,
  onSign,
  onFinalize,
  finalizingId,
}: ContractsTableProps) {
  const [contractToFinalize, setContractToFinalize] = useState<ContratoListado | null>(null);

  const handleFinalizeClick = (contract: ContratoListado) => {
    setContractToFinalize(contract);
  };

  const handleConfirmFinalize = () => {
    if (contractToFinalize) {
      onFinalize?.(contractToFinalize.id);
      setContractToFinalize(null);
    }
  };

  const handleCancelFinalize = () => {
    setContractToFinalize(null);
  };

  if (!contracts.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No hay contratos registrados"
        description="Crea contratos de alquiler para tus inquilinos y gestiona automáticamente los pagos mensuales."
        compact
      />
    );
  }

  return (
    <>
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>Inquilino</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Habitación</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>Depósito (S/)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {contracts.map((c) => {
            const canSign = c.estado === "ACTIVO" && !c.tieneFirma;
            const isFinalizing = finalizingId === c.id;

            return (
              <TableRow key={c.id}>
                <TableCell>{getStatusBadge(c.estado, c.tieneFirma)}</TableCell>
                <TableCell>{c.inquilinoNombre}</TableCell>
                <TableCell>{c.inquilinoDni}</TableCell>
                <TableCell>{c.habitacionCodigo}</TableCell>
                <TableCell>{c.fechaInicio}</TableCell>
                <TableCell>{c.fechaFin}</TableCell>
                <TableCell>{c.montoDeposito.toFixed(2)}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails?.(c.id)}
                  >
                    Ver
                  </Button>

                  {canSign && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSign?.(c.id)}
                    >
                      Firmar
                    </Button>
                  )}

                  {c.estado === "ACTIVO" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleFinalizeClick(c)}
                      disabled={isFinalizing}
                    >
                      {isFinalizing ? "Finalizando..." : "Finalizar"}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>

    <Dialog open={!!contractToFinalize} onOpenChange={handleCancelFinalize}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            ¿Finalizar contrato?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>
              Estás a punto de finalizar el contrato de{" "}
              <span className="font-semibold">
                {contractToFinalize?.inquilinoNombre}
              </span>{" "}
              en la habitación{" "}
              <span className="font-semibold">
                {contractToFinalize?.habitacionCodigo}
              </span>
              .
            </p>
            <p className="text-sm">
              Esta acción marcará el contrato como{" "}
              <span className="font-semibold">cancelado</span>, liberará la
              habitación y <span className="font-semibold">cancelará todas las
              facturas pendientes</span> asociadas.
            </p>
            <p className="text-sm font-medium text-destructive">
              Esta acción no se puede deshacer.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancelFinalize}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirmFinalize}>
            Sí, finalizar contrato
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </>
  );
}
