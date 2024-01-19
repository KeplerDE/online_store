import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product"; 

export async function GET(req, context) { 
  await dbConnect(); 

  try { 
    const product = await Product.findOne({ slug: context.params.slug })
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
    return NextResponse.json(product); 
  } catch (err) { 
    console.log(err); 
    return NextResponse.json(
      {
        err: err.message,
      },
      { status: 500 }
    ); 
  }
}
