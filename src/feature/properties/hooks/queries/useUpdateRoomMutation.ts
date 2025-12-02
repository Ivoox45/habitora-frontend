import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRoom } from "../../api/rooms.api";
import type { UpdateRoomPayload, Room } from "../../types/rooms.types";

export function useUpdateRoomMutation(propertyId: number, options?: any) {
    const qc = useQueryClient();

    return useMutation<Room, Error, UpdateRoomPayload & { roomId: number }>({
        mutationFn: ({ roomId, ...rest }) =>
            updateRoom(propertyId, roomId, rest),

        onSuccess: (...args) => {
            qc.invalidateQueries({ queryKey: ["rooms", "property", propertyId] });
            options?.onSuccess?.(...args);
        },

        onError: (...args) => options?.onError?.(...args),
    });
}
