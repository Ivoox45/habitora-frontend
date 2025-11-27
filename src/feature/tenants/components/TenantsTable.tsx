// src/feature/tenants/components/TenantsTable.tsx
import { useState, useEffect } from "react";
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "../types";
import { EmptyState } from "@/components/EmptyState";
import { Users } from "lucide-react";

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
import { Button } from "@/components/ui/button";

import {
  UserRound,
  IdCard,
  Mail,
  Phone,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { EditTenantsDialog } from "./EditTenantsDialog";
import { DeleteTenantsDialog } from "./DeleteTenantsDialog";

type TenantsTableProps = {
  propiedadId: number;
};

const PAGE_SIZE = 10;

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function TenantsTable({ propiedadId }: TenantsTableProps) {
  const { data, isLoading, isError } = useTenants(propiedadId);
  const tenants = (data ?? []) as Tenant[];

  const [page, setPage] = useState(1);

  // Si cambia la cantidad de inquilinos, volvemos a la primera página
  useEffect(() => {
    setPage(1);
  }, [tenants.length]);

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

  if (tenants.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay inquilinos registrados"
        description="Agrega inquilinos a tu propiedad para poder crear contratos de alquiler y gestionar pagos."
        compact
      />
    );
  }

  const totalTenants = tenants.length;
  const totalPages = Math.max(1, Math.ceil(totalTenants / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalTenants);
  const pageTenants = tenants.slice(startIndex, endIndex);

  return (
    <div className="mt-6 rounded-xl border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[260px]">
              <span className="inline-flex items-center gap-1">
                <UserRound className="h-4 w-4 text-muted-foreground" />
                <span>Inquilino</span>
              </span>
            </TableHead>

            <TableHead>
              <span className="inline-flex items-center gap-1">
                <IdCard className="h-4 w-4 text-muted-foreground" />
                <span>DNI</span>
              </span>
            </TableHead>

            <TableHead>
              <span className="inline-flex items-center gap-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>Correo</span>
              </span>
            </TableHead>

            <TableHead>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>WhatsApp</span>
              </span>
            </TableHead>

            <TableHead className="text-center">
              <span className="inline-flex items-center gap-1 justify-center">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Contratos</span>
              </span>
            </TableHead>

            <TableHead className="w-[110px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageTenants.map((tenant) => (
            <TableRow key={tenant.id}>
              {/* Inquilino */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(tenant.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {tenant.nombreCompleto}
                    </span>
                  </div>
                </div>
              </TableCell>

              {/* DNI */}
              <TableCell className="text-sm align-middle">
                <span className="inline-flex items-center gap-1">
                  <IdCard className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{tenant.numeroDni}</span>
                </span>
              </TableCell>

              {/* Correo */}
              <TableCell className="text-sm align-middle">
                <span className="inline-flex items-center gap-1 max-w-[260px] truncate">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{tenant.email}</span>
                </span>
              </TableCell>

              {/* WhatsApp */}
              <TableCell className="text-sm align-middle">
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{tenant.telefonoWhatsapp || "—"}</span>
                </span>
              </TableCell>

              {/* Contratos */}
              <TableCell className="text-center text-sm align-middle">
                <span className="inline-flex items-center justify-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{tenant.cantidadContratos}</span>
                </span>
              </TableCell>

              {/* Acciones */}
              <TableCell className="text-right align-middle">
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

      {/* Paginación */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-t bg-muted/40 text-xs text-muted-foreground">
        <span>
          Mostrando{" "}
          <span className="font-medium text-foreground">
            {startIndex + 1} – {endIndex}
          </span>{" "}
          de <span className="font-medium text-foreground">{totalTenants}</span>{" "}
          inquilinos
        </span>

        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <span className="mx-1">
            Página{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            de <span className="font-medium text-foreground">{totalPages}</span>
          </span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
