import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "../../api/properties.api";
import type { Propiedad } from "../../types/properties.types";

export function usePropertiesQuery() {
    return useQuery<Propiedad[]>({
        queryKey: ["properties"],
        queryFn: getAllProperties,
    });
}
