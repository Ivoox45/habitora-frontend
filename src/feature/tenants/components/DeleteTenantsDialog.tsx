import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteTenantMutation } from "../hooks/queries/useDeleteTenantMutation";

export function DeleteTenantDialog({
  propiedadId,
  tenantId,
  tenantName,
}: {
  propiedadId: number;
  tenantId: number;
  tenantName: string;
}) {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteTenantMutation(propiedadId, tenantId, {
    onSuccess: () => {
      toast.success("Inquilino eliminado");
      setOpen(false);
    },
    onError: () => toast.error("No se pudo eliminar"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar inquilino</DialogTitle>
          <DialogDescription>
            ¿Eliminar a <b>{tenantName}</b>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>

          <Button
            variant="destructive"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
