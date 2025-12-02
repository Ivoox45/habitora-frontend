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

import type { Room } from "../types/rooms.types";
import { useDeleteRoomMutation } from "../hooks/queries/useDeleteRoomMutation";

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
  const { mutate: deleteRoom, isPending } = useDeleteRoomMutation(propertyId, {
    onSuccess: () => {
      toast.success("Habitación eliminada correctamente");
      onOpenChange(false);
    },
    onError: () => toast.error("No se pudo eliminar la habitación"),
  });

  if (!room) return null;

  const handleConfirm = () => deleteRoom({ roomId: room.id });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar habitación {room.code}</DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Eliminando..." : "Eliminar habitación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
