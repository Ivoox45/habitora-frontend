import { isValidDni, isValidEmail, isValidPeruvianPhone, isValidFullName } from "@/lib/validations";

export function useTenantValidation() {
    return {
        isValidFullName,
        isValidDni,
        isValidEmail,
        isValidPeruvianPhone,
    };
}
