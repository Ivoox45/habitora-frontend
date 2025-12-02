// src/feature/tenants/components/EditTenantDialog.tsx

import { useState, useEffect, type FormEvent } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { lookupTenantNameByDni } from "../api/tenants.api";
import { useUpdateTenantMutation } from "../hooks/queries/useUpdateTenantMutation";

import {
  isValidDni,
  isValidEmail,
  isValidFullName,
  isValidPeruvianPhone,
  sanitizeDniInput,
  sanitizeNameInput,
  sanitizePhoneInput,
  VALIDATION_MESSAGES,
} from "@/lib/validations";

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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tenant } from "../types";

export function EditTenantDialog({
  propiedadId,
  tenant,
}: {
  propiedadId: number;
  tenant: Tenant;
}) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(tenant.nombreCompleto);
  const [dni, setDni] = useState(tenant.numeroDni);
  const [email, setEmail] = useState(tenant.email);
  const [telefono, setTelefono] = useState(tenant.telefonoWhatsapp);
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutate: updateTenant, isPending } = useUpdateTenantMutation(
    propiedadId,
    tenant.id,
    {
      onSuccess: () => {
        toast.success("Inquilino actualizado");
        setOpen(false);
      },
      onError: () => toast.error("Error al actualizar"),
    }
  );

  useEffect(() => {
    if (!open) return;
    setNombre(tenant.nombreCompleto);
    setDni(tenant.numeroDni);
    setEmail(tenant.email);
    setTelefono(tenant.telefonoWhatsapp);
  }, [open, tenant]);

  async function verifyDni() {
    if (!isValidDni(dni)) return;

    setIsVerifying(true);
    try {
      const res = await lookupTenantNameByDni(dni);
      if (res?.nombreCompleto) {
        setNombre(res.nombreCompleto);
        toast.success("Nombre encontrado");
      } else {
        toast.error("No se encontró nombre");
      }
    } finally {
      setIsVerifying(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!isValidFullName(nombre)) {
      toast.error(VALIDATION_MESSAGES.fullName.invalid);
      return;
    }

    if (!isValidDni(dni)) {
      toast.error(VALIDATION_MESSAGES.dni.invalid);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(VALIDATION_MESSAGES.email.invalid);
      return;
    }

    if (!isValidPeruvianPhone(telefono)) {
      toast.error(VALIDATION_MESSAGES.phone.invalid);
      return;
    }

    updateTenant({
      nombreCompleto: nombre,
      numeroDni: dni,
      email,
      telefonoWhatsapp: telefono,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar inquilino</DialogTitle>
          <DialogDescription>
            Modifica la información del inquilino.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre completo</Label>
            <Input
              value={nombre}
              disabled={isPending}
              onChange={(e) => setNombre(sanitizeNameInput(e.target.value))}
            />
          </div>

          {/* DNI */}
          <div className="space-y-2">
            <Label>DNI</Label>
            <Input
              value={dni}
              maxLength={8}
              inputMode="numeric"
              disabled={isPending}
              onChange={(e) => setDni(sanitizeDniInput(e.target.value))}
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={!isValidDni(dni) || isVerifying}
              onClick={verifyDni}
            >
              {isVerifying ? "Verificando..." : "Verificar nombre"}
            </Button>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Correo</Label>
            <Input
              value={email}
              disabled={isPending}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Telefono */}
          <div className="space-y-2">
            <Label>WhatsApp</Label>
            <div className="flex gap-2">
              <div className="px-3 rounded-md border flex items-center text-sm text-muted-foreground">
                +51
              </div>
              <Input
                value={telefono}
                maxLength={9}
                inputMode="numeric"
                disabled={isPending}
                onChange={(e) => setTelefono(sanitizePhoneInput(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
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
