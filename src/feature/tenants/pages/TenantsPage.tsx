// src/feature/tenants/pages/TenantsPage.tsx
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { NewTenantsDialog } from "../components/NewTenantsDialog";
import { TenantsTable } from "../components/TenantsTable";

const parsePropertyId = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

export const TenantsPage = () => {
  const params = useParams();

  // Soportamos /app/:propertyId/inquilinos y /app/:propiedadId/inquilinos
  const routeId =
    (params.propertyId as string | undefined) ??
    (params.propiedadId as string | undefined);

  const routePropertyId = useMemo(() => parsePropertyId(routeId), [routeId]);

  const { currentPropertyId } = useCurrentPropertyStore();

  // 1) prioridad: id de la URL
  // 2) fallback: id guardado en el store
  const propiedadId = routePropertyId ?? currentPropertyId ?? null;

  if (!propiedadId) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Inquilinos</h2>
        <p className="text-sm text-muted-foreground">
          No se encontró una propiedad válida en la URL. Vuelve a seleccionar
          una propiedad desde el inicio.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header + botón */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Inquilinos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los inquilinos asociados a esta propiedad.
          </p>
        </div>

        {/* Botón que abre el dialog para crear inquilino */}
        <NewTenantsDialog propiedadId={propiedadId} />
      </div>

      {/* Tabla (cuando la tengas lista) */}
       <TenantsTable propiedadId={propiedadId} />
    </div>
  );
};
