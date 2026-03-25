import { NextRequest, NextResponse } from "next/server";
import { getStripe, MATERIALS, type MaterialKey } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { generateWaveformSVG } from "@/lib/waveform";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const productType = formData.get("product_type") as string;
    const material = formData.get("material") as MaterialKey;
    const jewelryType = formData.get("jewelry_type") as string;
    const size = formData.get("size") as string;
    const email = formData.get("email") as string;
    const waveformRaw = formData.get("waveform") as string | null;
    const productDataRaw = formData.get("product_data") as string | null;
    const audioFile = formData.get("audio") as File | null;

    // Validate required fields
    if (!productType || !material || !jewelryType || !size || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate material
    if (!(material in MATERIALS)) {
      return NextResponse.json(
        { error: "Invalid material selected" },
        { status: 400 }
      );
    }

    const materialInfo = MATERIALS[material];
    const waveform = waveformRaw ? JSON.parse(waveformRaw) : null;
    const productData = productDataRaw
      ? JSON.parse(productDataRaw)
      : { type: productType };

    // Generate SVG if waveform exists
    let waveformSvg: string | null = null;
    if (waveform && Array.isArray(waveform)) {
      waveformSvg = generateWaveformSVG(waveform);
    }

    // Upload audio to Supabase Storage if provided
    let audioUrl: string | null = null;
    if (audioFile) {
      const fileName = `${Date.now()}-${audioFile.name}`;
      const arrayBuffer = await audioFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await getSupabase().storage
        .from("audio-files")
        .upload(fileName, buffer, {
          contentType: audioFile.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Audio upload error:", uploadError);
        // Continue without audio URL - non-blocking
      } else if (uploadData) {
        const {
          data: { publicUrl },
        } = getSupabase().storage.from("audio-files").getPublicUrl(uploadData.path);
        audioUrl = publicUrl;
      }
    }

    // Create Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: materialInfo.currency,
            product_data: {
              name: `${materialInfo.name} ${productType.charAt(0).toUpperCase() + productType.slice(1)} ${jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}`,
              description: `Custom ${productType} ${jewelryType} in ${materialInfo.name}, size ${size}`,
            },
            unit_amount: materialInfo.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create`,
      metadata: {
        product_type: productType,
        material,
        jewelry_type: jewelryType,
        size,
      },
    });

    // Save order to Supabase
    const { error: dbError } = await getSupabase().from("orders").insert({
      email,
      product_type: productType,
      product_data: {
        ...productData,
        jewelry_type: jewelryType,
        size,
      },
      material,
      price: materialInfo.price,
      stripe_session_id: session.id,
      status: "pending",
      audio_url: audioUrl,
      waveform_svg: waveformSvg,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the checkout if DB save fails - Stripe webhook will handle it
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
