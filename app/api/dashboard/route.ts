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
    
    let totalRevenue = 0;
    const revenueMap: Record<string, number> = {};
    const productSales: Record<string, number> = {};

    orders.forEach((order) => {
      totalRevenue += Number(order.totalAmount) || 0;
      
      // Extract chronological standard format YYYY-MM-DD
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      revenueMap[date] = (revenueMap[date] || 0) + (Number(order.totalAmount) || 0);

      order.items.forEach((item) => {
        productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
      });
    });

    // Identify threshold products requiring restocks
    const lowStockProducts = products.filter(product => product.stock < 5);

    // Compute derived mapped arrays for frontend Recharts rendering protocols
    const revenuePerDay = Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topSellingProducts = Object.entries(productSales)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      revenuePerDay,
      topSellingProducts
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error generating dashboard API payload: ", error);
    return NextResponse.json(
      { error: "Failed to compile dashboard analytics payload." }, 
      { status: 500 }
    );
  }
}
