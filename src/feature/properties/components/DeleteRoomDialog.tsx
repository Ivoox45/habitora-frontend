// src/feature/properties/components/DeleteRoomDialog.tsx

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { Room } from "../types";
import { useDeleteRoom } from "../hooks/useDeleteRoom";

type DeleteRoomDialogProps = {
  propertyId: number;
  room: Room | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteRoomDialog({
  propertyId,
  room,
  open,
  onOpenChange,
}: DeleteRoomDialogProps) {
  const { mutate: eliminarHabitacion, isPending } = useDeleteRoom(propertyId, {
    onSuccess: () => {
      toast.success("Habitación eliminada correctamente");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("No se pudo eliminar la habitación");
    },
  });

  const handleConfirm = () => {
    if (!room) return;
    eliminarHabitacion({ roomId: room.id });
  };

  // Si no hay habitación seleccionada, no mostramos nada
  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Eliminar habitación {room.code}
          </DialogTitle>
          <DialogDescription>
            ¿Seguro que quieres eliminar esta habitación? Esta acción no se puede
            deshacer y la habitación dejará de estar disponible.
          </DialogDescription>
        </DialogHeader>

       

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar habitación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
