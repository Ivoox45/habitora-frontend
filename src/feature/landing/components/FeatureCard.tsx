// src/feature/landing/components/FeatureCard.tsx
import type { ReactNode } from "react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <article
      className="
        bg-card text-card-foreground 
        rounded-2xl border border-border shadow-sm 
        p-6 flex gap-5 h-full min-h-[140px]
        transition duration-300 
        hover:-translate-y-1 hover:shadow-lg 
        cursor-pointer select-none
      "
    >
      <div className="flex h-12 w-18 items-center justify-center rounded-2xl bg-muted">
        <div className="text-foreground">{icon}</div>
      </div>

      <div className="text-left flex flex-col justify-center">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}
