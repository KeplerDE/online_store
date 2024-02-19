// api/search/products/route
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";
import Category from "@/models/category";
import Tag from "@/models/tag";
import queryString from "query-string";

export async function GET(req) {
  try {
    await dbConnect();
    const { productSearchQuery } = queryString.parseUrl(req.url).query;

    // Ensure productSearchQuery is a string before proceeding
    if (typeof productSearchQuery !== 'string') {
      return new NextResponse(
        JSON.stringify({ err: "Query must be a string." }),
        { status: 400 }
      );
    }

    // Search for categories and tags based on the productSearchQuery
    const [categories, tags] = await Promise.all([
      Category.find({ name: new RegExp(productSearchQuery, "i") }),
      Tag.find({ name: new RegExp(productSearchQuery, "i") }),
    ]);

    const categoryIds = categories.map(category => category._id);
    const tagIds = tags.map(tag => tag._id);

    // Main product search query
    const products = await Product.find({
      $or: [
        { title: new RegExp(productSearchQuery, "i") },
        { description: new RegExp(productSearchQuery, "i") },
        { brand: new RegExp(productSearchQuery, "i") },
        { category: { $in: categoryIds } },
        { tags: { $in: tagIds } },
      ],
    })
    .populate("category", "name")
    .populate("tags", "name")
    .sort({ createdAt: -1 });

    return new NextResponse(JSON.stringify(products), { status: 200 });
  } catch (err) {
    console.error(err);
    return new NextResponse(
      JSON.stringify({ err: "Server error. Please try again." }),
      { status: 500 }
    );
  }
}
