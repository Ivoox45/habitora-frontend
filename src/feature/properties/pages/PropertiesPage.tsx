// src/feature/properties/pages/PropertiesPage.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useRoomsByProperty } from "../hooks/useRoomsByProperty";

import { NewRoomDialog } from "../components/NewRoomDialog";
import { GridRooms } from "../components/GridRooms";
import { EditRoomDialog } from "../components/EditRoomDialog";
import { DeleteRoomDialog } from "../components/DeleteRoomDialog";
import type { Room } from "../types";

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

  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!propiedadId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Rooms</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          No valid property was found. Please select a property from the start
          page.
        </p>
      </div>
    );
  }

  const {
    data: floors,
    isLoading,
    isError,
  } = useRoomsByProperty(propiedadId);

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Rooms</h1>
        <p className="text-sm text-muted-foreground">Loading rooms…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Rooms</h1>
        <p className="text-sm text-red-500">
          There was an error loading the rooms for this property.
        </p>
      </div>
    );
  }

  const handleEditRoom = (room: Room) => {
    setRoomToEdit(room);
    setEditOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Rooms</h1>
          <p className="text-sm text-muted-foreground">
            Manage the rooms associated with this property.
          </p>
        </div>

        <NewRoomDialog propertyId={propiedadId} />
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {(!floors || floors.length === 0) ? (
          <p className="text-sm text-muted-foreground">
            There are no rooms yet for this property.
          </p>
        ) : (
          <GridRooms
            floors={floors}
            onEditRoom={handleEditRoom}
            onDeleteRoom={handleDeleteRoom}
          />
        )}
      </div>

      {/* Dialog editar */}
      <EditRoomDialog
        propertyId={propiedadId}
        room={roomToEdit}
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setRoomToEdit(null);
        }}
      />

      {/* Dialog eliminar */}
      <DeleteRoomDialog
        propertyId={propiedadId}
        room={roomToDelete}
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
          if (!open) setRoomToDelete(null);
        }}
      />
    </div>
  );
}

export default PropertiesPage;
