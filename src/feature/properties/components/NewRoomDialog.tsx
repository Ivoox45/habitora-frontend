// src/feature/properties/components/NewRoomDialog.tsx

import { useState, type FormEvent, useMemo } from "react";
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
 * Calcula info útil para validación de códigos de un piso:
 * - base: floorNumber * 100 (ej: 2 -> 200)
 * - limit: último código permitido (..08)
 * - usedCodes: códigos numéricos ya ocupados
 */
function getFloorCodeInfo(floor: RoomsByFloor) {
  const base = floor.floorNumber * 100;
  const limit = base + 8;

  const usedCodes = floor.rooms
    .map((room) => Number(room.code))
    .filter((n) => Number.isFinite(n) && n >= base + 1 && n <= limit);

  return {
    base,
    limit,
    usedCodes,
  };
}

/**
 * Devuelve los códigos disponibles para un piso: del .01 al .08
 * excluyendo los ya ocupados.
 */
function getAvailableCodesForFloor(floor: RoomsByFloor): number[] {
  const { base, limit, usedCodes } = getFloorCodeInfo(floor);
  const available: number[] = [];

  for (let code = base + 1; code <= limit; code++) {
    if (!usedCodes.includes(code)) {
      available.push(code);
    }
  }

  return available;
}

export function NewRoomDialog({ propertyId }: NewRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [floorId, setFloorId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  // Pisos de la propiedad
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

  // Códigos disponibles según piso seleccionado
  const availableCodes = useMemo(() => {
    if (!floors || !floorId) return [];
    const floor = floors.find((f) => f.floorId === floorId);
    if (!floor) return [];
    return getAvailableCodesForFloor(floor);
  }, [floors, floorId]);

  // Texto de ayuda con los códigos libres
  const helperAvailableCodes = useMemo(() => {
    if (!floors || !floorId) return "";
    const floor = floors.find((f) => f.floorId === floorId);
    if (!floor) return "";

    const available = getAvailableCodesForFloor(floor);
    if (!available.length) {
      const { limit } = getFloorCodeInfo(floor);
      return `Este piso ya tiene el máximo de habitaciones (hasta ${limit}).`;
    }

    return `Códigos libres para este piso: ${available.join(", ")}.`;
  }, [floors, floorId]);

  const handleFloorChange = (value: string) => {
    const id = Number(value);
    setFloorId(id);

    // Resetear código si cambiamos de piso
    setCode("");

    if (!floors) return;
    const floor = floors.find((f) => f.floorId === id);
    if (!floor) return;

    const available = getAvailableCodesForFloor(floor);
    if (!available.length) {
      const { limit } = getFloorCodeInfo(floor);
      toast.error(
        `Este piso ya tiene el máximo de habitaciones (hasta ${limit}).`
      );
      return;
    }

    // Sugerir el primer código libre
    setCode(String(available[0]));
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
      toast.error("Selecciona un código de habitación");
      return;
    }

    const codeNumber = Number(code);
    if (!Number.isFinite(codeNumber)) {
      toast.error("El código debe ser numérico (ej: 201, 302)");
      return;
    }

    const available = getAvailableCodesForFloor(floor);
    if (!available.includes(codeNumber)) {
      toast.error(
        `El código seleccionado no está disponible. Códigos libres: ${available.join(
          ", "
        )}.`
      );
      return;
    }

    const rentNumber = Number(monthlyRent || 0);
    if (Number.isNaN(rentNumber) || rentNumber < 0) {
      toast.error("Ingresa un monto de renta válido");
      return;
    }

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
            Crea una habitación manual para esta propiedad. Cada piso puede
            tener como máximo 8 habitaciones (.01 a .08) y solo podrás escoger
            códigos disponibles.
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
              <SelectTrigger className="w-full">
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
              <SelectContent className="w-full">
                {floors?.map((floor) => (
                  <SelectItem
                    key={floor.floorId}
                    value={floor.floorId.toString()}
                    className="w-full"
                  >
                    Piso {floor.floorNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Código de habitación (Select de códigos libres) */}
          <div className="space-y-2">
            <Label>Código de habitación</Label>
            <Select
              value={code || ""}
              onValueChange={(value) => setCode(value)}
              disabled={isDisabled || !floorId || !availableCodes.length}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un código disponible" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {availableCodes.map((c) => (
                  <SelectItem
                    key={c}
                    value={String(c)}
                    className="w-full text-center"
                  >
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {floorId ? helperAvailableCodes : "Selecciona primero un piso."}
            </p>
          </div>

          {/* Renta mensual */}
          <div className="space-y-2">
            <Label>Renta mensual (S/)</Label>
            <Input
              className="w-full"
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
