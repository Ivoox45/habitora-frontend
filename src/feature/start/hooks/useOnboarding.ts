// src/feature/start/hooks/useOnboarding.ts
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import {
  crearPropiedad,
  getPisosByPropiedad,
  crearHabitacionesAutomatico,
} from "../api/start";
import type { OnboardingPayload } from "../types";

type OnboardingResult = void;
type OnboardingError = Error;

export const useOnboarding = (
  options?: UseMutationOptions<
    OnboardingResult,
    OnboardingError,
    OnboardingPayload
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<OnboardingResult, OnboardingError, OnboardingPayload>({
    mutationFn: async ({ propiedad, habitacionesPorPiso }) => {
      // 1. Crear propiedad
      const nuevaPropiedad = await crearPropiedad(propiedad);

      // 2. Obtener pisos creados automáticamente
      const pisos = await getPisosByPropiedad(nuevaPropiedad.id);
      if (!pisos.length) return;

      // 3. Crear habitaciones para cada piso según el array habitacionesPorPiso
      await Promise.all(
        pisos.map(({ id, numeroPiso }) => {
          const index = numeroPiso - 1;
          const cantidad = habitacionesPorPiso[index] ?? 0;

          if (cantidad <= 0) return null;

          return crearHabitacionesAutomatico({
            pisoId: id,
            cantidadHabitaciones: cantidad,
          });
        })
      );
    },
    // primero extendemos opciones base (pero sin su onSuccess para no pisarnos)
    ...(options ?? {}),
    // y luego definimos nuestro onSuccess
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["usuario-propiedades-simple"],
        exact: true,
      });

      // 🔹 llamar onSuccess del caller respetando su firma (puede esperar 4 args)
      if (options?.onSuccess) {
        (options.onSuccess as any)(data, variables, undefined, context);
      }
    },
  });
};
