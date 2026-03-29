"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  features: string[];
  isPopular?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function PricingCard({
  name,
  description,
  price,
  originalPrice,
  features,
  isPopular = false,
  buttonText = "Get Started",
  onButtonClick,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl p-6 transition-all duration-300",
        isPopular
          ? "border-2 border-amber-200/50 bg-gradient-to-b from-amber-200/5 to-stone-950/50"
          : "border border-stone-800/50 bg-stone-900/30 hover:border-stone-700",
        className
      )}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-stone-950">
            Most Popular
          </span>
        </div>
      )}

      {/* Animated gradient border for popular */}
      {isPopular && (
        <div className="absolute inset-0 -z-10 rounded-2xl opacity-50 blur-xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200/20 via-amber-400/20 to-amber-200/20 animate-pulse" />
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h3 className="font-serif text-xl text-stone-100">{name}</h3>
        <p className="mt-2 text-sm text-stone-500">{description}</p>
      </div>

      {/* Price */}
      <div className="mt-6 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <span className="font-serif text-4xl text-amber-200">{price}</span>
          {originalPrice && (
            <span className="text-sm text-stone-600 line-through">
              {originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* Features */}
      <ul className="mt-8 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-200/10">
              <Check className="h-3 w-3 text-amber-200" />
            </div>
            <span className="text-sm text-stone-400">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button
        onClick={onButtonClick}
        className={cn(
          "mt-8 w-full rounded-full py-3 text-sm font-medium transition-all duration-300",
          isPopular
            ? "bg-amber-200 text-stone-950 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-200/20"
            : "border border-stone-700 text-stone-300 hover:border-amber-200/50 hover:text-amber-200"
        )}
      >
        {buttonText}
      </button>
    </div>
  );
}
