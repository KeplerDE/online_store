import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product"; 
import { currentUser } from "@/utils/currentUser"; 


export async function PUT(req) {
  await dbConnect(); 

  const user = await currentUser(); 
 

  // Получение ID продукта из запроса
  const { productId } = await req.json(); 


  // Проверка на наличие productId и user._id
  if (!productId || !user?._id) {
    console.error("Product ID or User ID is missing");
    return NextResponse.json({ error: "Product ID or User ID is missing" }, { status: 400 });
  }

  try {
    // Обновление информации о продукте
    const updated = await Product.findByIdAndUpdate(
      productId,
      { $addToSet: { likes: user._id } },
      { new: true } 
    );
    console.log("Product updated:", updated);4

    return NextResponse.json(updated); 
  } catch (err) {
    console.error("Error in product update:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
