// src/feature/contracts/hooks/useContractSignature.ts
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { downloadContractSignatureAsBlob } from "../api/contracts";

export const useContractSignature = (
    propertyId: number,
    contractId: number | null,
    enabled: boolean
) => {
    const previousUrlRef = useRef<string | null>(null);

    const query = useQuery({
        queryKey: ["contracts", "signature", propertyId, contractId],
        enabled: enabled && !!contractId,
        queryFn: async () => {
            console.log("🔍 Fetching signature:", { propertyId, contractId, enabled });
            if (!contractId) throw new Error("Contract ID required");
            
            try {
                // Limpiar URL anterior si existe
                if (previousUrlRef.current) {
                    console.log("🧹 Revoking previous URL:", previousUrlRef.current);
                    URL.revokeObjectURL(previousUrlRef.current);
                    previousUrlRef.current = null;
                }

                const blob = await downloadContractSignatureAsBlob(
                    propertyId,
                    contractId
                );
                console.log("✅ Blob received:", { size: blob.size, type: blob.type });
                
                if (blob.size === 0) {
                    throw new Error("Empty blob received");
                }
                
                const url = URL.createObjectURL(blob);
                console.log("✅ Blob URL created:", url);
                previousUrlRef.current = url;
                return url;
            } catch (error) {
                console.error("❌ Error fetching signature:", error);
                throw error;
            }
        },
        staleTime: Infinity, // No revalidar automáticamente
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 2,
        retryDelay: 1000,
    });

    // Limpiar el blob URL cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (previousUrlRef.current) {
                console.log("🧹 Cleanup: Revoking URL on unmount:", previousUrlRef.current);
                URL.revokeObjectURL(previousUrlRef.current);
                previousUrlRef.current = null;
            }
        };
    }, []);

    return query;
};
