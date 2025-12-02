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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { Room, RoomsByFloor } from "../types/rooms.types";
import { useRoomsByPropertyQuery } from "../hooks/queries/useRoomsByPropertyQuery";
import { useUpdateRoomMutation } from "../hooks/queries/useUpdateRoomMutation";

const MAX_ROOMS = 8;

function getCodesForEdit(floors: RoomsByFloor[], room: Room): number[] {
  const floor = floors.find((f) => f.floorId === room.floorId);
  if (!floor) return [];

  const base = floor.floorNumber * 100;

  const used = new Set(
    floor.rooms
      .filter((r) => r.id !== room.id)
      .map((r) => Number(r.code))
  );

  const available = [];
  for (let i = 1; i <= MAX_ROOMS; i++) {
    const code = base + i;
    if (!used.has(code)) available.push(code);
  }

  const current = Number(room.code);
  if (!available.includes(current)) available.push(current);

  return available.sort((a, b) => a - b);
}

export function EditRoomDialog({
  propertyId,
  room,
  open,
  onOpenChange,
}: {
  propertyId: number;
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [code, setCode] = useState("");
  const [rent, setRent] = useState("");

  const { data: floors, isLoading } = useRoomsByPropertyQuery(propertyId);
  const { mutate: updateRoom, isPending } = useUpdateRoomMutation(propertyId, {
    onSuccess: () => {
      toast.success("Habitación actualizada");
      onOpenChange(false);
    },
    onError: () => toast.error("No se pudo actualizar"),
  });

  const codes = useMemo(() => {
    if (!room || !floors) return [];
    return getCodesForEdit(floors, room);
  }, [floors, room]);

  useEffect(() => {
    if (!room || !open) return;
    setRent(String(Number(room.rentPrice)));
    setCode(String(Number(room.code)));
  }, [room, open, codes]);

  if (!room) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateRoom({
      roomId: room.id,
      code,
      rentPrice: Number(rent || 0),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar habitación {room.code}</DialogTitle>
          <DialogDescription>Modifica el código o el precio mensual.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Código</Label>
            <Select value={code} onValueChange={setCode} disabled={isPending || isLoading}>
              <SelectTrigger><SelectValue placeholder="Código disponible" /></SelectTrigger>
              <SelectContent>
                {codes.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Renta mensual</Label>
            <Input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
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
