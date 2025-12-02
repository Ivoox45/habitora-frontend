import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "../../api/properties.api";
import type { Propiedad } from "../../types/properties.types";

export function usePropertyByIdQuery(propertyId: number | null) {
    return useQuery<Propiedad>({
        queryKey: ["property", propertyId],
        enabled: !!propertyId,
        queryFn: () => getPropertyById(propertyId!),
    });
}
