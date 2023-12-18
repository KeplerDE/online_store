import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";  
import Category from "@/models/category";   
import slugify from "slugify";             

// Определяем асинхронную функцию PUT для обработки PUT-запросов
export async function PUT(req, context) {
  // Устанавливаем соединение с базой данных
  await dbConnect();

  // Получаем данные из тела запроса
  const body = await req.json();

  try {
    // Обновляем категорию в базе данных по ID
    // Добавляем или обновляем slug на основе названия категории
    const updatingCategory = await Category.findByIdAndUpdate(
      context.params.id,             // ID категории
      { ...body, slug: slugify(body.name) }, // Обновляемые данные
      { new: true }                  // Опция, указывающая на возврат обновлённого документа
    );

    // Возвращаем обновлённую категорию в виде JSON-ответа
    return NextResponse.json(updatingCategory);
  } catch (err) {
    // В случае ошибки выводим её в консоль
    console.log(err);

    // Возвращаем ответ с сообщением об ошибке и статусом 500 (внутренняя ошибка сервера)
    return NextResponse.json(
      { err: err.message },
      { status: 500 }
    );
  }
}
