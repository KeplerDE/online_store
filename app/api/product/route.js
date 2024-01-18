// api/product/route
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/product';
import queryString from 'query-string';

export async function GET(req) {
  try {
    // Подключаемся к базе данных
    await dbConnect();

    // Разбор параметров запроса из URL
    const searchParams = queryString.parseUrl(req.url).query;
    const { page } = searchParams || {};
    const pageSize = 2; // Количество продуктов на странице

    // Определение текущей страницы и сдвига
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;

    // Получение общего количества продуктов и данных продуктов для текущей страницы
    const totalProducts = await Product.countDocuments({});
    const products = await Product.find({})
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: '-1' });

    // Возвращаем продукты и информацию о странице
    return NextResponse.json({
      products,
      currentPage,
      totalPages: Math.ceil(totalProducts / pageSize),
    }, { status: 200 });
  } catch (err) {
    // В случае ошибки выводим ее в консоль и возвращаем ответ с ошибкой
    console.log(err);
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
