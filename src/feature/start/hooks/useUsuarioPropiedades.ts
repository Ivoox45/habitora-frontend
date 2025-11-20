// src/feature/start/hooks/useUsuarioPropiedades.ts
import { useQuery } from "@tanstack/react-query";
import { getUsuarioPropiedadesSimple } from "../api/start";
import type { UsuarioPropiedadesSimpleResponse } from "../types";
import { checkTienePropiedades } from "@/feature/auth/api/auth";

type UsuarioPropiedadesQueryKey = ["usuario-propiedades-simple"];

export const useUsuarioPropiedades = () =>
  useQuery<
    UsuarioPropiedadesSimpleResponse,
    Error,
    UsuarioPropiedadesSimpleResponse,
    UsuarioPropiedadesQueryKey
  >({
    queryKey: ["usuario-propiedades-simple"],
    queryFn: async () => {
      const { usuarioId } = await checkTienePropiedades();
      return getUsuarioPropiedadesSimple(usuarioId);
    },
    staleTime: 60_000, 
  });
