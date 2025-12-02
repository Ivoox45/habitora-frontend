import { Skeleton } from "@/components/ui/skeleton";

export function RoomCardSkeleton() {
    return (
        <article className="rounded-xl border border-neutral-200 p-4 bg-white dark:bg-neutral-900 dark:border-neutral-800 flex flex-col gap-4">
            <div className="flex justify-between">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-5 w-20 rounded-full" />
            </div>

            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />

            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />

            <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
            </div>
        </article>
    );
}
