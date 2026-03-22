import { NextResponse } from "next/server";
import { productService } from "@/services/productService";

// GET: fetch all products
export async function GET() {
  try {
    const products = await productService.getProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: add new product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Basic validation to check required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields: name, price or category" },
        { status: 400 }
      );
    }

    const newProductId = await productService.addProduct(body);
    return NextResponse.json(
      { id: newProductId, message: "Product added successfully", ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}

// DELETE: delete product by id
// Assuming standard query param implementation like: DELETE /api/products?id=123
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required. Example: /api/products?id=123" },
        { status: 400 }
      );
    }

    await productService.deleteProduct(id);
    return NextResponse.json(
      { message: "Product deleted successfully", id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
