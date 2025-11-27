// src/feature/properties/pages/PropertiesPage.tsx

import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

import { GridRooms } from "../components/GridRooms";
import { NewRoomDialog } from "../components/NewRoomDialog";
import { EditRoomDialog } from "../components/EditRoomDialog";
import { DeleteRoomDialog } from "../components/DeleteRoomDialog";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useRoomsByProperty } from "../hooks/useRoomsByProperty";
import type { Room } from "../types";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// helper...
const parsePropertyId = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
};

export function PropertiesPage() {
  const params = useParams();

  const routeId =
    (params.propertyId as string | undefined) ??
    (params.propiedadId as string | undefined);

  const routePropertyId = useMemo(() => parsePropertyId(routeId), [routeId]);
  const { currentPropertyId } = useCurrentPropertyStore();

  const propiedadId = routePropertyId ?? currentPropertyId ?? null;

  // ====== si no hay propiedad ======
  if (!propiedadId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Habitaciones</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No valid property was found. Please select a property from the start
          page.
        </p>
      </div>
    );
  }

  // ====== estado para editar / eliminar ======
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setEditOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteOpen(true);
  };

  // ====== queries: con precio / sin precio ======
  const {
    data: floorsWithPrice,
    isLoading: isLoadingWith,
    isError: isErrorWith,
  } = useRoomsByProperty(propiedadId, { requierePrecio: true });

  const {
    data: floorsWithoutPrice,
    isLoading: isLoadingWithout,
    isError: isErrorWithout,
  } = useRoomsByProperty(propiedadId, { requierePrecio: false });

  // estados combinados
  if (isLoadingWith || isLoadingWithout) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Habitaciones</h1>
        <p className="text-sm text-muted-foreground">Loading rooms…</p>
      </div>
    );
  }

  if (isErrorWith || isErrorWithout) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Habitaciones</h1>
        <p className="text-sm text-red-500">
          There was an error loading the rooms for this property.
        </p>
      </div>
    );
  }

  const withPrice = floorsWithPrice ?? [];
  const withoutPrice = floorsWithoutPrice ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Habitaciones</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las habitaciones de la propiedad seleccionada.
          </p>
        </div>

        <NewRoomDialog propertyId={propiedadId} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="with-price" className="space-y-4">
        {/* centrado */}
        <TabsList className="w-full flex justify-center gap-2">
          <TabsTrigger value="with-price">Con precio</TabsTrigger>
          <TabsTrigger value="without-price">Sin precio</TabsTrigger>
        </TabsList>

        {/* Con precio */}
        <TabsContent value="with-price" className="space-y-4">
          {withPrice.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No hay habitaciones con precio"
              description="Aún no has configurado precios para tus habitaciones. Asigna precios para poder crear contratos de alquiler."
              compact
            />
          ) : (
            <GridRooms
              floors={withPrice as any}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}
        </TabsContent>

        {/* Sin precio */}
        <TabsContent value="without-price" className="space-y-4">
          {withoutPrice.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">¡Excelente!</h3>
              <p className="text-sm text-muted-foreground">Todas las habitaciones tienen precio asignado.</p>
            </div>
          ) : (
            <GridRooms
              floors={withoutPrice as any}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog editar */}
      <EditRoomDialog
        propertyId={propiedadId}
        room={roomToEdit}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Dialog eliminar */}
      <DeleteRoomDialog
        propertyId={propiedadId}
        room={roomToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}

export default PropertiesPage;
