// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock database - in a real app, you'd connect to a database
let wishlistItems: any[] = [
  {
    id: "19",
    p_Name: "Peacock Feather Rangoli",
    thumbnail: "https://images.pexels.com/photos/1109197/pexels-photo-1109197.jpeg",
    category_id: "rangoli",
    price: "375.00",
    discount: 12,
    isTrending: true,
    is_in_wishlist: true,
  },
  {
    id: "20",
    p_Name: "Traditional Diya Rangoli",
    thumbnail: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg",
    category_id: "rangoli",
    price: "450.00",
    discount: 15,
    isTrending: false,
    is_in_wishlist: true,
  },
  {
    id: "21",
    p_Name: "Floral Mandala Design",
    thumbnail: "https://images.pexels.com/photos/14741323/pexels-photo-14741323.jpeg",
    category_id: "rangoli",
    price: "525.00",
    discount: 8,
    isTrending: true,
    is_in_wishlist: true,
  },
  {
    id: "27",
    p_Name: "Swastika Design Rangoli",
    thumbnail: "https://images.pexels.com/photos/1089439/pexels-photo-1089439.jpeg",
    category_id: "rangoli",
    price: "350.00",
    discount: 18,
    isTrending: true,
    is_in_wishlist: true,
  },
  {
    id: "28",
    p_Name: "Diwali Special Rangoli",
    thumbnail: "https://images.pexels.com/photos/1089445/pexels-photo-1089445.jpeg",
    category_id: "rangoli",
    price: "750.00",
    discount: 30,
    isTrending: true,
    is_in_wishlist: true,
  },
];

export async function GET() {
  return NextResponse.json(wishlistItems);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (id) {
    wishlistItems = wishlistItems.filter(item => item.id !== id);
    return NextResponse.json({ success: true });
  } else {
    // Clear all items
    wishlistItems = [];
    return NextResponse.json({ success: true });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id } = body;
  
  // In a real app, you would add the item to the wishlist
  // For now, we'll just return success
  return NextResponse.json({ success: true });
}