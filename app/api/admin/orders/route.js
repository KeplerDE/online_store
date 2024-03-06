import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect(); // Подключаемся к базе данных
  // Парсинг параметров запроса
  const searchParams = queryString.parseUrl(req.url).query;
  console.log("searchParams in admin orders => ", searchParams.page);
  const { page } = searchParams || {};
  const pageSize = 3; // Количество заказов на странице

  try {
    const currentPage = Number(page) || 1; // Текущая страница
    const skip = (currentPage - 1) * pageSize; // Количество заказов для пропуска
    const totalOrders = await Order.countDocuments({}); // Общее количество заказов
    // Получение заказов с пагинацией и сортировкой
    const orders = await Order.find({})
      .populate("userId", "name") // Добавление информации о пользователе к каждому заказу
      .skip(skip) // Пропуск указанного количества заказов
      .limit(pageSize) // Ограничение количества заказов на странице
      .sort({ createdAt: -1 }); // Сортировка заказов по дате создания
    // Ответ с данными о заказах, текущей странице и общем количестве страниц
    return NextResponse.json({
      orders,
      currentPage,
      totalPages: Math.ceil(totalOrders / pageSize),
    }, { status: 200 });
  } catch (err) {
    // В случае ошибки отправляем сообщение об ошибке
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
