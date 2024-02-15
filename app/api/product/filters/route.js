// Импорт необходимых зависимостей
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect"; // Утилита для подключения к БД
import Product from "@/models/product"; // Модель продукта
import queryString from "query-string"; // Для парсинга строки запроса

export async function GET(req) {
  await dbConnect(); // Подключение к базе данных

  // Анализ URL запроса для получения параметров
  const searchParams = queryString.parseUrl(req.url).query;
  // Деструктуризация параметров запроса
  const { page, category, brand, tag, ratings, minPrice, maxPrice } = searchParams || {};
  const pageSize = 6; // Размер страницы для пагинации

  // Инициализация объекта фильтра
  const filter = {};
  // Применение фильтров на основе параметров запроса
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (tag) filter.tags = tag;
  if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };
  
  try {
    // Определение текущей страницы и расчет пропускаемых продуктов для пагинации
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // Получение продуктов с учетом фильтров, сортировка по дате создания
    const allProducts = await Product.find(filter)
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });
    
    // Функция для расчета среднего рейтинга продукта
    const calculateAverageRating = (ratings) => {
      if (ratings.length === 0) return 0;
      let totalRating = 0;
      ratings.forEach((rating) => { totalRating += rating.rating; });
      return totalRating / ratings.length;
    };
    
    // Расчет среднего рейтинга для каждого продукта
    const productsWithAverageRating = allProducts.map((product) => ({
      ...product.toObject(),
      averageRating: calculateAverageRating(product.ratings),
    }));
    
    // Дополнительная фильтрация продуктов по рейтингу
    const filteredProducts = productsWithAverageRating.filter((product) => {
      if (!ratings) return true;
      const targetRating = Number(ratings);
      const difference = product.averageRating - targetRating;
      return difference >= -0.5 && difference <= 0.5; // Разница в рейтинге
    });
    
    // Вычисление общего количества отфильтрованных продуктов
    const totalFilteredProducts = filteredProducts.length;
    // Применение пагинации к отфильтрованным продуктам
    const paginatedProducts = filteredProducts.slice(skip, skip + pageSize);
    
    // Возвращение JSON-ответа с данными о продуктах, текущей странице и общем количестве страниц
    return NextResponse.json({
      products: paginatedProducts,
      currentPage,
      totalPages: Math.ceil(totalFilteredProducts / pageSize),
    }, { status: 200 });
  } catch (err) {
    // Логирование и возвращение ошибки, если она возникла
    console.log("filter products err => ", err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
