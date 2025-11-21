// src/feature/contracts/pages/ContractsPage.tsx

import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useContractsByProperty } from "../hooks/useContractsByProperty";
import { useFinalizeContract } from "../hooks/useFinalizeContract";

import type { ContratoEstado } from "../types";
import { ContractsTable } from "../components/ContractsTable";
import { NewContractDialog } from "../components/NewContractDialog";
import { SignContractDialog } from "../components/SignContractDialog";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// helper para parsear el id de propiedad
const parsePropertyId = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

export function ContractsPage() {
  const params = useParams();

  // soporta /app/:propertyId/contratos y /app/:propiedadId/contratos
  const routeId =
    (params.propertyId as string | undefined) ??
    (params.propiedadId as string | undefined);

  const routePropertyId = useMemo(() => parsePropertyId(routeId), [routeId]);
  const { currentPropertyId } = useCurrentPropertyStore();

  const propertyId = routePropertyId ?? currentPropertyId ?? null;

  // filtros
  const [statusFilter, setStatusFilter] = useState<
    ContratoEstado | undefined
  >();
  const [search, setSearch] = useState("");

  // estado para el dialog de firma
  const [signContractId, setSignContractId] = useState<number | null>(null);

  if (!propertyId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No se encontró una propiedad válida. Selecciona una propiedad desde el
          inicio.
        </p>
      </div>
    );
  }

  const {
    data: contracts,
    isLoading,
    isError,
  } = useContractsByProperty(propertyId, {
    estado: statusFilter,
    search: search || undefined,
  });

  const {
    mutate: finalizeContract,
    isPending: isFinalizing,
    variables: finalizeVars,
  } = useFinalizeContract(propertyId, {
    onSuccess: () => {
      toast.success("Contrato finalizado correctamente");
    },
    onError: () => {
      toast.error("No se pudo finalizar el contrato");
    },
  });

  const finalizingId = isFinalizing ? finalizeVars?.contractId ?? null : null;

  const handleViewDetails = (contractId: number) => {
    // luego puedes abrir un dialog de detalle con useContractById
    console.log("Ver contrato", contractId);
  };

  const handleSignContract = (contractId: number) => {
    // abrimos el dialog de firma para este contrato
    setSignContractId(contractId);
  };

  const handleFinalizeContract = (contractId: number) => {
    finalizeContract({ contractId });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-muted-foreground">Cargando contratos…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Contratos</h1>
        <p className="text-sm text-red-500">
          Ocurrió un error al cargar los contratos.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los contratos activos y cancelados de esta propiedad.
          </p>
        </div>

        {/* Botón para crear contrato */}
        <NewContractDialog propertyId={propertyId} />
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3 flex-wrap">
          <Select
            value={statusFilter ?? "ALL"}
            onValueChange={(value) => {
              if (value === "ALL") {
                setStatusFilter(undefined);
              } else {
                setStatusFilter(value as ContratoEstado);
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="ACTIVO">Activos</SelectItem>
              <SelectItem value="CANCELADO">Cancelados</SelectItem>
            </SelectContent>
          </Select>

          <Input
            className="w-[240px]"
            placeholder="Buscar por inquilino o habitación"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <ContractsTable
        contracts={contracts ?? []}
        onViewDetails={handleViewDetails}
        onSign={handleSignContract}
        onFinalize={handleFinalizeContract}
        finalizingId={finalizingId}
      />

      {/* Dialog de firma */}
      <SignContractDialog
        propertyId={propertyId}
        contractId={signContractId}
        open={signContractId !== null}
        onOpenChange={(open) => {
          if (!open) setSignContractId(null);
        }}
      />
    </div>
  );
}

export default ContractsPage;
