// api/admin/product/[id]/route
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Product from "@/models/product";

export async function PUT(req, context) {
  // Устанавливаем соединение с базой данных
  await dbConnect();

  // Разбираем JSON-запрос
  const _req = await req.json();

  try {
    // Обновляем продукт по ID, используя данные из запроса
    const updatedProduct = await Product.findByIdAndUpdate(
      context.params.id, // ID продукта для обновления
      { ..._req }, // Обновляемые данные
      { new: true } // Опция, чтобы получить обновленный продукт
    );

    // Возвращаем обновленный продукт в формате JSON
    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.log(err);
    // В случае ошибки, возвращаем JSON-ответ с сообщением об ошибке и статусом 500
    return NextResponse.json(
      {
        err: err,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  // Устанавливаем соединение с базой данных
  await dbConnect();

  try {
    // Удаляем продукт по ID
    const deletedProduct = await Product.findByIdAndDelete(context.params.id);

    // Возвращаем удаленный продукт в формате JSON
    return NextResponse.json(deletedProduct);
  } catch (err) {
    console.log(err);
    // В случае ошибки, возвращаем JSON-ответ с сообщением об ошибке и статусом 500
    return NextResponse.json(
      {
        err: err.message,
      },
      { status: 500 }
    );
  }
}
