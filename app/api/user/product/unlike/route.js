import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product"; 
import { currentUser } from "@/utils/currentUser"; 


export async function PUT(req) {
  await dbConnect(); 

  const user = await currentUser(); 

  // Получение ID продукта из запроса
  const { productId } = await req.json(); 

  try {
    // Обновление информации о продукте
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $pull: { likes: user._id } },
      { new: true } 
    );


    return NextResponse.json(updated); 
  } catch (err) {
    console.error("Error in product update:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
