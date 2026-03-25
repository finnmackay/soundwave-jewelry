"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center lg:px-8 lg:py-32">
      {/* Checkmark icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-200/30 bg-amber-200/5">
        <svg
          className="h-10 w-10 text-amber-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="mt-8 font-serif text-4xl sm:text-5xl">Thank You</h1>
      <p className="mt-4 text-lg text-stone-400">
        Your order has been received and your sound is being crafted.
      </p>

      <div className="mt-12 rounded-2xl border border-stone-800/50 bg-stone-900/30 p-8">
        <div className="space-y-6 text-left">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
              What happens next
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-200/30 text-sm font-serif text-amber-200">
              1
            </div>
            <div>
              <p className="font-medium text-stone-200">
                Order confirmation email
              </p>
              <p className="mt-1 text-sm text-stone-500">
                You&apos;ll receive an email with your order details shortly.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-200/30 text-sm font-serif text-amber-200">
              2
            </div>
            <div>
              <p className="font-medium text-stone-200">
                Artisan crafting begins
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Our artisans will begin transforming your waveform into jewelry
                within 1-2 business days.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-amber-200/30 text-sm font-serif text-amber-200">
              3
            </div>
            <div>
              <p className="font-medium text-stone-200">Shipping</p>
              <p className="mt-1 text-sm text-stone-500">
                Your piece will ship within 10-14 business days. We&apos;ll send
                tracking info as soon as it&apos;s on its way.
              </p>
            </div>
          </div>
        </div>
      </div>

      {sessionId && (
        <p className="mt-8 text-xs text-stone-600">
          Reference: {sessionId.slice(0, 20)}...
        </p>
      )}

      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/create"
          className="rounded-full bg-amber-200 px-8 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-300"
        >
          Create Another
        </Link>
        <Link
          href="/"
          className="text-sm text-stone-400 transition-colors hover:text-stone-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-stone-500">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
