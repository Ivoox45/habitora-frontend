import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "../../api/rooms.api";

export function useDeleteRoomMutation(propertyId: number, options?: any) {
    const qc = useQueryClient();

    return useMutation<void, Error, { roomId: number }>({
        mutationFn: ({ roomId }) => deleteRoom(propertyId, roomId),

        onSuccess: (...args) => {
            qc.invalidateQueries({ queryKey: ["rooms", "property", propertyId] });
            options?.onSuccess?.(...args);
        },

        onError: (...args) => options?.onError?.(...args),
    });
}
