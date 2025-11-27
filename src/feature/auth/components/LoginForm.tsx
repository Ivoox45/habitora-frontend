// src/feature/auth/components/LoginForm.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import accessAccountImg from "@/components/assets/access-account_aydp.svg";

import { useLogin } from "../hooks/useLogin";
import type { LoginRequest } from "../types";
import { checkTienePropiedades, getUsuarioById } from "../api/auth";
import { useAuthStore } from "@/store/useAuthStore";

interface LoginFormProps {
  onToggle: () => void;
}

export default function LoginForm({ onToggle }: LoginFormProps) {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useLogin({
    onSuccess: async (data) => {
      toast.success("Inicio de sesión correcto. ¡Bienvenido de nuevo! 🙌");

      try {
        // Asegurarse de que el token esté guardado primero
        if (data && typeof data === "object" && "accessToken" in data) {
          useAuthStore.getState().setToken(data.accessToken);
        }

        // Obtener info del usuario y propiedades
        const { usuarioId, tienePropiedades } = await checkTienePropiedades();
        
        // Validar que usuarioId es un número válido
        if (!usuarioId || typeof usuarioId !== "number") {
          throw new Error("ID de usuario inválido");
        }

        const usuario = await getUsuarioById(usuarioId);

        // Guardar usuario completo en el store
        setUser({
          id: usuario.id,
          nombreCompleto: usuario.nombreCompleto,
          email: usuario.email,
          telefonoWhatsapp: usuario.telefonoWhatsapp,
        });

        // Inicializar última actividad
        try {
          localStorage.setItem("habitora-last-activity", String(Date.now()));
        } catch {}

        if (!tienePropiedades) {
          navigate("/onboarding");
        } else {
          navigate("/start");
        }
      } catch (e) {
        console.error("Error comprobando propiedades / usuario:", e);
        toast.error(
          "No se pudo cargar tu información completa. Te llevamos al panel principal."
        );
        navigate("/start");
      }
    },
    onError: (err) => {
      console.error("Error en login:", err);
      toast.error("No se pudo iniciar sesión. Revisa tus datos.");
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
    login(formData);
  };

  const hasError = Boolean(error);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 text-zinc-800 bg-white">
      <aside className="relative hidden lg:flex flex-col bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-950 text-white">
        <div className="flex items-center gap-3 p-6">
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
            src={accessAccountImg}
            alt="Acceso a cuenta Habitora"
            className="w-full max-w-md drop-shadow-lg"
          />
          <div className="text-center text-zinc-300 italic text-sm">
            “Gestión inteligente de propiedades y alquileres con una interfaz
            moderna.”
          </div>
        </div>

        <div className="px-8 pb-8">
          <p className="max-w-xl text-sm/6 text-zinc-300">
            “Nuestra plataforma optimiza tu tiempo y mejora la experiencia de
            gestión inmobiliaria.” —{" "}
            <span className="font-medium text-white">Equipo Habitora</span>
          </p>
        </div>
      </aside>

      <main className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Inicia sesión
            </h1>
            <p className="text-sm text-zinc-600">
              Ingresa tu correo y contraseña para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                Ocurrió un error al iniciar sesión. Revisa tus datos.
              </p>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-black hover:bg-zinc-900 text-white font-medium"
            >
              {isPending ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-zinc-600">
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="text-black hover:underline font-medium"
            >
              Regístrate
            </button>
          </p>

          <p className="mt-6 text-xs text-zinc-500 text-center">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="underline underline-offset-4 text-black">
              Términos de Servicio
            </a>{" "}
            y{" "}
            <a href="#" className="underline underline-offset-4 text-black">
              Política de Privacidad
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
