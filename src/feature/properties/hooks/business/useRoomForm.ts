import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { validateRent, parseRoomCode } from "../../utils/room.helpers";

export function useRoomForm(onSubmit: (payload: { code: number; rent: number }) => void) {

    const [code, setCode] = useState("");
    const [rent, setRent] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const numericCode = parseRoomCode(code);
        if (!numericCode) {
            toast.error("El código debe ser numérico");
            return;
        }

        if (!validateRent(rent)) {
            toast.error("Ingresa una renta válida (>= 0)");
            return;
        }

        onSubmit({ code: numericCode, rent: Number(rent) });
    };

    return {
        code,
        setCode,
        rent,
        setRent,
        handleSubmit,
    };
}
