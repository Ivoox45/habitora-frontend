// src/feature/tenants/components/NewTenantsDialog.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { useCreateTenant } from "../hooks/useCreateTenant";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

type NewTenantsDialogProps = {
  propiedadId: number;
};

export function NewTenantsDialog({ propiedadId }: NewTenantsDialogProps) {
  const [open, setOpen] = useState(false);
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [numeroDni, setNumeroDni] = useState("");
  const [email, setEmail] = useState("");
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState("");

  const { mutate: createTenant, isPending } = useCreateTenant(propiedadId, {
    onSuccess: () => {
      toast.success("Inquilino creado correctamente");
      setOpen(false);
      setNombreCompleto("");
      setNumeroDni("");
      setEmail("");
      setTelefonoWhatsapp("");
    },
    onError: () => {
      toast.error("No se pudo crear el inquilino");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createTenant({
      nombreCompleto,
      numeroDni,
      email,
      telefonoWhatsapp,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo inquilino
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar nuevo inquilino</DialogTitle>
          <DialogDescription>
            Completa los datos para agregar un inquilino a esta propiedad.
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

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar inquilino"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
