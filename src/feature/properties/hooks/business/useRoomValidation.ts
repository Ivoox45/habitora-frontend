import { validateRent, parseRoomCode } from "../../utils/room.helpers";

export function useRoomValidation() {
    return {
        validateRent,
        parseRoomCode,
    };
}
