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


export async function DELETE(req, context) {
    // Установка соединения с базой данных
    await dbConnect();
  
    try {
      // Удаление категории по ID, полученному из параметров маршрута
      const deletedCategory = await Category.findByIdAndDelete(context.params.id);
  
      // В случае успешного удаления возвращаем информацию об удаленной категории
      return new Response(JSON.stringify(deletedCategory), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      // В случае ошибки выводим сообщение об ошибке в консоль
      console.error(err);
  
      // Возвращаем ответ с ошибкой и HTTP-статусом 500
      return new Response(JSON.stringify({ error: "Server error. Please try again." }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
  }
  