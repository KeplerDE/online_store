import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Product from '@/models/product';
import slugify from 'slugify';

export async function POST(req) {
  try {
    // Получаем данные запроса
    const requestData = await req.json();

    // Подключение к базе данных
    await dbConnect();

    // Создаем новый продукт с использованием модели Product
    const product = await Product.create({
      ...requestData,
      slug: slugify(requestData.title), // Генерируем уникальный slug из названия продукта
    });

    // Возвращаем созданный продукт в виде JSON-ответа
    return NextResponse.json(product);
  } catch (err) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
