import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product"; 

export async function GET(req, context) { 
  await dbConnect(); 

  try { 
    const product = await Product.findOne({ slug: context.params.slug }); // Ищем продукт по его slug в базе данных
    return NextResponse.json(product); // Возвращаем продукт в формате JSON
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
