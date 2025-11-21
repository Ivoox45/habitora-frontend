// src/feature/contracts/components/NewContractDialog.tsx

import { useMemo, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreateContract } from "../hooks/useCreateContract";
import { useAvailableRoomsByProperty } from "../hooks/useAvailableRoomsByProperty";
import { useTenantsByProperty } from "../hooks/useTenantsByProperty";

type NewContractDialogProps = {
  propertyId: number;
};

export function NewContractDialog({ propertyId }: NewContractDialogProps) {
  const [open, setOpen] = useState(false);

  const [tenantId, setTenantId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deposit, setDeposit] = useState<string>("");

  // Inquilinos disponibles (sin contrato ACTIVO)
  const {
    data: tenants,
    isLoading: isLoadingTenants,
    isError: isErrorTenants,
  } = useTenantsByProperty(propertyId, { disponibles: true });

  // Habitaciones disponibles (estado = DISPONIBLE)
  const {
    data: roomsByFloor,
    isLoading: isLoadingRooms,
    isError: isErrorRooms,
  } = useAvailableRoomsByProperty(propertyId);

  // Aplanar habitaciones para usarlas en el Select
  const roomOptions = useMemo(
    () =>
      roomsByFloor?.flatMap((floor) =>
        floor.habitaciones.map((room) => ({
          id: room.id,
          label: `Hab. ${room.codigo} — Piso ${floor.numeroPiso}`,
        }))
      ) ?? [],
    [roomsByFloor]
  );

  const { mutate: createContract, isPending } = useCreateContract(propertyId, {
    onSuccess: () => {
      toast.success("Contrato creado correctamente");
      setTenantId("");
      setRoomId("");
      setStartDate("");
      setEndDate("");
      setDeposit("");
      setOpen(false);
    },
    onError: () => {
      toast.error("No se pudo crear el contrato");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inquilinoId = Number(tenantId);
    const habitacionId = Number(roomId);
    const montoDeposito = Number(deposit || 0);

    if (!inquilinoId || !habitacionId) {
      toast.error("Inquilino y habitación son obligatorios");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Las fechas de inicio y fin son obligatorias");
      return;
    }

    if (Number.isNaN(montoDeposito) || montoDeposito < 0) {
      toast.error("Ingresa un monto de depósito válido");
      return;
    }

    createContract({
      inquilinoId,
      habitacionId,
      fechaInicio: startDate,
      fechaFin: endDate,
      montoDeposito,
    });
  };

  const isDisabled =
    isPending ||
    isLoadingRooms ||
    isLoadingTenants ||
    isErrorRooms ||
    isErrorTenants;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Crear contrato
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo contrato</DialogTitle>
          <DialogDescription>
            Crea un contrato asociando un inquilino a una habitación, con fechas
            y depósito inicial.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inquilino */}
          <div className="space-y-2">
            <Label>Inquilino</Label>
            <Select
              value={tenantId}
              onValueChange={setTenantId}
              disabled={isLoadingTenants || isErrorTenants}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingTenants
                      ? "Cargando inquilinos..."
                      : isErrorTenants
                      ? "Error al cargar inquilinos"
                      : "Selecciona un inquilino"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {tenants && tenants.length > 0 ? (
                  tenants.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nombreCompleto} — {t.numeroDni}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No hay inquilinos disponibles sin contrato activo.
                  </div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Solo se muestran inquilinos sin contrato activo.
            </p>
          </div>

          {/* Habitación */}
          <div className="space-y-2">
            <Label>Habitación</Label>
            <Select
              value={roomId}
              onValueChange={setRoomId}
              disabled={isLoadingRooms || isErrorRooms}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingRooms
                      ? "Cargando habitaciones..."
                      : isErrorRooms
                      ? "Error al cargar habitaciones"
                      : "Selecciona una habitación disponible"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {roomOptions.length > 0 ? (
                  roomOptions.map((room) => (
                    <SelectItem key={room.id} value={String(room.id)}>
                      {room.label}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No hay habitaciones disponibles para contrato.
                  </div>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Solo se muestran habitaciones con estado{" "}
              <strong>DISPONIBLE</strong>.
            </p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isDisabled}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isDisabled}
              />
            </div>
          </div>

          {/* Depósito */}
          <div className="space-y-2">
            <Label htmlFor="deposit">Monto de depósito (S/)</Label>
            <Input
              id="deposit"
              type="number"
              min={0}
              step="0.01"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
              placeholder="Ej: 500.00"
              disabled={isDisabled}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isDisabled}>
              {isPending ? "Guardando..." : "Crear contrato"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
