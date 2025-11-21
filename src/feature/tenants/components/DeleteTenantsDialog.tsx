// src/feature/tenants/components/DeleteTenantsDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteTenant } from "../hooks/useDeleteTenant";

type DeleteTenantsDialogProps = {
  propiedadId: number;
  tenantId: number;
  tenantName: string;
};

export function DeleteTenantsDialog({
  propiedadId,
  tenantId,
  tenantName,
}: DeleteTenantsDialogProps) {
  const [open, setOpen] = useState(false);

  const { mutate: deleteTenant, isPending } = useDeleteTenant(
    propiedadId,
    tenantId,
    {
      onSuccess: () => {
        toast.success("Inquilino eliminado correctamente");
        setOpen(false);
      },
      onError: () => {
        toast.error("No se pudo eliminar el inquilino");
      },
    }
  );

  const handleConfirm = () => {
    deleteTenant();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar inquilino</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar a{" "}
            <span className="font-semibold">{tenantName}</span>? Esta acción no
            se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
