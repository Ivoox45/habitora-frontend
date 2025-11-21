// src/feature/tenants/components/TenantsTable.tsx
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "../types";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { EditTenantsDialog } from "./EditTenantsDialog";
import { DeleteTenantsDialog } from "./DeleteTenantsDialog";

type TenantsTableProps = {
  propiedadId: number;
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function TenantsTable({ propiedadId }: TenantsTableProps) {
  const { data, isLoading, isError } = useTenants(propiedadId);

  if (isLoading) {
    return (
      <div className="mt-6 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="mt-4 text-sm text-destructive">
        Ocurrió un error al cargar los inquilinos. Intenta nuevamente.
      </p>
    );
  }

  const tenants = (data ?? []) as Tenant[];

  if (tenants.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        No hay inquilinos registrados en esta propiedad. Usa el botón
        &quot;Nuevo inquilino&quot; para agregar el primero.
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[220px]">Inquilino</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead className="text-center">Contratos</TableHead>
            <TableHead className="w-[110px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {tenants.map((tenant) => (
            <TableRow key={tenant.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {getInitials(tenant.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {tenant.nombreCompleto}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ID: {tenant.id}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-sm">{tenant.numeroDni}</TableCell>
              <TableCell className="text-sm">{tenant.email}</TableCell>
              <TableCell className="text-sm">
                {tenant.telefonoWhatsapp || "—"}
              </TableCell>
              <TableCell className="text-center text-sm">
                {tenant.cantidadContratos}
              </TableCell>

              <TableCell className="text-right">
                <div className="inline-flex items-center gap-1">
                  <EditTenantsDialog
                    propiedadId={propiedadId}
                    tenant={tenant}
                  />
                  <DeleteTenantsDialog
                    propiedadId={propiedadId}
                    tenantId={tenant.id}
                    tenantName={tenant.nombreCompleto}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
