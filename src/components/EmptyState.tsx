// src/components/EmptyState.tsx
import type { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-12" : "py-20",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full bg-gradient-to-br from-muted to-muted/50 p-6 mb-6 shadow-sm",
          "dark:from-neutral-800 dark:to-neutral-900"
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            compact ? "h-10 w-10" : "h-12 w-12"
          )}
          strokeWidth={1.5}
        />
      </div>

      <h3
        className={cn(
          "font-semibold text-foreground mb-2",
          compact ? "text-lg" : "text-xl"
        )}
      >
        {title}
      </h3>

      <p
        className={cn(
          "text-muted-foreground max-w-sm mb-6",
          compact ? "text-sm" : "text-base"
        )}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <Button onClick={onAction} size={compact ? "default" : "lg"}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
