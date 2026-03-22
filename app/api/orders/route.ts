import { NextResponse } from "next/server";
import { orderService } from "@/services/orderService";

export async function GET() {
  try {
    const orders = await orderService.getOrders();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.items || !body.items.length || body.totalAmount === undefined) {
      return NextResponse.json(
        { error: "Invalid order schema provided" },
        { status: 400 }
      );
    }

    const newOrderId = await orderService.createOrder(body);
    
    return NextResponse.json(
      { id: newOrderId, message: "Order placed successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error generating bill/order:", error);
    
    // Pass specific transaction errors down explicitly to the frontend for good UX
    if (error.message && (error.message.includes("Insufficient stock") || error.message.includes("Product not found"))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
