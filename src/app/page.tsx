import Link from "next/link";
import {
  HeroParticles,
  SpotlightCard,
  FAQAccordion,
  TestimonialCard,
  TrustBadges,
  FeatureHighlights,
  CTASection,
  GradientText,
} from "@/components";
import {
  Shield,
  Truck,
  Heart,
  Clock,
  Upload,
  Palette,
  Gem,
  Sparkles,
} from "lucide-react";

function WaveformDecoration({ className }: { className?: string }) {
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
  const trustBadges = [
    {
      icon: <Shield className="h-5 w-5" />,
      label: "Secure Payment",
      sublabel: "256-bit encryption",
    },
    {
      icon: <Truck className="h-5 w-5" />,
      label: "Free Shipping",
      sublabel: "On all orders",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Handcrafted",
      sublabel: "With love & care",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "10-14 Day Delivery",
      sublabel: "Tracked shipping",
    },
  ];

  const features = [
    {
      icon: <Upload className="h-7 w-7" />,
      title: "Upload Your Sound",
      description:
        "Record or upload any audio that matters to you. A voice memo, a song, a heartbeat—anything.",
    },
    {
      icon: <Palette className="h-7 w-7" />,
      title: "Visual Preview",
      description:
        "See exactly how your waveform will look before you buy. Real-time preview as you customize.",
    },
    {
      icon: <Gem className="h-7 w-7" />,
      title: "Choose Material",
      description:
        "Select from premium materials: stainless steel, sterling silver, brass, or bronze.",
    },
  ];

  const testimonials = [
    {
      quote:
        "I had my daughter's first 'mama' turned into a pendant. I wear it every single day. It's the most meaningful piece of jewelry I own.",
      author: "Sarah M.",
      detail: "Soundwave Pendant, Sterling Silver",
      rating: 5,
    },
    {
      quote:
        "My wife and I got matching bracelets with our wedding vows. It's become our anniversary tradition to listen to the recording together.",
      author: "David K.",
      detail: "Soundwave Bracelet, Brass",
      rating: 5,
    },
    {
      quote:
        "After losing my dog, I had his bark made into a ring. It sounds strange, but it brings me so much comfort to carry him with me.",
      author: "Jamie L.",
      detail: "Soundwave Ring, Stainless Steel",
      rating: 5,
    },
  ];

  const faqItems = [
    {
      question: "What kind of audio files can I upload?",
      answer:
        "We accept MP3, WAV, M4A, OGG, and most common audio formats. Recordings can be anywhere from 1 second to a few minutes. The waveform is generated from the entire clip.",
    },
    {
      question: "How long does it take to receive my piece?",
      answer:
        "Each piece is individually crafted. Most orders ship within 10-14 business days. You'll receive tracking information as soon as it's on its way.",
    },
    {
      question: "Can I preview the waveform before purchasing?",
      answer:
        "Absolutely. When you upload your sound in our creation tool, you'll see a live preview of the waveform and how it will look on your chosen jewelry type.",
    },
    {
      question: "What if I'm not happy with my piece?",
      answer:
        "We offer a 30-day satisfaction guarantee. If your piece doesn't meet your expectations, reach out to us and we'll make it right.",
    },
    {
      question: "Is the audio stored securely?",
      answer:
        "Yes. Your audio is encrypted and stored securely. We only use it to generate your waveform and can delete it upon request after your order is complete.",
    },
  ];

  return (
    <div>
      {/* Hero Section - Enhanced */}
      <section className="relative flex min-h-[95vh] items-center overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <HeroParticles />
        </div>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <WaveformDecoration className="w-[140%] max-w-none text-amber-200" />
        </div>

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-stone-950" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}
            <p className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-amber-200/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-300/80">
              <Sparkles className="h-3 w-3" />
              Your Sound, Eternal
            </p>

            {/* Headline */}
            <h1 className="animate-fade-up-delay-1 mt-8 font-serif text-5xl leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your most meaningful sounds into{" "}
              <GradientText>wearable art</GradientText>
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-up-delay-2 mt-8 text-lg leading-relaxed text-stone-400 sm:text-xl max-w-2xl mx-auto">
              A baby&apos;s first laugh. Your wedding vows. The song that
              changed everything. We transform the waveform of your sound into a
              one-of-a-kind piece of jewelry.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-up-delay-3 mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/create"
                className="group relative rounded-full bg-amber-200 px-8 py-4 text-base font-semibold text-stone-950 shadow-lg shadow-amber-200/20 transition-all hover:bg-amber-300 hover:shadow-amber-300/30 hover:scale-105"
              >
                <span className="relative z-10">Create Yours</span>
                <div className="absolute inset-0 -z-10 rounded-full bg-amber-300 opacity-0 blur-xl transition-opacity group-hover:opacity-50" />
              </Link>
              <a
                href="#how-it-works"
                className="group flex items-center gap-2 text-sm font-medium text-stone-400 transition-colors hover:text-stone-200"
              >
                See how it works
                <span className="transition-transform group-hover:translate-y-1">
                  ↓
                </span>
              </a>
            </div>

            {/* Trust badges below CTA */}
            <div className="animate-fade-up-delay-3 mt-16">
              <TrustBadges badges={trustBadges} columns={4} />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced with Feature Highlights */}
      <section id="how-it-works" className="border-t border-stone-800/50">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              The Process
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-500">
              Creating your personalized jewelry is simple. Three steps to a
              timeless keepsake.
            </p>
          </div>

          <div className="mt-20">
            <FeatureHighlights features={features} />
          </div>
        </div>
      </section>

      {/* Products Section - Enhanced with Spotlight Cards */}
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
            <p className="mx-auto mt-4 max-w-2xl text-stone-500">
              Each piece is uniquely crafted from your sound. Choose the style
              that speaks to you.
            </p>
          </div>

          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <SpotlightCard className="group">
              <div className="flex h-48 items-center justify-center rounded-xl bg-stone-800/30 transition-colors group-hover:bg-stone-800/50">
                <WaveformDecoration className="w-3/4 text-amber-200/30 transition-all duration-500 group-hover:text-amber-200/60 group-hover:scale-105" />
              </div>
              <h3 className="mt-6 font-serif text-xl">Soundwave Pendant</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                Your audio&apos;s waveform etched onto a pendant. The shape of
                sound, worn close to your heart.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-amber-200/80">From $49</span>
                <Link
                  href="/create?type=soundwave"
                  className="text-sm font-medium text-stone-400 transition-colors hover:text-amber-200"
                >
                  Customize →
                </Link>
              </div>
            </SpotlightCard>

            <SpotlightCard className="group">
              <div className="flex h-48 items-center justify-center rounded-xl bg-stone-800/30 transition-colors group-hover:bg-stone-800/50">
                <WaveformDecoration className="w-3/4 text-amber-200/30 transition-all duration-500 group-hover:text-amber-200/60 group-hover:scale-105" />
              </div>
              <h3 className="mt-6 font-serif text-xl">Coordinate Jewelry</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                The exact coordinates of your special place, encoded into an
                elegant piece you&apos;ll never take off.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-amber-200/80">From $49</span>
                <Link
                  href="/create?type=coordinates"
                  className="text-sm font-medium text-stone-400 transition-colors hover:text-amber-200"
                >
                  Customize →
                </Link>
              </div>
            </SpotlightCard>

            <SpotlightCard className="group">
              <div className="flex h-48 items-center justify-center rounded-xl bg-stone-800/30 transition-colors group-hover:bg-stone-800/50">
                <WaveformDecoration className="w-3/4 text-amber-200/30 transition-all duration-500 group-hover:text-amber-200/60 group-hover:scale-105" />
              </div>
              <h3 className="mt-6 font-serif text-xl">Cityscape Ring</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-500">
                The skyline of your city sculpted into a ring band. Carry your
                home wherever you go.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-amber-200/80">From $49</span>
                <Link
                  href="/create?type=cityscape"
                  className="text-sm font-medium text-stone-400 transition-colors hover:text-amber-200"
                >
                  Customize →
                </Link>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* Emotional Storytelling - Enhanced */}
      <section className="border-t border-stone-800/50">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8 lg:py-32">
          <h2 className="font-serif text-3xl leading-snug sm:text-4xl lg:text-5xl">
            Baby&apos;s first word.
            <br />
            <GradientText>Wedding vows.</GradientText>
            <br />
            Your pet&apos;s bark.
            <br />
            <span className="text-stone-600">A loved one&apos;s voice.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-stone-500">
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

      {/* Testimonials - Enhanced with Testimonial Cards */}
      <section className="border-t border-stone-800/50 bg-stone-900/30">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              Love Notes
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-500">
              Join thousands who have turned their precious moments into
              wearable memories.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                author={testimonial.author}
                detail={testimonial.detail}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ - Enhanced with Accordion */}
      <section id="faq" className="border-t border-stone-800/50">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300/70">
              Questions
            </p>
            <h2 className="mt-4 font-serif text-3xl sm:text-4xl">
              Frequently Asked
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-500">
              Everything you need to know about creating your custom soundwave
              jewelry.
            </p>
          </div>

          <div className="mt-16">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* Final CTA - Using CTASection component */}
      <CTASection
        title="Your sound. Your story."
        highlightedText="Your jewelry."
        subtitle="Ready to transform a moment into something you can wear forever?"
        primaryButton={{ text: "Create Yours Now", href: "/create" }}
        secondaryButton={{ text: "View Examples →", href: "#products" }}
      />
    </div>
  );
}
