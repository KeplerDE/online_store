import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect"; 
import Product from "@/models/product";
import Category from "@/models/category"; 
import Tag from "@/models/tag"; 
import queryString from "query-string"; 


// Экспортируем асинхронную функцию для обработки GET запросов
export async function GET(req) {
  await dbConnect(); // Подключаемся к базе данных

  // Извлекаем поисковый запрос продукта из URL запроса
  const { productSearchQuery } = queryString.parseUrl(req.url).query;
  
  try {
    // Поиск категорий и тегов по запросу productSearchQuery
    const [categories, tags] = await Promise.all([
      Category.find({ name: { $regex: productSearchQuery, $options: "i" } }), // Поиск категорий
      Tag.find({ name: { $regex: productSearchQuery, $options: "i" } }), // Поиск тегов
    ]);
    
    // Получаем идентификаторы категорий и тегов
    const categoryIds = categories.map((category) => category._id);
    const tagIds = tags.map((tag) => tag._id);
    
    // Основной запрос поиска продуктов
    const products = await Product.find({
      $or: [
        { title: { $regex: productSearchQuery, $options: "i" } }, // Поиск в заголовках
        { description: { $regex: productSearchQuery, $options: "i" } }, // Поиск в описаниях
        { brand: { $regex: productSearchQuery, $options: "i" } }, // Поиск по бренду
        { category: { $in: categoryIds } }, // Поиск по ID категорий
        { tags: { $in: tagIds } }, // Поиск по ID тегов
      ],
    })
    .populate("category", "name") // Добавляем названия категорий к результатам
    .populate("tags", "name") // Добавляем названия тегов к результатам
    .sort({ createdAt: -1 }); // Сортируем результаты по дате создания, начиная с новейших
    
    return NextResponse.json(products); // Возвращаем найденные продукты в формате JSON
  } catch (err) {
    // В случае ошибки логируем её и возвращаем сообщение об ошибке
    console.log(err);
    return NextResponse.json(
      { err: "Ошибка сервера. Пожалуйста, попробуйте еще раз." },
      { status: 500 }
    );
  }
}
