// src/feature/contracts/hooks/useAvailableRoomsByProperty.ts
import { useQuery } from "@tanstack/react-query";
import { getAvailableRoomsByProperty } from "../api/contracts";
import type { AvailableRoomsByFloor } from "../types";

export const useAvailableRoomsByProperty = (
  propertyId: number | null | undefined
) => {
  return useQuery<AvailableRoomsByFloor[]>({
    queryKey: ["contracts", "available-rooms", propertyId],
    enabled: !!propertyId && propertyId > 0,
    queryFn: () => getAvailableRoomsByProperty(propertyId as number),
  });
};
