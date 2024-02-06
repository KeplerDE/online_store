import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";  
import Category from "@/models/category"; 

export async function GET() {
  await dbConnect();

  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json(err.message, { status: 500 });
  }
}
