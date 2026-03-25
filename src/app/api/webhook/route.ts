import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update order status in Supabase
      const { error: updateError } = await getSupabase()
        .from("orders")
        .update({ status: "paid" })
        .eq("stripe_session_id", session.id);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
        // If no order exists yet (e.g., DB insert failed at checkout),
        // create one from session metadata
        if (session.metadata && session.customer_email) {
          const { error: insertError } = await getSupabase().from("orders").insert({
            email: session.customer_email,
            product_type: session.metadata.product_type,
            product_data: {
              jewelry_type: session.metadata.jewelry_type,
              size: session.metadata.size,
            },
            material: session.metadata.material,
            price: session.amount_total,
            stripe_session_id: session.id,
            status: "paid",
            audio_url: null,
            waveform_svg: null,
          });

          if (insertError) {
            console.error("Failed to create order from webhook:", insertError);
          }
        }
      }

      break;
    }

    default:
      // Unhandled event type - acknowledge receipt
      break;
  }

  return NextResponse.json({ received: true });
}
