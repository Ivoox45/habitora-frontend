// src/feature/properties/api/properties.api.ts
import axiosInstance from "@/lib/axios";
import {
    mapBackendProperty,
    mapBackendProperties,
} from "../utils/properties.mappers";

import type { Propiedad } from "../types/properties.types";

/**
 * GET /api/propiedades
 */
export async function getAllProperties(): Promise<Propiedad[]> {
    const { data } = await axiosInstance.get("/api/propiedades");
    return mapBackendProperties(data ?? []);
}

/**
 * GET /api/propiedades/{id}
 */
export async function getPropertyById(id: number): Promise<Propiedad> {
    const { data } = await axiosInstance.get(`/api/propiedades/${id}`);
    return mapBackendProperty(data);
}
