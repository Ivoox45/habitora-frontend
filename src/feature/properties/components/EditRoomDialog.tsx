// src/feature/properties/components/EditRoomDialog.tsx

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Room } from "../types";
import { useUpdateRoom } from "../hooks/useUpdateRoom";

type EditRoomDialogProps = {
  propertyId: number;
  room: Room | null;               // habitación seleccionada
  open: boolean;                   // estado de apertura controlado
  onOpenChange: (open: boolean) => void;
};

export function EditRoomDialog({
  propertyId,
  room,
  open,
  onOpenChange,
}: EditRoomDialogProps) {
  const [code, setCode] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // Cuando cambie la habitación o se abra el diálogo, rellenamos los campos
  useEffect(() => {
    if (room && open) {
      setCode(room.code ?? "");
      setMonthlyRent(room.rentPrice ? String(Number(room.rentPrice)) : "");
    }
  }, [room, open]);

  const { mutate: actualizarHabitacion, isPending } = useUpdateRoom(
    propertyId,
    {
      onSuccess: () => {
        toast.success("Habitación actualizada correctamente");
        onOpenChange(false);
      },
      onError: () => {
        toast.error("No se pudo actualizar la habitación");
      },
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;

    if (!code.trim()) {
      toast.error("El código de la habitación es obligatorio");
      return;
    }

    const rentNumber = Number(monthlyRent || 0);
    if (Number.isNaN(rentNumber) || rentNumber < 0) {
      toast.error("Ingresa un monto de renta válido");
      return;
    }

    actualizarHabitacion({
      roomId: room.id,
      code: code.trim(),
      rentPrice: rentNumber,
    });
  };

  // Si no hay habitación seleccionada, no mostramos nada
  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar habitación {room.code}</DialogTitle>
          <DialogDescription>
            Actualiza el código y el precio mensual de la habitación. Los cambios
            se aplicarán inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Código de habitación */}
          <div className="space-y-2">
            <Label>Código de habitación</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: 201, 302"
              disabled={isPending}
              required
            />
          </div>

          {/* Renta mensual */}
          <div className="space-y-2">
            <Label>Renta mensual (S/)</Label>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(e.target.value)}
              placeholder="0.00"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
