import { Skeleton } from "@/components/ui/skeleton";

export function TenantCardSkeleton() {
    return (
        <div className="flex items-center gap-3 p-4 border rounded-xl">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-4 w-[40%]" />
            </div>
        </div>
    );
}
