"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { extractWaveform, waveformToSVGPath } from "@/lib/waveform";
import { MATERIALS, type MaterialKey } from "@/lib/stripe";

type ProductType = "soundwave" | "coordinates" | "cityscape";
type JewelryType = "pendant" | "bracelet" | "ring";

const PRODUCT_TYPES: {
  key: ProductType;
  label: string;
  description: string;
}[] = [
  {
    key: "soundwave",
    label: "Soundwave",
    description: "Upload audio to create a unique waveform design",
  },
  {
    key: "coordinates",
    label: "Coordinates",
    description: "Enter the coordinates of a meaningful place",
  },
  {
    key: "cityscape",
    label: "Cityscape",
    description: "Choose a city skyline for your piece",
  },
];

const JEWELRY_TYPES: {
  key: JewelryType;
  label: string;
  sizes: string[];
}[] = [
  { key: "pendant", label: "Pendant", sizes: ["Small", "Medium", "Large"] },
  {
    key: "bracelet",
    label: "Bracelet",
    sizes: ['6"', '6.5"', '7"', '7.5"', '8"'],
  },
  { key: "ring", label: "Ring", sizes: ["5", "6", "7", "8", "9", "10", "11"] },
];

const CITIES = [
  "New York",
  "San Francisco",
  "Chicago",
  "London",
  "Paris",
  "Tokyo",
  "Sydney",
  "Dubai",
  "Toronto",
  "Barcelona",
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
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  const [city, setCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a placeholder waveform for coordinates/cityscape
  const generatePlaceholderWaveform = useCallback(
    (seed: string): number[] => {
      const data: number[] = [];
      for (let i = 0; i < 200; i++) {
        const charCode = seed.charCodeAt(i % seed.length) || 50;
        data.push(
          (Math.sin(i * 0.15 + charCode * 0.1) * 0.4 +
            Math.cos(i * 0.08 + charCode * 0.05) * 0.3 +
            0.5) *
            0.8
        );
      }
      const max = Math.max(...data);
      return data.map((v) => v / (max || 1));
    },
    []
  );

  // Update waveform when coordinates or city changes
  useEffect(() => {
    if (productType === "coordinates" && coordinates.lat && coordinates.lng) {
      setWaveform(
        generatePlaceholderWaveform(`${coordinates.lat},${coordinates.lng}`)
      );
    } else if (productType === "cityscape" && city) {
      setWaveform(generatePlaceholderWaveform(city));
    }
  }, [productType, coordinates, city, generatePlaceholderWaveform]);

  const handleAudioUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAudioFile(file);
    setError(null);

    try {
      const data = await extractWaveform(file, 200);
      setWaveform(data);
    } catch {
      setError(
        "Could not process audio file. Please try a different format (MP3, WAV, M4A)."
      );
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

      if (productType === "coordinates") {
        formData.append(
          "product_data",
          JSON.stringify({
            lat: coordinates.lat,
            lng: coordinates.lng,
          })
        );
      } else if (productType === "cityscape") {
        formData.append("product_data", JSON.stringify({ city }));
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
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const selectedMaterial = material ? MATERIALS[material] : null;
  const selectedJewelry = jewelryType
    ? JEWELRY_TYPES.find((j) => j.key === jewelryType)
    : null;

  const svgPath =
    waveform && waveformToSVGPath(waveform, 800, 200);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:px-8 lg:py-24">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
          Design Studio
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
          Create Your Piece
        </h1>
        <p className="mt-4 text-stone-500">
          Follow the steps below to design your one-of-a-kind jewelry.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mt-12 flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => {
                if (s < step) setStep(s);
              }}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all ${
                s === step
                  ? "bg-amber-200 text-stone-950"
                  : s < step
                    ? "bg-amber-200/20 text-amber-200 cursor-pointer hover:bg-amber-200/30"
                    : "bg-stone-800 text-stone-500"
              }`}
            >
              {s}
            </button>
            {s < 4 && (
              <div
                className={`h-px w-8 sm:w-16 ${s < step ? "bg-amber-200/30" : "bg-stone-800"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {/* Left: Form */}
        <div>
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
                    className={`w-full rounded-xl border p-6 text-left transition-all ${
                      productType === pt.key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700 hover:bg-stone-900/50"
                    }`}
                  >
                    <p className="font-serif text-lg">{pt.label}</p>
                    <p className="mt-1 text-sm text-stone-500">
                      {pt.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Design Input */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">
                {productType === "soundwave" && "Upload Your Sound"}
                {productType === "coordinates" && "Enter Your Coordinates"}
                {productType === "cityscape" && "Choose Your City"}
              </h2>

              <div className="mt-8">
                {productType === "soundwave" && (
                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-700 p-12 transition-colors hover:border-amber-200/30"
                    >
                      <svg
                        className="h-10 w-10 text-stone-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H14.25M12 2.25v12m0 0l-3-3m3 3l3-3"
                        />
                      </svg>
                      <p className="mt-4 text-sm text-stone-400">
                        {audioFile
                          ? audioFile.name
                          : "Click to upload audio (MP3, WAV, M4A)"}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </div>
                )}

                {productType === "coordinates" && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-stone-400">
                        Latitude
                      </label>
                      <input
                        type="text"
                        value={coordinates.lat}
                        onChange={(e) =>
                          setCoordinates((c) => ({
                            ...c,
                            lat: e.target.value,
                          }))
                        }
                        placeholder="e.g. 40.7128"
                        className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 placeholder-stone-600 focus:border-amber-200/50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-stone-400">
                        Longitude
                      </label>
                      <input
                        type="text"
                        value={coordinates.lng}
                        onChange={(e) =>
                          setCoordinates((c) => ({
                            ...c,
                            lng: e.target.value,
                          }))
                        }
                        placeholder="e.g. -74.0060"
                        className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 placeholder-stone-600 focus:border-amber-200/50 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {productType === "cityscape" && (
                  <div className="grid grid-cols-2 gap-3">
                    {CITIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className={`rounded-lg border p-4 text-left text-sm transition-all ${
                          city === c
                            ? "border-amber-200/50 bg-amber-200/5 text-amber-200"
                            : "border-stone-800 text-stone-400 hover:border-stone-700"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
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
                    if (
                      (productType === "soundwave" && waveform) ||
                      (productType === "coordinates" &&
                        coordinates.lat &&
                        coordinates.lng) ||
                      (productType === "cityscape" && city)
                    ) {
                      setStep(3);
                    } else {
                      setError(
                        "Please complete this step before continuing."
                      );
                    }
                  }}
                  className="rounded-lg bg-amber-200 px-6 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Material */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">Choose Your Material</h2>
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
                    className={`rounded-xl border p-6 text-left transition-all ${
                      material === key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <p className="font-serif text-base">{mat.name}</p>
                    <p className="mt-1 text-lg font-medium text-amber-200">
                      ${(mat.price / 100).toFixed(0)}
                    </p>
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
                  className="rounded-lg bg-amber-200 px-6 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-300"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Jewelry Type + Checkout */}
          {step === 4 && (
            <div className="animate-fade-up">
              <h2 className="font-serif text-2xl">Choose Jewelry Type</h2>

              <div className="mt-8 space-y-4">
                {JEWELRY_TYPES.map((jt) => (
                  <button
                    key={jt.key}
                    onClick={() => {
                      setJewelryType(jt.key);
                      setSize(jt.sizes[Math.floor(jt.sizes.length / 2)]);
                    }}
                    className={`w-full rounded-xl border p-5 text-left transition-all ${
                      jewelryType === jt.key
                        ? "border-amber-200/50 bg-amber-200/5"
                        : "border-stone-800 hover:border-stone-700"
                    }`}
                  >
                    <p className="font-serif text-base">{jt.label}</p>
                  </button>
                ))}
              </div>

              {selectedJewelry && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm text-stone-400">
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

              <div className="mt-6">
                <label className="mb-2 block text-sm text-stone-400">
                  Email for order confirmation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-stone-100 placeholder-stone-600 focus:border-amber-200/50 focus:outline-none"
                />
              </div>

              {selectedMaterial && (
                <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6">
                  <h3 className="text-sm font-medium uppercase tracking-wider text-stone-400">
                    Order Summary
                  </h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Product</span>
                      <span className="capitalize">
                        {productType} {jewelryType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Material</span>
                      <span>{selectedMaterial.name}</span>
                    </div>
                    {size && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Size</span>
                        <span>{size}</span>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between border-t border-stone-800 pt-4 text-base font-medium">
                      <span>Total</span>
                      <span className="text-amber-200">
                        ${(selectedMaterial.price / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
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
                  className="flex-1 rounded-lg bg-amber-200 px-6 py-3 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
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

        {/* Right: Live Preview */}
        <div className="flex flex-col items-center justify-start">
          <div className="sticky top-24 w-full">
            <div className="rounded-2xl border border-stone-800/50 bg-stone-900/30 p-8">
              <p className="mb-6 text-center text-xs font-medium uppercase tracking-wider text-stone-500">
                Live Preview
              </p>

              <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
                {/* Jewelry shape background */}
                {(!jewelryType || jewelryType === "pendant") && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-56 w-44 rounded-b-full rounded-t-[40%] border border-stone-700/50" />
                  </div>
                )}
                {jewelryType === "bracelet" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full border border-stone-700/50" />
                  </div>
                )}
                {jewelryType === "ring" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-44 w-44 rounded-full border-4 border-stone-700/50" />
                  </div>
                )}

                {/* Waveform overlay */}
                {svgPath ? (
                  <svg
                    viewBox="0 0 800 200"
                    className="relative z-10 w-48 animate-shimmer text-amber-200"
                  >
                    <path
                      d={svgPath}
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <p className="relative z-10 text-center text-xs text-stone-600">
                    {productType === "soundwave"
                      ? "Upload audio to see your waveform"
                      : productType === "coordinates"
                        ? "Enter coordinates to see preview"
                        : productType === "cityscape"
                          ? "Choose a city to see preview"
                          : "Select a product type to begin"}
                  </p>
                )}
              </div>

              {/* Material indicator */}
              {selectedMaterial && (
                <p className="mt-4 text-center text-xs text-stone-500">
                  {selectedMaterial.name} finish
                </p>
              )}
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
          <p className="text-stone-500">Loading...</p>
        </div>
      }
    >
      <CreatePageInner />
    </Suspense>
  );
}
