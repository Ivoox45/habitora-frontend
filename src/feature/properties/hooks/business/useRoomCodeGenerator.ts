import { useMemo } from "react";
import type { Room, RoomsByFloor } from "../../types";
import { getAvailableCodesForRoom, getAvailableCodesForFloor } from "../../utils/room.helpers";

export function useRoomCodeGenerator(floors: RoomsByFloor[] | undefined, room?: Room | null, floorId?: number | null) {

    const codesForEdit = useMemo(() => {
        if (!room || !floors) return [];
        return getAvailableCodesForRoom(floors, room);
    }, [floors, room]);

    const codesForCreate = useMemo(() => {
        if (!floors || !floorId) return [];
        const floor = floors.find((f) => f.floorId === floorId);
        if (!floor) return [];
        return getAvailableCodesForFloor(floor);
    }, [floors, floorId]);

    return {
        codesForEdit,
        codesForCreate,
    };
}
