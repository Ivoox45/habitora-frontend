import { useQuery } from "@tanstack/react-query";
import { getRoomsByProperty } from "../../api/rooms.api";
import type { RoomsFilters, RoomsByFloor } from "../../types/rooms.types";

export function useRoomsByPropertyQuery(
    propertyId: number | null,
    filters?: RoomsFilters
) {
    return useQuery<RoomsByFloor[]>({
        queryKey: ["rooms", "property", propertyId, filters],
        enabled: !!propertyId,
        queryFn: () => getRoomsByProperty(propertyId!, filters),
    });
}
