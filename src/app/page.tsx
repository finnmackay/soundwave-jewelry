import Link from "next/link";

function WaveformDecoration({ className }: { className?: string }) {
  // A decorative static waveform SVG
  const bars = Array.from({ length: 60 }, (_, i) => {
    const x = i * 13 + 6;
    const h =
      Math.sin(i * 0.3) * 30 +
      Math.sin(i * 0.7) * 20 +
      Math.cos(i * 0.15) * 15 +
      50;
    return `M${x},${100 - h / 2} L${x},${100 + h / 2}`;
  }).join(" ");

  return (
    <svg
      viewBox="0 0 800 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={bars}
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden">
        {/* Background waveform decoration */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <WaveformDecoration className="w-[120%] max-w-none text-amber-200" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="animate-fade-up text-sm font-medium uppercase tracking-[0.3em] text-amber-300/80">
              Grounded Sound
            </p>
            <h1 className="animate-fade-up-delay-1 mt-6 font-serif text-5xl leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Turn your most meaningful sounds into{" "}
              <span className="text-amber-200">wearable art</span>
            </h1>
            <p className="animate-fade-up-delay-2 mt-8 text-lg leading-relaxed text-stone-400 sm:text-xl">
              A baby&apos;s first laugh. Your wedding vows. The song that
              changed everything. We transform the waveform of your sound into a
              one-of-a-kind piece of jewelry.
            </p>
            <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/create"
                className="rounded-full bg-amber-200 px-8 py-3.5 text-base font-semibold text-stone-950 shadow-lg shadow-amber-200/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30"
              >
                Create Yours
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-stone-400 transition-colors hover:text-stone-200"
              >
                See how it works &darr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-stone-800/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              The Process
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              How It Works
            </h2>
          </div>

          <div className="mt-20 grid gap-16 sm:grid-cols-3 sm:gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Sound",
                description:
                  "Record or upload the audio that means the most to you. A voice memo, a song clip, a heartbeat -- anything.",
              },
              {
                step: "02",
                title: "Choose Your Material",
                description:
                  "Select from stainless steel, sterling silver, brass, or bronze. Each material brings its own character to your piece.",
              },
              {
                step: "03",
                title: "We Craft It",
                description:
                  "Our artisans transform your sound's waveform into a precise, wearable piece of jewelry. Delivered to your door.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-200/30 text-lg font-serif text-amber-200">
                  {item.step}
                </div>
                <h3 className="mt-6 font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="border-t border-stone-800/50 bg-stone-900/30"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              Collections
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              What We Create
            </h2>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            {[
              {
                title: "Soundwave Pendant",
                description:
                  "Your audio's waveform etched onto a pendant. The shape of sound, worn close to your heart.",
                price: "From $49",
                type: "soundwave",
              },
              {
                title: "Coordinate Jewelry",
                description:
                  "The exact coordinates of your special place, encoded into an elegant piece you'll never take off.",
                price: "From $49",
                type: "coordinates",
              },
              {
                title: "Cityscape Ring",
                description:
                  "The skyline of your city sculpted into a ring band. Carry your home wherever you go.",
                price: "From $49",
                type: "cityscape",
              },
            ].map((product) => (
              <div
                key={product.type}
                className="group rounded-2xl border border-stone-800/50 bg-stone-900/50 p-8 transition-all hover:border-amber-200/20 hover:bg-stone-900/80"
              >
                {/* Placeholder visual */}
                <div className="flex h-48 items-center justify-center rounded-xl bg-stone-800/30">
                  <WaveformDecoration className="w-3/4 text-amber-200/30 transition-colors group-hover:text-amber-200/50" />
                </div>
                <h3 className="mt-6 font-serif text-xl">{product.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-amber-200/80">
                    {product.price}
                  </span>
                  <Link
                    href={`/create?type=${product.type}`}
                    className="text-sm font-medium text-stone-400 transition-colors hover:text-amber-200"
                  >
                    Customize &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emotional Storytelling */}
      <section className="border-t border-stone-800/50">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <h2 className="font-serif text-3xl leading-snug sm:text-4xl lg:text-5xl">
            Baby&apos;s first word.
            <br />
            <span className="text-amber-200">Wedding vows.</span>
            <br />
            Your pet&apos;s bark.
            <br />
            <span className="text-stone-500">A loved one&apos;s voice.</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-stone-500">
            Every sound tells a story. We turn that story into something you can
            touch, hold, and wear every day. Because some moments deserve to
            last forever.
          </p>
          <Link
            href="/create"
            className="mt-10 inline-block rounded-full border border-amber-200/30 px-8 py-3 text-sm font-medium text-amber-200 transition-all hover:border-amber-200 hover:bg-amber-200/10"
          >
            Start Creating
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-stone-800/50 bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              Love Notes
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              What Our Customers Say
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              {
                quote:
                  "I had my daughter's first 'mama' turned into a pendant. I wear it every single day. It's the most meaningful piece of jewelry I own.",
                name: "Sarah M.",
                detail: "Soundwave Pendant, Sterling Silver",
              },
              {
                quote:
                  "My wife and I got matching bracelets with our wedding vows. It's become our anniversary tradition to listen to the recording together.",
                name: "David K.",
                detail: "Soundwave Bracelet, Brass",
              },
              {
                quote:
                  "After losing my dog, I had his bark made into a ring. It sounds strange, but it brings me so much comfort to carry him with me.",
                name: "Jamie L.",
                detail: "Soundwave Ring, Stainless Steel",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-2xl border border-stone-800/50 bg-stone-950/50 p-8"
              >
                <p className="text-sm leading-relaxed text-stone-400">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6">
                  <p className="text-sm font-medium text-stone-200">
                    {testimonial.name}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-600">
                    {testimonial.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-stone-800/50">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              Questions
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              Frequently Asked
            </h2>
          </div>

          <div className="mt-16 space-y-8">
            {[
              {
                q: "What kind of audio files can I upload?",
                a: "We accept MP3, WAV, M4A, OGG, and most common audio formats. Recordings can be anywhere from 1 second to a few minutes. The waveform is generated from the entire clip.",
              },
              {
                q: "How long does it take to receive my piece?",
                a: "Each piece is individually crafted. Most orders ship within 10-14 business days. You'll receive tracking information as soon as it's on its way.",
              },
              {
                q: "Can I preview the waveform before purchasing?",
                a: "Absolutely. When you upload your sound in our creation tool, you'll see a live preview of the waveform and how it will look on your chosen jewelry type.",
              },
              {
                q: "What if I'm not happy with my piece?",
                a: "We offer a 30-day satisfaction guarantee. If your piece doesn't meet your expectations, reach out to us and we'll make it right.",
              },
              {
                q: "Is the audio stored securely?",
                a: "Yes. Your audio is encrypted and stored securely. We only use it to generate your waveform and can delete it upon request after your order is complete.",
              },
            ].map((faq) => (
              <div
                key={faq.q}
                className="border-b border-stone-800/50 pb-8"
              >
                <h3 className="font-serif text-lg text-stone-100">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-stone-800/50 bg-stone-900/30">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl">
            Your sound. Your story.
            <br />
            <span className="text-amber-200">Your jewelry.</span>
          </h2>
          <p className="mt-6 text-stone-500">
            Ready to transform a moment into something you can wear forever?
          </p>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-amber-200 px-10 py-4 text-base font-semibold text-stone-950 shadow-lg shadow-amber-200/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30"
          >
            Create Yours Now
          </Link>
        </div>
      </section>
    </div>
  );
}
