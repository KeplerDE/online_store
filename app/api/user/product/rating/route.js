import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { productId, rating, comment } = body;

    // Get the current user
    const user = await currentUser(req);
    if (!user) {
      throw new Error('Authentication required');
    }

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check if the user has already left a rating
    const existingRatingIndex = product.ratings.findIndex(
      (rate) => rate.postedBy.toString() === user._id.toString()
    );

    // Update the existing rating
    if (existingRatingIndex > -1) {
      product.ratings[existingRatingIndex].rating = rating;
      product.ratings[existingRatingIndex].comment = comment;
    } else {
      // If the user has not rated, add a new rating
      product.ratings.push({
        rating,
        comment,
        postedBy: user._id,
      });
    }

    // Save the product with the updated ratings
    const updated = await product.save();

    // Return the updated product
    return NextResponse.json(updated);
    
  } catch (err) {
    console.error(err);
    // Handle different types of errors accordingly
    const status = err.message === 'Authentication required' ? 401 :
                   err.message === 'Product not found' ? 404 : 500;
    return NextResponse.json({
      error: err.message || "Server error. Please try again later",
      status
    });
  }
}
