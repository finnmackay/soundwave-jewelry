"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { extractWaveform, waveformToSVGPath } from "@/lib/waveform";
import { MATERIALS, type MaterialKey } from "@/lib/stripe";
import { SpotlightCard, GradientText } from "@/components";
import {
  Upload,
  Music,
  Check,
  ChevronRight,
  Loader2,
  Volume2,
} from "lucide-react";

type ProductType = "soundwave";
type JewelryType = "pendant" | "bracelet" | "ring";

const PRODUCT_TYPES: {
  key: ProductType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "soundwave",
    label: "Soundwave",
    description: "Upload audio to create a unique waveform design",
    icon: <Music className="h-6 w-6" />,
  },
];

const JEWELRY_TYPES: {
  key: JewelryType;
  label: string;
  sizes: string[];
  description: string;
}[] = [
  {
    key: "pendant",
    label: "Pendant",
    sizes: ["Small", "Medium", "Large"],
    description: "Wear close to your heart",
  },
  {
    key: "bracelet",
    label: "Bracelet",
    sizes: ['6"', '6.5"', '7"', '7.5"', '8"'],
    description: "Wrap your story around your wrist",
  },
  {
    key: "ring",
    label: "Ring",
    sizes: ["5", "6", "7", "8", "9", "10", "11"],
    description: "Carry your moment always",
  },
];

function CreatePageInner() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as ProductType) || null;

  const [step, setStep] = useState(initialType ? 2 : 1);
  const [productType, setProductType] = useState<ProductType | null>(
    initialType
  );
  const [material, setMaterial] = useState<MaterialKey | null>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType | null>(null);
  const [size, setSize] = useState<string>("");
  const [email, setEmail] = useState("");
  const [waveform, setWaveform] = useState<number[] | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      const data = await extractWaveform(file, 200);
      setWaveform(data);
    } catch {
      setError(
        "Could not process audio file. Please try a different format (MP3, WAV, M4A)."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!productType || !material || !jewelryType || !size || !email) {
      setError("Please complete all steps before checking out.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("product_type", productType);
      formData.append("material", material);
      formData.append("jewelry_type", jewelryType);
      formData.append("size", size);
      formData.append("email", email);

      if (waveform) {
        formData.append("waveform", JSON.stringify(waveform));
      }

      if (audioFile) {
        formData.append("audio", audioFile);
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMaterial = material ? MATERIALS[material] : null;
  const selectedJewelry = jewelryType
    ? JEWELRY_TYPES.find((j) => j.key === jewelryType)
    : null;

  const svgPath = waveform && waveformToSVGPath(waveform, 200, 80);

  const getMaterialColor = (key: MaterialKey) => {
    const colors: Record<string, string> = {
      stainless_steel: "from-gray-400 to-gray-600",
      sterling_silver: "from-gray-200 to-gray-400",
      brass: "from-yellow-600 to-yellow-800",
      bronze: "from-orange-600 to-orange-800",
    };
    return colors[key] || "from-stone-400 to-stone-600";
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
          Design Studio
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Create Your <GradientText>Masterpiece</GradientText>
        </h1>
        <p className="mt-4 text-stone-500">
          Follow the steps below to design your one-of-a-kind jewelry.
        </p>
      </div>

      {/* Progress Steps - Enhanced */}
      <div className="mt-12 flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s < step) setStep(s);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                s === step
                  ? "bg-amber-200 text-stone-950 shadow-lg shadow-amber-200/20"
                  : s < step
                    ? "bg-amber-200/20 text-amber-200 cursor-pointer hover:bg-amber-200/30"
                    : "bg-stone-800 text-stone-500"
              }`}
            >
              {s < step ? <Check className="h-5 w-5" /> : s}
            </button>
            {s < 4 && (
              <div
                className={`h-0.5 w-8 sm:w-16 transition-colors ${
                  s < step ? "bg-amber-200/50" : "bg-stone-800"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-8">
          {/* Step 1: Product Type */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">
                What would you like to create?
              </h2>
              <div className="mt-8 space-y-4">
                {PRODUCT_TYPES.map((pt) => (
                  <button
                    key={pt.key}
                    onClick={() => {
                      setProductType(pt.key);
                      setStep(2);
                      setWaveform(null);
                      setAudioFile(null);
                    }}
                    className={`group w-full rounded-xl border p-6 text-left transition-all hover:scale-[1.02] ${
                      productType === pt.key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700 hover:bg-stone-900/50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                          productType === pt.key
                            ? "bg-amber-200/20 text-amber-200"
                            : "bg-stone-800 text-stone-500 group-hover:text-stone-300"
                        }`}
                      >
                        {pt.icon}
                      </div>
                      <div>
                        <p className="font-serif text-lg">{pt.label}</p>
                        <p className="mt-1 text-sm text-stone-500">
                          {pt.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`ml-auto h-5 w-5 transition-all ${
                          productType === pt.key
                            ? "text-amber-200 translate-x-1"
                            : "text-stone-600 group-hover:text-stone-400"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Design Input */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">Upload Your Sound</h2>
              <p className="mt-2 text-sm text-stone-500">
                Upload any audio file—voice memos, songs, or recordings work
                perfectly.
              </p>

              <div className="mt-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all ${
                    audioFile
                      ? "border-amber-200/50 bg-amber-200/5"
                      : "border-stone-700 hover:border-amber-200/30 hover:bg-stone-900/30"
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-10 w-10 animate-spin text-amber-200" />
                      <p className="mt-4 text-sm text-stone-400">
                        Processing your audio...
                      </p>
                    </>
                  ) : audioFile ? (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200/20">
                        <Volume2 className="h-6 w-6 text-amber-200" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-amber-200">
                        {audioFile.name}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-800 transition-colors group-hover:bg-stone-700">
                        <Upload className="h-6 w-6 text-stone-500 transition-colors group-hover:text-stone-400" />
                      </div>
                      <p className="mt-4 text-sm text-stone-400">
                        Click to upload audio
                      </p>
                      <p className="mt-1 text-xs text-stone-600">
                        MP3, WAV, M4A supported
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-stone-700 px-6 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-600"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (waveform) {
                      setStep(3);
                    } else {
                      setError(
                        "Please upload an audio file before continuing."
                      );
                    }
                  }}
                  disabled={!waveform}
                  className="flex items-center gap-2 rounded-lg bg-amber-200 px-6 py-2.5 text-sm font-medium text-stone-950 transition-all hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Material */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">Choose Your Material</h2>
              <p className="mt-2 text-sm text-stone-500">
                Each material brings its own character to your piece.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {(
                  Object.entries(MATERIALS) as [
                    MaterialKey,
                    (typeof MATERIALS)[MaterialKey],
                  ][]
                ).map(([key, mat]) => (
                  <button
                    key={key}
                    onClick={() => setMaterial(key)}
                    className={`group relative rounded-xl border p-6 text-left transition-all hover:scale-[1.02] ${
                      material === key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    {/* Material color indicator */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b ${getMaterialColor(key)}`}
                    />

                    <div className="pl-3">
                      <p className="font-serif text-base">{mat.name}</p>
                      <p className="mt-1 text-lg font-medium text-amber-200">
                        ${(mat.price / 100).toFixed(0)}
                      </p>
                      <p className="mt-2 text-xs text-stone-500 line-clamp-2">
                        {mat.description}
                      </p>
                    </div>

                    {material === key && (
                      <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/20">
                        <Check className="h-4 w-4 text-amber-200" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-lg border border-stone-700 px-6 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-600"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (material) {
                      setStep(4);
                    } else {
                      setError("Please select a material.");
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg bg-amber-200 px-6 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-300"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Jewelry Type + Checkout */}
          {step === 4 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">Choose Jewelry Type</h2>
              <p className="mt-2 text-sm text-stone-500">
                Select the style that best suits your story.
              </p>

              <div className="mt-8 space-y-4">
                {JEWELRY_TYPES.map((jt) => (
                  <button
                    key={jt.key}
                    onClick={() => {
                      setJewelryType(jt.key);
                      setSize(jt.sizes[Math.floor(jt.sizes.length / 2)]);
                    }}
                    className={`group w-full rounded-xl border p-5 text-left transition-all hover:scale-[1.02] ${
                      jewelryType === jt.key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-serif text-base">{jt.label}</p>
                        <p className="text-xs text-stone-500">
                          {jt.description}
                        </p>
                      </div>
                      {jewelryType === jt.key && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/20">
                          <Check className="h-4 w-4 text-amber-200" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedJewelry && (
                <div className="mt-6">
                  <label className="mb-3 block text-sm font-medium text-stone-300">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedJewelry.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`rounded-lg border px-4 py-2 text-sm transition-all ${
                          size === s
                            ? "border-amber-200/50 bg-amber-200/10 text-amber-200"
                            : "border-stone-700 text-stone-400 hover:border-stone-600"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8">
                <label className="mb-2 block text-sm text-stone-400">
                  Email for order confirmation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 placeholder-stone-600 focus:border-amber-200/50 focus:outline-none transition-colors"
                />
              </div>

              {selectedMaterial && (
                <SpotlightCard className="mt-8">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-stone-400">
                    Order Summary
                  </h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Product</span>
                      <span className="capitalize text-stone-300">
                        {productType} {jewelryType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Material</span>
                      <span className="text-stone-300">
                        {selectedMaterial.name}
                      </span>
                    </div>
                    {size && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Size</span>
                        <span className="text-stone-300">{size}</span>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between border-t border-stone-800 pt-4 text-base font-medium">
                      <span>Total</span>
                      <span className="text-amber-200">
                        ${(selectedMaterial.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              )}

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setStep(3)}
                  className="rounded-lg border border-stone-700 px-6 py-2.5 text-sm text-stone-400 transition-colors hover:border-stone-600"
                >
                  Back
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || !email || !jewelryType || !size}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition-all hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Proceed to Checkout</>
                  )}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Right: Live Preview - Enhanced */}
        <div className="flex flex-col items-center justify-start">
          <div className="sticky top-24 w-full">
            <SpotlightCard className="p-8">
              <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-stone-500">
                Live Preview
              </p>

              <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
                {/* Jewelry shape background */}
                {(!jewelryType || jewelryType === "pendant") && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-56 w-44 rounded-b-full rounded-t-[40%] border-2 border-stone-700/50 transition-colors hover:border-stone-600" />
                  </div>
                )}
                {jewelryType === "bracelet" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full border-2 border-stone-700/50 transition-colors hover:border-stone-600" />
                  </div>
                )}
                {jewelryType === "ring" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-44 w-44 rounded-full border-4 border-stone-700/50 transition-colors hover:border-stone-600" />
                  </div>
                )}

                {/* Waveform overlay */}
                {svgPath ? (
                  <svg
                    viewBox="0 0 200 80"
                    preserveAspectRatio="xMidYMid meet"
                    className="relative z-10 h-16 w-40 animate-shimmer text-amber-200"
                  >
                    <path
                      d={svgPath}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <div className="relative z-10 text-center">
                    <Volume2 className="mx-auto h-8 w-8 text-stone-700" />
                    <p className="mt-2 text-xs text-stone-600">
                      Upload audio to see
                      <br />
                      your waveform
                    </p>
                  </div>
                )}
              </div>

              {/* Material indicator */}
              {selectedMaterial && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-stone-500">Material</p>
                  <p className="mt-1 text-sm font-medium text-amber-200">
                    {selectedMaterial.name}
                  </p>
                </div>
              )}

              {/* Jewelry type indicator */}
              {selectedJewelry && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-stone-500">Style</p>
                  <p className="mt-1 text-sm font-medium text-stone-300">
                    {selectedJewelry.label}
                  </p>
                </div>
              )}
            </SpotlightCard>

            {/* Tips card */}
            <div className="mt-6 rounded-xl border border-stone-800/50 bg-stone-900/20 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
                Tips for best results
              </p>
              <ul className="mt-3 space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-200/60">•</span>
                  <span>Clear recordings work best</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-200/60">•</span>
                  <span>2-10 seconds is the sweet spot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-200/60">•</span>
                  <span>Voices and music both work great</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-200" />
            <p className="mt-4 text-stone-500">Loading...</p>
          </div>
        </div>
      }
    >
      <CreatePageInner />
    </Suspense>
  );
}
