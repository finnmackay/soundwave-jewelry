"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  detail: string;
  rating?: number;
  className?: string;
}

export function TestimonialCard({
  quote,
  author,
  detail,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-stone-800/50 bg-stone-950/50 p-8 transition-all duration-300 hover:border-amber-200/20",
        className
      )}
    >
      {/* Quote mark decoration */}
      <div className="absolute -right-2 -top-2 text-8xl font-serif text-stone-800/30 select-none">
        &ldquo;
      </div>

      {/* Rating stars */}
      <div className="mb-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < rating
                ? "fill-amber-200 text-amber-200"
                : "text-stone-700"
            )}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="relative z-10 text-sm leading-relaxed text-stone-400">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="mt-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-200/20 to-amber-400/10 flex items-center justify-center">
          <span className="text-sm font-medium text-amber-200">
            {author.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-200">{author}</p>
          <p className="text-xs text-stone-600">{detail}</p>
        </div>
      </div>

      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-200/5 via-transparent to-transparent" />
      </div>
    </div>
  );
}
