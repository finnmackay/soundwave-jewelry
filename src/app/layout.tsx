import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Grounded Sound | Turn Sounds Into Wearable Art",
  description:
    "Turn your most meaningful sounds into wearable art. Custom soundwave jewelry crafted from your voice, your song, your moment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-950 text-stone-100 font-sans">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-stone-800/50 bg-stone-950/80 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link
                href="/"
                className="font-serif text-xl tracking-wide text-amber-200"
              >
                Grounded Sound
              </Link>
              <div className="hidden items-center gap-8 sm:flex">
                <Link
                  href="/#how-it-works"
                  className="text-sm text-stone-400 transition-colors hover:text-stone-100"
                >
                  How It Works
                </Link>
                <Link
                  href="/#products"
                  className="text-sm text-stone-400 transition-colors hover:text-stone-100"
                >
                  Products
                </Link>
                <Link
                  href="/create"
                  className="rounded-full bg-amber-200 px-5 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-300"
                >
                  Create Yours
                </Link>
              </div>
              {/* Mobile menu button */}
              <Link
                href="/create"
                className="rounded-full bg-amber-200 px-4 py-1.5 text-sm font-medium text-stone-950 sm:hidden"
              >
                Create
              </Link>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 pt-16">{children}</main>

        {/* Footer */}
        <footer className="border-t border-stone-800/50 bg-stone-950">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="grid gap-12 sm:grid-cols-3">
              <div>
                <p className="font-serif text-lg text-amber-200">
                  Grounded Sound
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">
                  Turn your most meaningful sounds into wearable art. Each piece
                  is as unique as the moment it captures.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
                  Navigate
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-500">
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="transition-colors hover:text-stone-300"
                    >
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#products"
                      className="transition-colors hover:text-stone-300"
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/create"
                      className="transition-colors hover:text-stone-300"
                    >
                      Create Yours
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-stone-400">
                  Support
                </p>
                <ul className="mt-4 space-y-2 text-sm text-stone-500">
                  <li>
                    <Link
                      href="/#faq"
                      className="transition-colors hover:text-stone-300"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <span className="transition-colors hover:text-stone-300">
                      hello@groundedsound.com
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-stone-800/50 pt-8 text-center text-xs text-stone-600">
              &copy; {new Date().getFullYear()} Grounded Sound. All rights
              reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
