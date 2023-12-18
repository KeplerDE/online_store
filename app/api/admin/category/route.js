import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Category from "@/models/category";
import slugify from "slugify";


// Асинхронная функция для обработки POST-запроса
export async function POST(req) {
 const body = await req.json(); // Получаем тело запроса в формате JSON
 await dbConnect();             // Устанавливаем соединение с базой данных

 try {
   const { name } = body; // Извлекаем имя категории из тела запроса
   const category = await Category.create({
     name,               // Имя категории
     slug: slugify(name), // Создаем slug для имени категории
   });

   return NextResponse.json(category); // Возвращаем созданную категорию в формате JSON
 } catch (err) {
   console.log(err); // Выводим ошибку в консоль
   // Возвращаем ошибку клиенту с HTTP-статусом 500 (Internal Server Error)
   return NextResponse.json(
     {
       err: err.message, // Сообщение об ошибке
     },
     { status: 500 }
   );
 }
}
