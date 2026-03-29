"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(253, 230, 138, 0.15)",
}: SpotlightCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-stone-800/50 bg-stone-950/50",
        className
      )}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 40%)`,
        }}
      />
      
      {/* Border glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(253, 230, 138, 0.1), transparent 40%)`,
          }}
        />
      </div>

      {/* Mouse tracking overlay */}
      <MouseTracker />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function MouseTracker() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div
      className="absolute inset-0 z-20"
      onMouseMove={handleMouseMove}
    />
  );
}
