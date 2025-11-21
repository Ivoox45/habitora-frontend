// src/feature/properties/hooks/useCreateRoomManual.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { createRoomManual } from "../api/rooms";
import type { Room, CreateRoomPayload } from "../types";

type CreateRoomOptions = UseMutationOptions<Room, Error, CreateRoomPayload>;

export const useCreateRoomManual = (
  propertyId: number,
  options?: CreateRoomOptions
) => {
  const queryClient = useQueryClient();

  const { onSuccess, onError, onSettled, ...restOptions } = options ?? {};

  return useMutation<Room, Error, CreateRoomPayload>({
    mutationFn: (payload) => createRoomManual(propertyId, payload),

    onSuccess: (data, variables, context) => {
      // refrescamos las rooms de esa propiedad
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
