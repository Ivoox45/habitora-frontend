// src/feature/tenants/components/NewTenantDialog.tsx

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { lookupTenantNameByDni } from "../api/tenants.api";
import { useCreateTenantMutation } from "../hooks/queries/useCreateTenantMutation";

import {
  isValidDni,
  isValidEmail,
  isValidFullName,
  isValidPeruvianPhone,
  sanitizeDniInput,
  sanitizeNameInput,
  sanitizePhoneInput,
  formatPeruvianPhone,
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

export function NewTenantDialog({ propiedadId }: { propiedadId: number }) {
  const [open, setOpen] = useState(false);

  const [dni, setDni] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { mutate: createTenant, isPending } = useCreateTenantMutation(
    propiedadId,
    {
      onSuccess: () => {
        toast.success("Inquilino registrado");
        setOpen(false);
        setDni("");
        setNombreCompleto("");
        setEmail("");
        setTelefono("");
      },
      onError: () => toast.error("Error al crear el inquilino"),
    }
  );

  async function verifyDni() {
    if (!isValidDni(dni)) return;

    setIsVerifying(true);
    try {
      const data = await lookupTenantNameByDni(dni);
      if (data?.nombreCompleto) {
        setNombreCompleto(data.nombreCompleto);
        toast.success("Nombre encontrado");
      } else {
        toast.error("No se encontró nombre para este DNI");
      }
    } catch {
      toast.error("Error al consultar DNI");
    } finally {
      setIsVerifying(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

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

    if (nombreCompleto && !isValidFullName(nombreCompleto)) {
      toast.error(VALIDATION_MESSAGES.fullName.invalid);
      return;
    }

    createTenant({
      numeroDni: dni,
      email,
      telefonoWhatsapp: telefono,
      nombreCompleto: nombreCompleto || undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo inquilino
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar inquilino</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo inquilino.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DNI */}
          <div className="space-y-2">
            <Label>DNI</Label>
            <Input
              value={dni}
              maxLength={8}
              inputMode="numeric"
              placeholder="8 dígitos"
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

          {/* Nombre */}
          <div className="space-y-2">
            <Label>Nombre completo (opcional)</Label>
            <Input
              value={nombreCompleto}
              onChange={(e) =>
                setNombreCompleto(sanitizeNameInput(e.target.value))
              }
              placeholder="Se completará automáticamente por DNI"
              disabled={isPending}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Correo electrónico</Label>
            <Input
              value={email}
              placeholder="ejemplo@correo.com"
              disabled={isPending}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label>Teléfono / WhatsApp</Label>
            <div className="flex gap-2">
              <div className="px-3 rounded-md border flex items-center text-sm text-muted-foreground">
                +51
              </div>
              <Input
                value={telefono}
                maxLength={9}
                inputMode="numeric"
                placeholder="987654321"
                disabled={isPending}
                onChange={(e) => setTelefono(sanitizePhoneInput(e.target.value))}
              />
            </div>
            {telefono.length === 9 && (
              <p className="text-xs text-muted-foreground">
                Número completo: {formatPeruvianPhone(telefono)}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
