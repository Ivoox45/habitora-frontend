import { useState } from "react";
import { useTenantHelpers } from "./useTenantHelpers";
import { useTenantValidation } from "./useTenantValidation";

export function useTenantForm(initial?: {
    nombreCompleto?: string;
    numeroDni?: string;
    email?: string;
    telefonoWhatsapp?: string;
}) {
    const { sanitizeName, sanitizeDni, sanitizePhone } = useTenantHelpers();
    const { isValidDni, isValidEmail, isValidFullName, isValidPeruvianPhone } =
        useTenantValidation();

    const [nombreCompleto, setNombreCompleto] = useState(initial?.nombreCompleto ?? "");
    const [numeroDni, setNumeroDni] = useState(initial?.numeroDni ?? "");
    const [email, setEmail] = useState(initial?.email ?? "");
    const [telefonoWhatsapp, setTelefonoWhatsapp] = useState(
        initial?.telefonoWhatsapp ?? ""
    );

    return {
        nombreCompleto,
        numeroDni,
        email,
        telefonoWhatsapp,

        setNombreCompleto: (v: string) => setNombreCompleto(sanitizeName(v)),
        setNumeroDni: (v: string) => setNumeroDni(sanitizeDni(v)),
        setEmail,
        setTelefonoWhatsapp: (v: string) => setTelefonoWhatsapp(sanitizePhone(v)),

        validations: {
            isValidEmail: () => isValidEmail(email),
            isValidFullName: () => isValidFullName(nombreCompleto),
            isValidDni: () => isValidDni(numeroDni),
            isValidPhone: () => isValidPeruvianPhone(telefonoWhatsapp),
        },
    };
}
