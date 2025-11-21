// src/feature/tenants/components/NewTenantsDialog.tsx
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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

type NewTenantsDialogProps = {
  propiedadId: number;
};

const isValidEmail = (value: string) => {
  const email = value.trim();
  if (!email) return false;
  // Regex sencillo para validar correo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDni = (value: string) => {
  return /^\d{8}$/.test(value.trim());
};

const isValidPhone = (value: string) => {
  const phone = value.trim();
  if (!phone) return true; // opcional
  return /^\d{9}$/.test(phone);
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

    const nombre = nombreCompleto.trim();
    const dni = numeroDni.trim();
    const correo = email.trim();
    const telefono = telefonoWhatsapp.trim();

    if (!nombre) {
      toast.error("El nombre completo es obligatorio");
      return;
    }

    if (!isValidDni(dni)) {
      toast.error("El DNI debe tener exactamente 8 dígitos numéricos");
      return;
    }

    if (!isValidEmail(correo)) {
      toast.error("Ingresa un correo electrónico válido");
      return;
    }

    if (!isValidPhone(telefono)) {
      toast.error("El teléfono/WhatsApp debe tener exactamente 9 dígitos");
      return;
    }

    createTenant({
      nombreCompleto: nombre,
      numeroDni: dni,
      email: correo,
      telefonoWhatsapp: telefono,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
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
          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre completo</Label>
            <Input
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
              placeholder="Ej: Juan Pérez"
              disabled={isPending}
            />
          </div>

          {/* DNI */}
          <div className="space-y-2">
            <Label>Número de DNI</Label>
            <Input
              value={numeroDni}
              onChange={(e) => {
                // solo números y máximo 8 dígitos
                const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                setNumeroDni(value);
              }}
              required
              inputMode="numeric"
              maxLength={8}
              placeholder="8 dígitos"
              disabled={isPending}
            />
          </div>

          {/* Correo */}
          <div className="space-y-2">
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@correo.com"
              disabled={isPending}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label>Teléfono / WhatsApp</Label>
            <Input
              value={telefonoWhatsapp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                setTelefonoWhatsapp(value);
              }}
              inputMode="numeric"
              maxLength={9}
              placeholder="9 dígitos"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
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
