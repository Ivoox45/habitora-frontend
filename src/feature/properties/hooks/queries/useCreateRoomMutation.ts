import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoomManual } from "../../api/rooms.api";
import type { CreateRoomPayload, Room } from "../../types/rooms.types";

export function useCreateRoomMutation(propertyId: number, options?: any) {
    const qc = useQueryClient();

    return useMutation<Room, Error, CreateRoomPayload>({
        mutationFn: (payload) => createRoomManual(propertyId, payload),

        onSuccess: (...args) => {
            qc.invalidateQueries({ queryKey: ["rooms", "property", propertyId] });
            options?.onSuccess?.(...args);
        },

        onError: (...args) => options?.onError?.(...args),
    });
}
