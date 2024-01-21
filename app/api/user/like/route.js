import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product"; 
import { currentUser } from "@/utils/currentUser"; 

export async function PUT(req) {
  await dbConnect(); 

  const user = await currentUser(); 
  const { productId } = await req.json(); 

  try {
    // Обновляем информацию о продукте, добавляя идентификатор пользователя в массив лайков
    const updated = await Product.findByIdAndUpdate(
      productId, // Идентификатор продукта для обновления
      {
        $addToSet: { likes: user._id }, // Добавляем идентификатор пользователя в массив лайков, если его там нет
      },
      { new: true } 
    );
    return NextResponse.json(updated); 
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
