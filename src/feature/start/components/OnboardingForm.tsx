// src/feature/start/components/OnboardingForm.tsx
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import BuildingAnimation from "./BuildingAnimation";

import { useOnboarding } from "../hooks/useOnboarding";

const MIN_PISOS = 1;
const MAX_PISOS = 10;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;

export default function OnboardingForm() {
  const [step, setStep] = useState<1 | 2>(1);

  // Paso 1
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [pisos, setPisos] = useState<number>(1);
  const [pisoResidencia, setPisoResidencia] = useState<number | null>(null);

  // Paso 2
  const [habitacionesPorPiso, setHabitacionesPorPiso] = useState<number[]>([1]);

  const navigate = useNavigate();

  const { mutate: completarOnboarding, isPending } = useOnboarding({
    onSuccess: () => {
      toast.success("Propiedad y habitaciones creadas correctamente ✨");
      navigate("/start");
    },
    onError: (err) => {
      console.error(err);
      toast.error("No se pudo completar el registro de la propiedad.");
    },
  });

  const handlePisosChange = (rawValue: number) => {
    const parsed = Number.isNaN(rawValue) ? MIN_PISOS : rawValue;
    const cantidad = Math.max(MIN_PISOS, Math.min(parsed, MAX_PISOS));

    setPisos(cantidad);

    setHabitacionesPorPiso((prev) =>
      Array.from({ length: cantidad }, (_, i) => prev[i] || MIN_ROOMS)
    );

    setPisoResidencia((prev) => (prev && prev > cantidad ? null : prev));
  };

  const handleHabitacionChange = (index: number, rawValue: number) => {
    const parsed = Number.isNaN(rawValue) ? MIN_ROOMS : rawValue;
    const clamped = Math.max(MIN_ROOMS, Math.min(parsed, MAX_ROOMS));

    setHabitacionesPorPiso((prev) => {
      const next = [...prev];
      next[index] = clamped;
      return next;
    });
  };

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    completarOnboarding({
      propiedad: {
        nombre,
        direccion,
        cantidadPisos: pisos,
        pisoResidenciaDueno: pisoResidencia ?? 0,
      },
      habitacionesPorPiso,
    });
  };

  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNombre(e.target.value);

  const handleDireccionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDireccion(e.target.value);

  const handlePisosInputChange = (e: ChangeEvent<HTMLInputElement>) =>
    handlePisosChange(Number(e.target.value));

  const handleHabitacionesInputChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) =>
      handleHabitacionChange(index, Number(e.target.value));

  const handlePisoResidenciaChange = (value: string) => {
    if (value === "none") {
      setPisoResidencia(null);
      return;
    }
    setPisoResidencia(Number(value));
  };

  return (
    <div
      className="
        min-h-screen w-full
        bg-gradient-to-br from-slate-50 to-slate-100
        flex justify-center
        items-start lg:items-center
        px-4 py-8 sm:px-6 sm:py-10 lg:px-20 lg:py-16
      "
    >
      <div
        className="
          w-full max-w-6xl mx-auto
          grid grid-cols-1 lg:grid-cols-2
          gap-10 lg:gap-16
          items-start lg:items-center
        "
      >
        {/* Columna izquierda: formulario */}
        <div className="flex flex-col justify-start">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Registro de Propiedad
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Completa los datos principales de tu inmueble.
                </p>
              </div>

              <Separator className="hidden sm:block" />

              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <Label>¿Cómo quieres llamar a tu propiedad?</Label>
                  <Input
                    placeholder="Ejemplo: Casa Los Rosales"
                    value={nombre}
                    onChange={handleNombreChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    ¿Cuál es la dirección o referencia del inmueble?
                  </Label>
                  <Input
                    placeholder="Ejemplo: Av. San Martín 123, Ica"
                    value={direccion}
                    onChange={handleDireccionChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>
                    ¿Cuántos pisos tiene la propiedad?{" "}
                    <span className="text-gray-400">
                      ({MIN_PISOS}–{MAX_PISOS})
                    </span>
                  </Label>
                  <Input
                    type="number"
                    min={MIN_PISOS}
                    max={MAX_PISOS}
                    value={pisos}
                    onChange={handlePisosInputChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>¿En qué piso resides tú (el dueño)?</Label>
                  <Select
                    onValueChange={handlePisoResidenciaChange}
                    value={
                      pisoResidencia === null
                        ? "none"
                        : pisoResidencia.toString()
                    }
                  >
                    <SelectTrigger className="w-full focus-visible:ring-black bg-white border border-gray-300 text-gray-900">
                      <SelectValue placeholder="Selecciona un piso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        No resido en esta propiedad
                      </SelectItem>
                      {Array.from({ length: pisos }).map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          Piso {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4 sm:mt-8">
                Siguiente →
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Habitaciones por piso
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  Configura las habitaciones para{" "}
                  <strong className="text-gray-700">{nombre}</strong>.{" "}
                  <span className="text-gray-400">
                    ({MIN_ROOMS}–{MAX_ROOMS} por piso)
                  </span>
                </p>
              </div>

              <Separator className="hidden sm:block" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
                {Array.from({ length: pisos }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Label className="w-24 text-gray-600">Piso {i + 1}</Label>
                    <Input
                      type="number"
                      min={MIN_ROOMS}
                      max={MAX_ROOMS}
                      value={habitacionesPorPiso[i]}
                      onChange={handleHabitacionesInputChange(i)}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 sm:pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  ← Volver
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isPending}
                >
                  {isPending ? "Guardando..." : "Finalizar"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Columna derecha: animación */}
        <div className="flex items-center justify-center border-t lg:border-t-0 lg:border-l border-gray-200 pt-6 lg:pt-0 mt-6 lg:mt-0">
          <div className="px-2 sm:px-4 py-2 sm:py-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-[620px] flex flex-col gap-4">
              <div className="text-center lg:text-right">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Tu propiedad
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  Vista previa de la estructura del edificio.
                </p>
              </div>

              <div className="w-full overflow-x-auto md:overflow-visible pb-4">
                <div className="min-w-[560px] flex justify-center lg:justify-end">
                  <BuildingAnimation
                    pisos={pisos}
                    habitacionesPorPiso={habitacionesPorPiso}
                    highlightFloor={pisoResidencia}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
