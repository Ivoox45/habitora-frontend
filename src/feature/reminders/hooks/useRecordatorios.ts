import { useQuery } from "@tanstack/react-query";
import { getRecordatorios } from "../api/reminders.ts";
import type { FiltrosRecordatorios, Recordatorio } from "../types";

export const useRecordatorios = (propiedadId: number, filtros?: FiltrosRecordatorios) => {
  return useQuery<Recordatorio[], Error>({
    queryKey: ["recordatorios", propiedadId, filtros],
    queryFn: () => getRecordatorios(propiedadId, filtros),
    enabled: !!propiedadId,
    refetchOnWindowFocus: false,
    staleTime: 30_000,
  });
};
