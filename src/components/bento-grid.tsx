"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoItemProps {
  children: ReactNode;
  className?: string;
  size?: "small" | "medium" | "large" | "full";
}

export function BentoItem({
  children,
  className,
  size = "medium",
}: BentoItemProps) {
  const sizeClasses = {
    small: "md:col-span-1",
    medium: "md:col-span-2",
    large: "md:col-span-3",
    full: "md:col-span-4",
  };

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-stone-800/50 bg-stone-900/30 p-6 transition-all duration-300 hover:border-amber-200/20 hover:bg-stone-900/50",
        sizeClasses[size],
        className
      )}
    >
      {/* Hover glow effect */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/5 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface BentoGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function BentoGrid({
  children,
  className,
  columns = 4,
}: BentoGridProps) {
  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1",
        columnClasses[columns],
        className
      )}
    >
      {children}
    </div>
  );
}
