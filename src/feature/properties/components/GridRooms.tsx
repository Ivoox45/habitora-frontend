// src/feature/properties/components/GridRooms.tsx

import { useMemo, useEffect, useState } from "react";
import { RoomCard } from "./RoomCard";
import { RoomCardSkeleton } from "./RoomCardSkeleton";

import type { Room, RoomsByFloor } from "../types/rooms.types";
import { EmptyState } from "@/components/EmptyState";
import { Home } from "lucide-react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  floors?: RoomsByFloor[];
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
  isLoading?: boolean;
};

const PAGE_SIZE = 9;

export function GridRooms({ floors, onEditRoom, onDeleteRoom, isLoading }: Props) {

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  const safe = floors ?? [];

  const sorted = useMemo(
    () =>
      safe
        .map((f) => ({
          ...f,
          rooms: [...f.rooms].sort((a, b) => Number(a.code) - Number(b.code)),
        }))
        .sort((a, b) => a.floorNumber - b.floorNumber),
    [safe]
  );

  const all = useMemo(
    () =>
      sorted.flatMap((f) =>
        f.rooms.map((room) => ({ room, floorNumber: f.floorNumber }))
      ),
    [sorted]
  );

  if (all.length === 0)
    return (
      <EmptyState
        icon={Home}
        title="Sin habitaciones"
        description="Agrega habitaciones para poder gestionarlas"
      />
    );

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(all.length / PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const items = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const grouped = useMemo(() => {
    const map = new Map<number, Room[]>();
    items.forEach(({ room, floorNumber }) => {
      if (!map.has(floorNumber)) map.set(floorNumber, []);
      map.get(floorNumber)!.push(room);
    });
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [items]);

  return (
    <div className="space-y-8">
      {grouped.map(([floorNumber, rooms]) => (
        <div key={floorNumber}>
          <h2 className="text-lg font-bold mb-3">Piso {floorNumber}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                roomId={room.id}
                codigo={room.code}
                estado={room.status}
                precioRenta={room.rentPrice}
                numeroPiso={floorNumber}
                onEdit={() => onEditRoom?.(room)}
                onDelete={() => onDeleteRoom?.(room)}
              />
            ))}
          </div>
        </div>
      ))}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => page > 1 && setPage(page - 1)} />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={() => page < totalPages && setPage(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
