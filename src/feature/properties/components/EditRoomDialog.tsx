// src/feature/properties/components/EditRoomDialog.tsx

import { useEffect, useMemo, useState, type FormEvent } from "react";
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
import { Label } from "@/components/ui/label";

import type { Room, RoomsByFloor } from "../types";
import { useUpdateRoom } from "../hooks/useUpdateRoom";
import { useRoomsByProperty } from "../hooks/useRoomsByProperty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

type EditRoomDialogProps = {
  propertyId: number;
  room: Room | null; // habitación seleccionada
  open: boolean; // estado de apertura controlado
  onOpenChange: (open: boolean) => void;
};

const MAX_ROOMS_PER_FLOOR = 8;

/**
 * Devuelve los códigos disponibles para una habitación concreta,
 * en el piso de esa habitación.
 *
 * Reglas:
 * - Solo códigos .01 a .08 del piso (ej: piso 2 -> 201..208).
 * - No se repiten códigos de otras habitaciones del mismo piso.
 * - Incluye el código actual de la habitación si entra en el rango.
 */
function getAvailableCodesForRoom(
  floors: RoomsByFloor[],
  room: Room
): number[] {
  const floor = floors.find((f) => f.floorId === room.floorId);
  if (!floor) return [];

  const base = floor.floorNumber * 100; // piso 2 -> 200
  const min = base + 1;
  const max = base + MAX_ROOMS_PER_FLOOR;

  // Códigos usados por OTRAS habitaciones del piso
  const used = new Set(
    floor.rooms
      .filter((r) => r.id !== room.id)
      .map((r) => Number(r.code))
      .filter((n) => Number.isFinite(n))
  );

  const available: number[] = [];

  for (let i = 1; i <= MAX_ROOMS_PER_FLOOR; i++) {
    const code = base + i;
    if (!used.has(code)) {
      available.push(code);
    }
  }

  // Aseguramos que el código actual esté en la lista (por si acaso)
  const currentNum = Number(room.code);
  if (
    Number.isFinite(currentNum) &&
    currentNum >= min &&
    currentNum <= max &&
    !available.includes(currentNum)
  ) {
    available.push(currentNum);
  }

  return available.sort((a, b) => a - b);
}

export function EditRoomDialog({
  propertyId,
  room,
  open,
  onOpenChange,
}: EditRoomDialogProps) {
  const [code, setCode] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // Traemos todos los pisos + habitaciones de la propiedad
  const { data: floors, isLoading: isLoadingFloors } =
    useRoomsByProperty(propertyId);

  // Códigos disponibles para el piso de esta habitación
  const availableCodes = useMemo(() => {
    if (!room || !floors) return [];
    return getAvailableCodesForRoom(floors, room);
  }, [floors, room]);

  // Cuando cambie la habitación / pisos / se abra el diálogo, inicializamos
  useEffect(() => {
    if (!room || !open) return;

    // Renta
    setMonthlyRent(room.rentPrice ? String(Number(room.rentPrice)) : "");

    // Código: preferimos el actual si está en la lista, si no, el primero disponible
    if (availableCodes.length === 0) {
      setCode("");
      return;
    }

    const currentNum = Number(room.code);
    if (Number.isFinite(currentNum) && availableCodes.includes(currentNum)) {
      setCode(String(currentNum));
    } else {
      setCode(String(availableCodes[0]));
    }
  }, [room, open, availableCodes]);

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

    if (!code) {
      toast.error("Selecciona un código de habitación");
      return;
    }

    const codeNumber = Number(code);
    if (!Number.isFinite(codeNumber)) {
      toast.error("El código de la habitación no es válido");
      return;
    }

    const rentNumber = Number(monthlyRent || 0);
    if (Number.isNaN(rentNumber) || rentNumber < 0) {
      toast.error("Ingresa un monto de renta válido");
      return;
    }

    actualizarHabitacion({
      roomId: room.id,
      code: String(codeNumber),
      rentPrice: rentNumber,
    });
  };

  // Si no hay habitación seleccionada, no renderizamos el diálogo
  if (!room) return null;

  const isCodeDisabled =
    isPending || isLoadingFloors || !availableCodes || availableCodes.length === 0;

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
          {/* Código de habitación (Select con códigos disponibles) */}
          <div className="space-y-2">
            <Label>Código de habitación</Label>
            <Select
              value={code}
              onValueChange={setCode}
              disabled={isCodeDisabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingFloors
                      ? "Cargando códigos..."
                      : "Selecciona un código disponible"
                  }
                />
              </SelectTrigger>
              <SelectContent className="w-full">
                {availableCodes.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Solo se muestran códigos disponibles para este piso (.01 hasta
              .08). Si ya no hay códigos libres, no podrás cambiar el código.
            </p>
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
            <Button type="submit" disabled={isPending || !code}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
