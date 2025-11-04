// app/api/products/route.ts
import { NextResponse } from "next/server";
import { allProducts } from "@/app/data/products";

export async function GET() {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({ products: allProducts });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}