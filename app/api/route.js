// api/user/product/unlike/route

import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import { getToken } from "next-auth/jwt";

export async function PUT(req) {
  try {
    // Establish database connection
    await dbConnect();

    // Extract product ID from request body
    const { productId } = await req.json();

    // Get user token
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if token is valid
    if (!token) {
      return NextResponse.json({ error: "Authentication failed." }, { status: 401 });
    }

    // Update product by pulling user ID from likes array
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $pull: { likes: token.user._id } },
      { new: true }
    );

    // Check if product update is successful
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Respond with updated product
    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
