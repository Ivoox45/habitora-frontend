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
        bg-white rounded-2xl border border-gray-200 shadow-sm 
        p-6 flex gap-5 h-full min-h-[140px]
      "
    >
      <div className="flex h-12 w-18 items-center justify-center rounded-2xl bg-gray-100">
        <div className="text-gray-800">{icon}</div>
      </div>

      <div className="text-left flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </article>
  );
}
