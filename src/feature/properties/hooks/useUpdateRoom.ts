// src/feature/properties/hooks/useUpdateRoom.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { updateRoom } from "../api/rooms";
import type { Room, UpdateRoomPayload } from "../types";

type UpdateVariables = UpdateRoomPayload & { roomId: number };

type UpdateRoomOptions = UseMutationOptions<Room, Error, UpdateVariables>;

export const useUpdateRoom = (
  propertyId: number,
  options?: UpdateRoomOptions
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Room, Error, UpdateVariables>({
    mutationFn: ({ roomId, ...payload }) =>
      updateRoom(propertyId, roomId, payload),

    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "by-property", propertyId],
      });

      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      onError?.(error, variables, context);
    },

    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "by-property", propertyId],
      });

      onSettled?.(data, error, variables, context);
    },

    ...restOptions,
  });
};
