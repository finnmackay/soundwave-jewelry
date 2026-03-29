"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TrustBadgeProps {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  className?: string;
}

export function TrustBadge({
  icon,
  label,
  sublabel,
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-stone-800/50 bg-stone-900/30 px-4 py-3 transition-all duration-300 hover:border-amber-200/20 hover:bg-stone-900/50",
        className
      )}
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-200/10 text-amber-200">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-stone-200">{label}</p>
        {sublabel && (
          <p className="text-xs text-stone-500">{sublabel}</p>
        )}
      </div>
    </div>
  );
}

interface TrustBadgesProps {
  badges: {
    icon: ReactNode;
    label: string;
    sublabel?: string;
  }[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function TrustBadges({
  badges,
  className,
  columns = 4,
}: TrustBadgesProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4 grid-cols-1",
        columnClasses[columns],
        className
      )}
    >
      {badges.map((badge, index) => (
        <TrustBadge
          key={index}
          icon={badge.icon}
          label={badge.label}
          sublabel={badge.sublabel}
        />
      ))}
    </div>
  );
}
