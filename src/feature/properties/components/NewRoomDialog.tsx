// src/feature/properties/components/NewRoomDialog.tsx

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRoomsByProperty } from "../hooks/useRoomsByProperty";
import { useCreateRoomManual } from "../hooks/useCreateRoomManual";
import type { RoomsByFloor } from "../types";

type NewRoomDialogProps = {
  propertyId: number;
};

/**
 * Calcula información útil para validación de códigos de un piso:
 * - maxExisting: el código numérico más alto ya existente
 * - limit: último código permitido (floorNumber*100 + 8)
 * - nextSuggested: siguiente código recomendado (o null si ya llegó al límite)
 */
function getFloorCodeInfo(floor: RoomsByFloor) {
  const base = floor.floorNumber * 100; // ej: piso 2 -> 200
  const limit = base + 8; // ...08 (máx. 8 habitaciones)

  const numericCodes = floor.rooms
    .map((room) => Number(room.code))
    .filter((n) => Number.isFinite(n));

  const maxExisting = numericCodes.length ? Math.max(...numericCodes) : base;
  const nextSuggested = maxExisting + 1;

  return {
    maxExisting,
    limit,
    nextSuggested: nextSuggested > limit ? null : nextSuggested,
  };
}

export function NewRoomDialog({ propertyId }: NewRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [floorId, setFloorId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // Pisos de la propiedad (para el combo)
  const {
    data: floors,
    isLoading: isLoadingFloors,
    isError: isErrorFloors,
  } = useRoomsByProperty(propertyId);

  const { mutate: crearHabitacion, isPending } = useCreateRoomManual(
    propertyId,
    {
      onSuccess: () => {
        toast.success("Habitación creada correctamente");
        // reseteamos estado del formulario
        setFloorId(null);
        setCode("");
        setMonthlyRent("");
        setOpen(false);
      },
      onError: () => {
        toast.error("No se pudo crear la habitación");
      },
    }
  );

  const handleFloorChange = (value: string) => {
    const id = Number(value);
    setFloorId(id);

    if (!floors) return;

    const floor = floors.find((f) => f.floorId === id);
    if (!floor) return;

    const { nextSuggested, limit } = getFloorCodeInfo(floor);

    if (!nextSuggested) {
      toast.error(
        `Este piso ya tiene el máximo de habitaciones (hasta ${limit}).`
      );
      setCode("");
      return;
    }

    // sugerimos el siguiente código
    setCode(String(nextSuggested));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!floorId) {
      toast.error("Selecciona un piso");
      return;
    }

    if (!floors) {
      toast.error("No se pudieron cargar los datos de los pisos");
      return;
    }

    const floor = floors.find((f) => f.floorId === floorId);
    if (!floor) {
      toast.error("No se encontró el piso seleccionado");
      return;
    }

    if (!code.trim()) {
      toast.error("El código de la habitación es obligatorio");
      return;
    }

    const codeNumber = Number(code);
    if (!Number.isFinite(codeNumber)) {
      toast.error("El código debe ser numérico (ej: 201, 302)");
      return;
    }

    // Validar renta
    const rentNumber = Number(monthlyRent || 0);
    if (Number.isNaN(rentNumber) || rentNumber < 0) {
      toast.error("Ingresa un monto de renta válido");
      return;
    }

    // Reglas del negocio: mayor al máximo y hasta ..08
    const { maxExisting, limit } = getFloorCodeInfo(floor);

    if (codeNumber <= maxExisting) {
      toast.error(
        `El código debe ser mayor que ${maxExisting}. Te sugerimos usar ${maxExisting + 1}.`
      );
      return;
    }

    if (codeNumber > limit) {
      toast.error(
        `El código máximo permitido para este piso es ${limit} (máximo 8 habitaciones).`
      );
      return;
    }

    // Si todo está OK, enviamos
    crearHabitacion({
      floorId,
      code: String(codeNumber),
      rentPrice: rentNumber,
    });
  };

  const isDisabled = isPending || isLoadingFloors;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva habitación
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva habitación</DialogTitle>
          <DialogDescription>
            Crea una habitación manual para esta propiedad. El código debe ser
            mayor al último del piso y como máximo hasta ..08.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Piso */}
          <div className="space-y-2">
            <Label>Piso</Label>
            <Select
              value={floorId?.toString() ?? ""}
              onValueChange={handleFloorChange}
              disabled={isLoadingFloors || isErrorFloors}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingFloors
                      ? "Cargando pisos..."
                      : isErrorFloors
                      ? "Error al cargar pisos"
                      : "Selecciona un piso"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {floors?.map((floor) => (
                  <SelectItem
                    key={floor.floorId}
                    value={floor.floorId.toString()}
                  >
                    Piso {floor.floorNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Código de habitación */}
          <div className="space-y-2">
            <Label>Código de habitación</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: 201, 302"
              disabled={isDisabled || !floorId}
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
              disabled={isDisabled}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {isPending ? "Guardando..." : "Crear habitación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
