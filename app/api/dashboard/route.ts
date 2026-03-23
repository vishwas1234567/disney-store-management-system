import { NextResponse } from "next/server";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";

// Ensures this route generates dynamic requests rather than caching stale dashboard limits
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fetch all records concurrently for performance
    const [products, orders] = await Promise.all([
      productService.getProducts(),
      orderService.getOrders()
    ]);

    // Calculate Dashboard Statistics
    const totalProducts = products.length;
    const totalOrders = orders.length;
    
    // Sum all historical totalAmounts 
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Identify threshold products requiring restocks
    const lowStockProducts = products.filter(product => product.stock < 5);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error generating dashboard API payload: ", error);
    return NextResponse.json(
      { error: "Failed to compile dashboard analytics payload." }, 
      { status: 500 }
    );
  }
}
