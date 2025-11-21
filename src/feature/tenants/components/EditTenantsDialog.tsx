// src/feature/tenants/components/EditTenantsDialog.tsx
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import type { Tenant } from "../types";

type EditTenantsDialogProps = {
  propiedadId: number;
  tenant: Tenant;
};

export function EditTenantsDialog({
  propiedadId,
  tenant,
}: EditTenantsDialogProps) {
  const [open, setOpen] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState(tenant.nombreCompleto);
  const [numeroDni, setNumeroDni] = useState(tenant.numeroDni);
  const [email, setEmail] = useState(tenant.email);
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(
    tenant.telefonoWhatsapp
  );

  // Cuando abra el modal, sincronizamos valores por si el tenant cambió
  useEffect(() => {
    if (!open) return;
    setNombreCompleto(tenant.nombreCompleto);
    setNumeroDni(tenant.numeroDni);
    setEmail(tenant.email);
    setTelefonoWhatsapp(tenant.telefonoWhatsapp);
  }, [tenant, open]);

  const { mutate: updateTenant, isPending } = useUpdateTenant(
    propiedadId,
    tenant.id,
    {
      onSuccess: () => {
        toast.success("Inquilino actualizado correctamente");
        setOpen(false);
      },
      onError: () => {
        toast.error("No se pudo actualizar el inquilino");
      },
    }
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateTenant({
      nombreCompleto,
      numeroDni,
      email,
      telefonoWhatsapp,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar inquilino</DialogTitle>
          <DialogDescription>
            Actualiza la información del inquilino.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre completo</Label>
            <Input
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Número de DNI</Label>
            <Input
              value={numeroDni}
              onChange={(e) => setNumeroDni(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Teléfono / WhatsApp</Label>
            <Input
              value={telefonoWhatsapp}
              onChange={(e) => setTelefonoWhatsapp(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
