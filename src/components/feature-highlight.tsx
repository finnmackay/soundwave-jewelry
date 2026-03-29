"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureHighlightProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureHighlight({
  icon,
  title,
  description,
  className,
}: FeatureHighlightProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center text-center p-6",
        className
      )}
    >
      {/* Icon container with glow effect */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-amber-200/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-amber-200/30 bg-stone-900/50 text-amber-200 transition-all duration-300 group-hover:border-amber-200/50 group-hover:bg-amber-200/10">
          {icon}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-6 font-serif text-xl text-stone-100">{title}</h3>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-stone-500">
        {description}
      </p>
    </div>
  );
}

interface FeatureHighlightsProps {
  features: {
    icon: ReactNode;
    title: string;
    description: string;
  }[];
  className?: string;
}

export function FeatureHighlights({
  features,
  className,
}: FeatureHighlightsProps) {
  return (
    <div
      className={cn(
        "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {features.map((feature, index) => (
        <FeatureHighlight
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}
