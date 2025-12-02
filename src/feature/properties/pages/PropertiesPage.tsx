// src/feature/properties/pages/PropertiesPage.tsx

import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Home } from "lucide-react";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

import { useRoomsByPropertyQuery } from "../hooks/queries/useRoomsByPropertyQuery";
import type { Room } from "../types/rooms.types";

import { GridRooms } from "../components/GridRooms";
import { NewRoomDialog } from "../components/NewRoomDialog";
import { EditRoomDialog } from "../components/EditRoomDialog";
import { DeleteRoomDialog } from "../components/DeleteRoomDialog";

import { EmptyState } from "@/components/EmptyState";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

const parseId = (raw?: string | null) => {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export function PropertiesPage() {
  const params = useParams();
  const idRaw =
    params.propertyId ??
    params.propiedadId ??
    null;

  const idFromRoute = useMemo(() => parseId(idRaw), [idRaw]);
  const { currentPropertyId } = useCurrentPropertyStore();

  const propertyId = idFromRoute ?? currentPropertyId ?? null;

  if (!propertyId)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Habitaciones</h1>
        <p className="text-sm flex items-center gap-2 text-muted-foreground">
          <AlertCircle className="w-4 h-4" /> Selecciona una propiedad válida.
        </p>
      </div>
    );

  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (room: Room) => {
    setRoomToEdit(room);
    setEditOpen(true);
  };

  const handleDelete = (room: Room) => {
    setRoomToDelete(room);
    setDeleteOpen(true);
  };

  const withPrice = useRoomsByPropertyQuery(propertyId, {
    requierePrecio: true,
  });

  const withoutPrice = useRoomsByPropertyQuery(propertyId, {
    requierePrecio: false,
  });

  if (withPrice.isLoading || withoutPrice.isLoading)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Habitaciones</h1>
        <p className="text-sm text-muted-foreground">Cargando habitaciones…</p>
      </div>
    );

  if (withPrice.isError || withoutPrice.isError)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Habitaciones</h1>
        <p className="text-sm text-red-500">Error cargando habitaciones.</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Habitaciones</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las habitaciones de la propiedad seleccionada.
          </p>
        </div>

        <NewRoomDialog propertyId={propertyId} />
      </div>

      <Tabs defaultValue="with-price">
        <TabsList className="flex justify-center w-full">
          <TabsTrigger value="with-price">Con precio</TabsTrigger>
          <TabsTrigger value="without-price">Sin precio</TabsTrigger>
        </TabsList>

        {/* Con precio */}
        <TabsContent value="with-price">
          {withPrice.data?.length === 0 ? (
            <EmptyState
              icon={Home}
              title="No hay habitaciones con precio"
              description="Agrega precios para habilitar contratos."
            />
          ) : (
            <GridRooms floors={withPrice.data} onEditRoom={handleEdit} onDeleteRoom={handleDelete} />
          )}
        </TabsContent>

        {/* Sin precio */}
        <TabsContent value="without-price">
          {withoutPrice.data?.length === 0 ? (
            <EmptyState
              icon={Home}
              title="Todo configurado"
              description="Todas las habitaciones tienen precio asignado."
            />
          ) : (
            <GridRooms
              floors={withoutPrice.data}
              onEditRoom={handleEdit}
              onDeleteRoom={handleDelete}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Edit */}
      <EditRoomDialog
        propertyId={propertyId}
        room={roomToEdit}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* Delete */}
      <DeleteRoomDialog
        propertyId={propertyId}
        room={roomToDelete}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
}

export default PropertiesPage;
