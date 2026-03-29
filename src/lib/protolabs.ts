import { getSupabase } from "@/lib/supabase";

const PROTO_LABS_API_KEY = process.env.PROTO_LABS_API_KEY;
const PROTO_LABS_API_URL = "https://api.protolabs.com/v1";

interface ProtoLabsOrder {
  orderId: string;
  email: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  productType: string;
  material: string;
  waveformSvg: string | null;
}

/**
 * Submit order to Proto Labs for CNC manufacturing
 * Converts waveform SVG to manufacturing specs and sends to Proto Labs API
 */
export async function submitToProtoLabs(order: ProtoLabsOrder): Promise<{ success: boolean; protoLabsOrderId?: string; error?: string }> {
  try {
    if (!PROTO_LABS_API_KEY) {
      console.error("PROTO_LABS_API_KEY not configured");
      return { success: false, error: "Proto Labs API not configured" };
    }

    // Map material to Proto Labs material codes
    const materialMap: Record<string, string> = {
      "stainless-steel": " stainless_steel_316L",
      "sterling-silver": "silver_925",
      "brass": "brass_360",
      "bronze": "bronze_220",
    };

    const protoMaterial = materialMap[order.material] || "stainless_steel_316L";

    // Create manufacturing specification from waveform SVG
    // In production, this would convert SVG to proper CAD format (STL/STEP)
    const manufacturingSpec = {
      product_name: `Soundwave ${order.productType}`,
      material: protoMaterial,
      finish: "polished",
      quantity: 1,
      // SVG would be converted to 3D model or 2D cutting path
      design_file: order.waveformSvg, // Base64 encoded SVG or URL
      design_type: "2d_cutting", // or "3d_cnc" depending on product
      dimensions: {
        width: 30, // mm
        height: 20, // mm
        thickness: 2, // mm
      },
    };

    // Submit quote request to Proto Labs
    const quoteResponse = await fetch(`${PROTO_LABS_API_URL}/quotes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROTO_LABS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...manufacturingSpec,
        shipping_address: order.shippingAddress,
      }),
    });

    if (!quoteResponse.ok) {
      const error = await quoteResponse.text();
      console.error("Proto Labs quote failed:", error);
      return { success: false, error: `Quote failed: ${error}` };
    }

    const quote = await quoteResponse.json();
    console.log("Proto Labs quote received:", quote);

    // Auto-accept quote and place order
    const orderResponse = await fetch(`${PROTO_LABS_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROTO_LABS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quote_id: quote.id,
        shipping_address: order.shippingAddress,
        customer_email: order.email,
        // Payment would be handled separately or via Proto Labs billing
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.text();
      console.error("Proto Labs order failed:", error);
      return { success: false, error: `Order failed: ${error}` };
    }

    const protoOrder = await orderResponse.json();
    console.log("Proto Labs order created:", protoOrder);

    // Update order in Supabase with Proto Labs order ID
    await getSupabase()
      .from("orders")
      .update({
        proto_labs_order_id: protoOrder.id,
        proto_labs_status: "submitted",
        status: "manufacturing",
      })
      .eq("order_id", order.orderId);

    return { success: true, protoLabsOrderId: protoOrder.id };

  } catch (err) {
    console.error("Proto Labs submission error:", err);
    return { success: false, error: String(err) };
  }
}

/**
 * Check order status at Proto Labs
 */
export async function checkProtoLabsStatus(protoLabsOrderId: string): Promise<{ status: string; trackingNumber?: string } | null> {
  try {
    const response = await fetch(`${PROTO_LABS_API_URL}/orders/${protoLabsOrderId}`, {
      headers: {
        "Authorization": `Bearer ${PROTO_LABS_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to check Proto Labs status");
      return null;
    }

    const data = await response.json();
    
    // Update Supabase with latest status
    await getSupabase()
      .from("orders")
      .update({
        proto_labs_status: data.status,
        tracking_number: data.tracking_number,
        status: data.status === "shipped" ? "shipped" : "manufacturing",
      })
      .eq("proto_labs_order_id", protoLabsOrderId);

    return {
      status: data.status,
      trackingNumber: data.tracking_number,
    };

  } catch (err) {
    console.error("Proto Labs status check error:", err);
    return null;
  }
}

/**
 * Poll all pending Proto Labs orders for status updates
 * Should be called via cron job every hour
 */
export async function syncAllProtoLabsOrders(): Promise<void> {
  const { data: orders, error } = await getSupabase()
    .from("orders")
    .select("proto_labs_order_id")
    .not("proto_labs_order_id", "is", null)
    .in("proto_labs_status", ["submitted", "in_production", "quality_check"]);

  if (error || !orders) {
    console.error("Failed to fetch Proto Labs orders:", error);
    return;
  }

  for (const order of orders) {
    await checkProtoLabsStatus(order.proto_labs_order_id);
  }
}
