"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";

interface CTASectionProps {
  title: string;
  highlightedText?: string;
  subtitle?: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
}

export function CTASection({
  title,
  highlightedText,
  subtitle,
  primaryButton,
  secondaryButton,
  children,
  className,
}: CTASectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-stone-800/50 bg-stone-900/30 py-24 lg:py-32",
        className
      )}
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-200/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
          {title}
          {highlightedText && (
            <>
              {" "}
              <span className="text-amber-200">{highlightedText}</span>
            </>
          )}
        </h2>

        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-stone-500">{subtitle}</p>
        )}

        {children}

        {(primaryButton || secondaryButton) && (
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {primaryButton && (
              <Link
                href={primaryButton.href}
                className="rounded-full bg-amber-200 px-10 py-4 text-base font-semibold text-stone-950 shadow-lg shadow-amber-200/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30"
              >
                {primaryButton.text}
              </Link>
            )}
            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="text-sm text-stone-400 transition-colors hover:text-stone-200"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
