// src/feature/properties/hooks/useDeleteRoom.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { deleteRoom } from "../api/rooms";

type DeleteVariables = { roomId: number };

type MutationOptions = UseMutationOptions<void, Error, DeleteVariables, unknown>;

export function useDeleteRoom(
  propertyId: number,
  options?: MutationOptions
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, DeleteVariables, unknown>({
    mutationFn: ({ roomId }) => deleteRoom(propertyId, roomId),

    onSuccess: (...args) => {
      // invalidar cache de habitaciones de esa propiedad
      queryClient.invalidateQueries({
        queryKey: ["rooms", "by-property", propertyId],
      });

      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },

    onError: (...args) => {
      options?.onError?.(
        ...(args as Parameters<NonNullable<typeof options.onError>>)
      );
    },

    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["rooms", "by-property", propertyId],
      });

      options?.onSettled?.(
        ...(args as Parameters<NonNullable<typeof options.onSettled>>)
      );
    },

    ...(options ?? {}),
  });
}
