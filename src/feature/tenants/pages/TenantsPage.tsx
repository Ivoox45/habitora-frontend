// src/feature/tenants/pages/TenantsPage.tsx

import { useParams } from "react-router-dom";
import { useMemo } from "react";

import { NewTenantDialog } from "../components/NewTenantsDialog";
import { TenantsTable } from "../components/TenantsTable";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

export function TenantsPage() {
  const params = useParams();

  const parseId = (raw?: string) =>
    raw && Number(raw) > 0 ? Number(raw) : null;

  const routeId =
    params.propertyId ??
    params.propiedadId ??
    null;

  const propertyFromUrl = useMemo(() => parseId(routeId ?? undefined), [routeId]);
  const { currentPropertyId } = useCurrentPropertyStore();

  const propiedadId = propertyFromUrl ?? currentPropertyId ?? null;

  if (!propiedadId) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Inquilinos</h2>
        <p className="text-muted-foreground text-sm">
          Selecciona una propiedad desde el panel principal.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Inquilinos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona los inquilinos asociados a esta propiedad.
          </p>
        </div>

        <NewTenantDialog propiedadId={propiedadId} />
      </header>

      <TenantsTable propiedadId={propiedadId} />
    </div>
  );
}
