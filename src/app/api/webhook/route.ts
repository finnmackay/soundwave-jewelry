import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabase } from "@/lib/supabase";
import { submitToProtoLabs } from "@/lib/protolabs";
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

      // Extract shipping address from session
      const shipping = (session as any).shipping_details;
      const shippingAddress = shipping ? {
        name: shipping.name,
        line1: shipping.address?.line1,
        line2: shipping.address?.line2,
        city: shipping.address?.city,
        state: shipping.address?.state,
        postal_code: shipping.address?.postal_code,
        country: shipping.address?.country,
      } : null;

      // Update order status in Supabase
      const { error: updateError } = await getSupabase()
        .from("orders")
        .update({ 
          status: "paid",
          shipping_address: shippingAddress,
        })
        .eq("stripe_session_id", session.id);

      if (updateError) {
        console.error("Failed to update order status:", updateError);
      }

      // Get the full order details for Proto Labs submission
      const { data: order } = await getSupabase()
        .from("orders")
        .select("id, email, product_type, material, waveform_svg")
        .eq("stripe_session_id", session.id)
        .single();

      // Submit to Proto Labs for manufacturing
      if (order && shippingAddress) {
        console.log("Submitting order to Proto Labs:", order.id);
        
        const protoResult = await submitToProtoLabs({
          orderId: order.id,
          email: order.email,
          shippingAddress: shippingAddress as any,
          productType: order.product_type,
          material: order.material,
          waveformSvg: order.waveform_svg,
        });

        if (protoResult.success) {
          console.log("Proto Labs order created:", protoResult.protoLabsOrderId);
        } else {
          console.error("Proto Labs submission failed:", protoResult.error);
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
