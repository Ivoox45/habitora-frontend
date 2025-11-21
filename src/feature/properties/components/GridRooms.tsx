// src/feature/properties/components/GridRooms.tsx

import { useEffect, useMemo, useState } from "react";
import { RoomCard } from "./RoomCard";
import type { Room, RoomsByFloor } from "../types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type GridRoomsProps = {
  floors?: RoomsByFloor[];
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
};

const PAGE_SIZE = 9;

export function GridRooms({ floors, onEditRoom, onDeleteRoom }: GridRoomsProps) {
  const safeFloors = floors ?? [];

  const roomsRaw = useMemo(
    () =>
      safeFloors.flatMap((floor) =>
        (floor.rooms ?? []).map((room) => ({
          room,
          floorNumber: floor.floorNumber,
        }))
      ),
    [safeFloors]
  );

  if (safeFloors.length === 0 || roomsRaw.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay habitaciones registradas para esta propiedad.
      </p>
    );
  }

  const sortedRooms = useMemo(() => {
    return [...roomsRaw].sort((a, b) => {
      if (a.floorNumber !== b.floorNumber) {
        return a.floorNumber - b.floorNumber;
      }

      const codeA = Number(a.room.code);
      const codeB = Number(b.room.code);
      const validA = Number.isFinite(codeA);
      const validB = Number.isFinite(codeB);

      if (validA && validB) return codeA - codeB;
      if (validA) return -1;
      if (validB) return 1;

      return a.room.code.localeCompare(b.room.code);
    });
  }, [roomsRaw]);

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sortedRooms.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedRooms = sortedRooms.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedRooms.map(({ room, floorNumber }) => (
          <RoomCard
            key={room.id}
            roomId={room.id}
            codigo={room.code}
            estado={room.status}
            precioRenta={room.rentPrice}
            numeroPiso={floorNumber}
            onEdit={onEditRoom ? () => onEditRoom(room) : undefined}
            onDelete={onDeleteRoom ? () => onDeleteRoom(room) : undefined}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium">
          {sortedRooms.length === 0 ? 0 : startIndex + 1}
        </span>{" "}
        –{" "}
        <span className="font-medium">
          {Math.min(startIndex + PAGE_SIZE, sortedRooms.length)}
        </span>{" "}
        de <span className="font-medium">{sortedRooms.length}</span>{" "}
        habitaciones
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
