// src/feature/tenants/components/EditTenantsDialog.tsx
import { useState, useEffect, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { lookupTenantNameByDni } from "../api/tenants";
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
import { useUpdateTenant } from "../hooks/useUpdateTenant";
import type { Tenant } from "../types";

type EditTenantsDialogProps = {
  propiedadId: number;
  tenant: Tenant;
};

// Helpers de validación (los mismos criterios que en NewTenantsDialog)
const isValidEmail = (value: string) => {
  const email = value.trim();
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidDni = (value: string) => {
  return /^\d{8}$/.test(value.trim());
};

const isValidPhone = (value: string) => {
  const phone = value.trim();
  if (!phone) return true; // sigue siendo opcional
  return /^\d{9}$/.test(phone);
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
  const [isVerifying, setIsVerifying] = useState(false);

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

    const nombre = nombreCompleto.trim();
    const dni = numeroDni.trim();
    const correo = email.trim();
    const telefono = (telefonoWhatsapp || "").trim();

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

    updateTenant({
      nombreCompleto: nombre,
      numeroDni: dni,
      email: correo,
      telefonoWhatsapp: telefono,
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
                const value = e.target.value.replace(/\D/g, "").slice(0, 8);
                setNumeroDni(value);
              }}
              required
              inputMode="numeric"
              maxLength={8}
              placeholder="8 dígitos"
              disabled={isPending}
              onKeyDown={async (e) => {
                if (e.key === "Enter" && isValidDni(numeroDni)) {
                  e.preventDefault();
                  setIsVerifying(true);
                  try {
                    const res = await lookupTenantNameByDni(numeroDni);
                    if (res?.nombreCompleto) {
                      setNombreCompleto(res.nombreCompleto);
                      toast.success("Nombre encontrado y completado");
                    } else {
                      toast.error("No se encontró nombre para este DNI");
                    }
                  } catch {
                    toast.error("Error al verificar DNI");
                  } finally {
                    setIsVerifying(false);
                  }
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isValidDni(numeroDni) || isVerifying || isPending}
              onClick={async () => {
                setIsVerifying(true);
                try {
                  const res = await lookupTenantNameByDni(numeroDni);
                  if (res?.nombreCompleto) {
                    setNombreCompleto(res.nombreCompleto);
                    toast.success("Nombre encontrado y completado");
                  } else {
                    toast.error("No se encontró nombre para este DNI");
                  }
                } catch {
                  toast.error("Error al verificar DNI");
                } finally {
                  setIsVerifying(false);
                }
              }}
            >
              {isVerifying ? "Verificando..." : "Verificar nombre"}
            </Button>
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
              value={telefonoWhatsapp ?? ""}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                setTelefonoWhatsapp(value);
              }}
              inputMode="numeric"
              maxLength={9}
              placeholder="9 dígitos (opcional)"
              disabled={isPending}
            />
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
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
