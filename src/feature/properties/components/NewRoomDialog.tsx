// src/feature/properties/components/NewRoomDialog.tsx

import { useState, type FormEvent, useMemo } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useRoomsByPropertyQuery } from "../hooks/queries/useRoomsByPropertyQuery";
import { useCreateRoomMutation } from "../hooks/queries/useCreateRoomMutation";
import type { RoomsByFloor } from "../types/rooms.types";

function getAvailableCodes(floor: RoomsByFloor): number[] {
  const base = floor.floorNumber * 100;
  const used = floor.rooms.map((r) => Number(r.code));

  const free = [];
  for (let i = 1; i <= 8; i++) {
    const code = base + i;
    if (!used.includes(code)) free.push(code);
  }
  return free;
}

export function NewRoomDialog({ propertyId }: { propertyId: number }) {
  const [open, setOpen] = useState(false);
  const [floorId, setFloorId] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [rent, setRent] = useState("");

  const { data: floors } = useRoomsByPropertyQuery(propertyId);
  const { mutate: createRoom, isPending } = useCreateRoomMutation(propertyId, {
    onSuccess: () => {
      toast.success("Habitación creada");
      setOpen(false);
      setFloorId(null);
      setCode("");
      setRent("");
    },
    onError: () => toast.error("Error al crear habitación"),
  });

  const codes = useMemo(() => {
    if (!floors || !floorId) return [];
    const floor = floors.find((f) => f.floorId === floorId);
    if (!floor) return [];
    return getAvailableCodes(floor);
  }, [floors, floorId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!floorId || !code) return toast.error("Completa todos los campos.");

    createRoom({
      floorId,
      code,
      rentPrice: Number(rent || 0),
    });
  };

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
            Cada piso puede tener hasta 8 habitaciones.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Piso</Label>
            <Select value={floorId?.toString() ?? ""} onValueChange={(v) => setFloorId(Number(v))}>
              <SelectTrigger><SelectValue placeholder="Selecciona piso" /></SelectTrigger>
              <SelectContent>
                {floors?.map((f) => (
                  <SelectItem key={f.floorId} value={String(f.floorId)}>
                    Piso {f.floorNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Código</Label>
            <Select value={code} onValueChange={setCode} disabled={!floorId}>
              <SelectTrigger><SelectValue placeholder="Selecciona código" /></SelectTrigger>
              <SelectContent>
                {codes.map((c) => (
                  <SelectItem key={c} value={String(c)}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Renta mensual</Label>
            <Input value={rent} type="number" onChange={(e) => setRent(e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Crear habitación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
