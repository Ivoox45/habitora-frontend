// src/feature/tenants/components/NewTenantsDialog.tsx
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { useCreateTenant } from "../hooks/useCreateTenant";
import { lookupTenantNameByDni } from "../api/tenants";
import {
  isValidDni,
  isValidEmail,
  isValidPeruvianPhone,
  isValidFullName,
  sanitizeDniInput,
  sanitizePhoneInput,
  sanitizeNameInput,
  VALIDATION_MESSAGES,
  formatPeruvianPhone,
} from "@/lib/validations";
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

export function NewTenantsDialog({ propiedadId }: NewTenantsDialogProps) {
  const [open, setOpen] = useState(false);
  const [numeroDni, setNumeroDni] = useState("");
  const [email, setEmail] = useState("");
  const [telefonoWhatsapp, setTelefonoWhatsapp] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

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

    // Validar nombre si fue proporcionado
    if (nombre && !isValidFullName(nombre)) {
      toast.error(VALIDATION_MESSAGES.fullName.invalid);
      return;
    }

    if (!isValidDni(dni)) {
      toast.error(VALIDATION_MESSAGES.dni.invalid);
      return;
    }

    if (!isValidEmail(correo)) {
      toast.error(VALIDATION_MESSAGES.email.invalid);
      return;
    }

    if (!isValidPeruvianPhone(telefono)) {
      toast.error(VALIDATION_MESSAGES.phone.invalid);
      return;
    }

    createTenant({
      numeroDni: dni,
      email: correo,
      telefonoWhatsapp: telefono,
      // Enviar nombre si el usuario lo completó; caso contrario, el backend lo resuelve por DNI
      nombreCompleto: nombreCompleto.trim() || undefined,
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
          {/* DNI */}
          <div className="space-y-2">
            <Label>Número de DNI</Label>
            <Input
              value={numeroDni}
              onChange={(e) => {
                const value = sanitizeDniInput(e.target.value);
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

          {/* Nombre (opcional - se completa automáticamente por DNI si se omite) */}
          <div className="space-y-2">
            <Label>Nombre completo (opcional)</Label>
            <Input
              value={nombreCompleto}
              onChange={(e) => {
                const value = sanitizeNameInput(e.target.value);
                setNombreCompleto(value);
              }}
              placeholder="Se completará automáticamente por DNI"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              Solo letras, espacios y tildes permitidos
            </p>
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
            <Label>Teléfono / WhatsApp (Perú)</Label>
            <div className="flex gap-2">
              <div className="flex items-center justify-center px-3 border rounded-md bg-muted text-muted-foreground text-sm font-medium">
                +51
              </div>
              <Input
                value={telefonoWhatsapp}
                onChange={(e) => {
                  const value = sanitizePhoneInput(e.target.value);
                  setTelefonoWhatsapp(value);
                }}
                inputMode="numeric"
                maxLength={9}
                placeholder="987654321"
                disabled={isPending}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {telefonoWhatsapp.length === 9
                ? `Número completo: ${formatPeruvianPhone(telefonoWhatsapp)}`
                : "9 dígitos sin código de país"}
            </p>
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
