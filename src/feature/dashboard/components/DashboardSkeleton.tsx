import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                <Skeleton className="col-span-4 h-96" />
                <Skeleton className="col-span-3 h-96" />
            </div>
        </div>
    );
}
