// src/feature/auth/components/RegisterForm.tsx

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isValidFullName,
  isValidEmail,
  isValidPeruvianPhone,
  sanitizeNameInput,
  sanitizePhoneInput,
  VALIDATION_MESSAGES,
  formatPeruvianPhone,
} from "@/lib/validations";

import newMessageImg from "@/components/assets/new-message_qvv6.svg";

import { useRegister } from "../hooks/useRegister";
import type { RegisterRequest } from "../types";

interface RegisterFormProps {
  onToggle: () => void;
}

export default function RegisterForm({ onToggle }: RegisterFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterRequest>({
    nombreCompleto: "",
    email: "",
    telefonoWhatsapp: "",
    password: "",
  });

  const {
    mutate: register,
    isPending,
    error,
  } = useRegister({
    onSuccess: () => {
      toast.success("Cuenta creada correctamente. ¡Bienvenido a Habitora! 🎉");
      
      // Inicializar última actividad
      try {
        localStorage.setItem("habitora-last-activity", String(Date.now()));
        // Marcar que es un nuevo registro para evitar redirección automática
        sessionStorage.setItem("habitora-new-user", "true");
      } catch {}
      
      // 👇 Primero pantalla de bienvenida (animación tipo PS4)
      navigate("/welcome");
    },
    onError: (err) => {
      console.error("Error en registro:", err);
      toast.error("No se pudo completar el registro. Inténtalo de nuevo.");
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;

    // Validaciones
    const nombre = formData.nombreCompleto.trim();
    const email = formData.email.trim();
    const telefono = formData.telefonoWhatsapp.trim();

    if (!nombre) {
      toast.error(VALIDATION_MESSAGES.fullName.required);
      return;
    }

    if (!isValidFullName(nombre)) {
      toast.error(VALIDATION_MESSAGES.fullName.invalid);
      return;
    }

    if (!isValidEmail(email)) {
      toast.error(VALIDATION_MESSAGES.email.invalid);
      return;
    }

    // Teléfono es opcional, pero si lo ingresa debe ser válido
    if (telefono && !isValidPeruvianPhone(telefono)) {
      toast.error(VALIDATION_MESSAGES.phone.invalid);
      return;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    register(formData);
  };

  const hasError = Boolean(error);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 text-zinc-800 bg-white">
      {/* Panel izquierdo (formulario) */}
      <main className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Crea tu cuenta
            </h1>
            <p className="text-sm text-zinc-600">
              Completa los siguientes datos para registrarte en Habitora
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombreCompleto" className="text-zinc-700">
                Nombre completo
              </Label>
              <Input
                id="nombreCompleto"
                type="text"
                placeholder="Ej. Juan Pérez"
                value={formData.nombreCompleto}
                onChange={(e) => {
                  const value = sanitizeNameInput(e.target.value);
                  setFormData((prev) => ({ ...prev, nombreCompleto: value }));
                }}
                required
                className="focus-visible:ring-black bg-zinc-100 border-zinc-300 text-zinc-900"
              />
              <p className="text-xs text-zinc-500">
                Solo letras, espacios y tildes permitidos
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="focus-visible:ring-black bg-zinc-100 border-zinc-300 text-zinc-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefonoWhatsapp" className="text-zinc-700">
                Número de WhatsApp (Perú)
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center px-3 border rounded-md bg-zinc-200 text-zinc-700 text-sm font-medium">
                  +51
                </div>
                <Input
                  id="telefonoWhatsapp"
                  type="tel"
                  placeholder="987654321"
                  value={formData.telefonoWhatsapp}
                  onChange={(e) => {
                    const value = sanitizePhoneInput(e.target.value);
                    setFormData((prev) => ({ ...prev, telefonoWhatsapp: value }));
                  }}
                  maxLength={9}
                  className="focus-visible:ring-black bg-zinc-100 border-zinc-300 text-zinc-900 flex-1"
                />
              </div>
              <p className="text-xs text-zinc-500">
                {formData.telefonoWhatsapp.length === 9
                  ? `Número completo: ${formatPeruvianPhone(formData.telefonoWhatsapp)}`
                  : "9 dígitos sin código de país (opcional)"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="focus-visible:ring-black bg-zinc-100 border-zinc-300 text-zinc-900"
              />
            </div>

            {hasError && (
              <p className="text-sm text-red-600">
                Ocurrió un error al registrar. Inténtalo de nuevo.
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-black hover:bg-zinc-900 text-white font-medium"
            >
              {isPending ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-zinc-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="text-black hover:underline font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </main>

      {/* Panel derecho (ilustración + texto) */}
      <aside className="relative hidden lg:flex flex-col bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white">
        <div className="flex items-center gap-3 p-6 justify-end">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <div className="h-8 w-8 rounded-md bg-white border border-gray-900 flex items-center justify-center">
              <span className="text-gray-900 text-lg font-bold">H</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">
              Habitora
            </span>
          </div>

        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <img
            src={newMessageImg}
            alt="Crear cuenta en Habitora"
            className="w-full max-w-md drop-shadow-lg"
          />

          <div className="text-center text-zinc-300 italic text-sm">
            “Crea tu cuenta y empieza a gestionar tus propiedades y alquileres
            con tecnología moderna.”
          </div>
        </div>

        <div className="px-8 pb-8 flex justify-end">
          <p className="text-sm/6 text-zinc-300 max-w-md text-right">
            “Un ecosistema digital diseñado para simplificar tu administración
            inmobiliaria.” —{" "}
            <span className="font-medium text-white">Equipo Habitora</span>
          </p>
        </div>
      </aside>
    </div>
  );
}
