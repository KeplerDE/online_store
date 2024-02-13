import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect'; // Утилита для подключения к базе данных
import Product from '@/models/product'; // Модель продукта
import { parseUrl } from 'query-string'; // Функция для парсинга URL

// Асинхронная функция для обработки GET-запросов
export async function handleGetRequest(req) {
  // Подключение к базе данных
  await dbConnect();

  // Извлечение и парсинг параметров запроса из URL
  const { query: { page, category, brand, tag, ratings, minPrice, maxPrice } = {} } = parseUrl(req.url);

  // Установка размера страницы по умолчанию и инициализация критериев фильтрации
  const pageSize = 6;
  const filterCriteria = {};

  // Заполнение критериев фильтрации на основе предоставленных параметров запроса
  if (category) filterCriteria.category = category;
  if (brand) filterCriteria.brand = brand;
  if (tag) filterCriteria.tags = tag;
  if (minPrice && maxPrice) {
    filterCriteria.price = { $gte: minPrice, $lte: maxPrice };
  }

  try {
    // Расчет значений для пагинации
    const currentPage = Number(page) || 1;
    const skipAmount = (currentPage - 1) * pageSize;

    // Получение всех продуктов, соответствующих заданным фильтрам
    const allProducts = await Product.find(filterCriteria)
      .populate('category', 'name') // Добавление информации о категории
      .populate('tags', 'name') // Добавление информации о тегах
      .sort({ createdAt: -1 }); // Сортировка по дате создания

    // Функция для расчета среднего рейтинга каждого продукта
    const calculateAverageRating = (ratings) => {
      if (ratings.length === 0) return 0;
      let totalRating = ratings.reduce((acc, { rating }) => acc + rating, 0);
      return totalRating / ratings.length;
    };

    // Расчет среднего рейтинга для каждого продукта
    const productsWithAverageRating = allProducts.map((product) => ({
      ...product.toObject(),
      averageRating: calculateAverageRating(product.ratings),
    }));

    // Фильтрация продуктов на основе параметра рейтинга
    const filteredProducts = productsWithAverageRating.filter((product) => {
      if (!ratings) return true; // Фильтр по рейтингу не применен
      const targetRating = Number(ratings);
      const ratingDifference = product.averageRating - targetRating;
      return ratingDifference >= -0.5 && ratingDifference <= 0.5; // Диапазон [3.5 до 4.5] для целевого рейтинга 4
    });

    // Определение общего количества отфильтрованных продуктов
    const totalFilteredProducts = filteredProducts.length;

    // Применение пагинации к отфильтрованным продуктам
    const paginatedProducts = filteredProducts.slice(skipAmount, skipAmount + pageSize);

    // Возвращение данных о продуктах с пагинацией в формате JSON
    return NextResponse.json({
      products: paginatedProducts,
      currentPage,
      totalPages: Math.ceil(totalFilteredProducts / pageSize),
    }, { status: 200 });
  } catch (err) {
    // Обработка ошибок и возвращение ответа с ошибкой
    console.error('Ошибка фильтрации продуктов =>', err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
