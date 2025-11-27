// src/feature/payments/components/RegistrarPagoDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Factura, MetodoPago } from "../types";
import { useRegistrarPago } from "../hooks/useRegistrarPago";

interface RegistrarPagoDialogProps {
  open: boolean;
  onClose: () => void;
  factura: Factura | null;
  propiedadId: number;
}

export function RegistrarPagoDialog({
  open,
  onClose,
  factura,
  propiedadId,
}: RegistrarPagoDialogProps) {
  const [fechaPago, setFechaPago] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [metodo, setMetodo] = useState<MetodoPago>("EFECTIVO");

  const { mutate: registrarPago, isPending } = useRegistrarPago();

  const handleSubmit = () => {
    if (!factura) return;

    registrarPago(
      {
        propiedadId,
        facturaId: factura.id,
        request: {
          fechaPago,
          monto: factura.montoRenta,
          metodo,
        },
      },
      {
        onSuccess: () => {
          onClose();
          // Reset form
          setFechaPago(new Date().toISOString().split("T")[0]);
          setMetodo("EFECTIVO");
        },
      }
    );
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(monto);
  };

  if (!factura) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pago</DialogTitle>
          <DialogDescription>
            Registra el pago completo de la factura
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Info de la factura */}
          <div className="space-y-2 rounded-lg bg-muted/50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inquilino:</span>
              <span className="font-medium">{factura.inquilinoNombre}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Habitación:</span>
              <span className="font-medium">{factura.habitacionCodigo}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto:</span>
              <span className="font-semibold text-lg">
                {formatMonto(factura.montoRenta)}
              </span>
            </div>
          </div>

          {/* Fecha de pago */}
          <div className="space-y-2">
            <Label htmlFor="fechaPago">Fecha de pago *</Label>
            <Input
              id="fechaPago"
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="metodo">Método de pago *</Label>
            <Select value={metodo} onValueChange={(v) => setMetodo(v as MetodoPago)}>
              <SelectTrigger id="metodo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
                <SelectItem value="YAPE">Yape</SelectItem>
                <SelectItem value="PLIN">Plin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Registrando..." : "Registrar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
