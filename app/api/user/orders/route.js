import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Order from '@/models/order';
import { currentUser } from '@/utils/currentUser';

export async function GET(req) {
  await dbConnect();

  try {
    // Получение информации о текущем пользователе
    const user = await currentUser(req); // Убедитесь, что функция currentUser принимает req, если это необходимо

    // Находим заказы пользователя, сортируем их по дате создания в обратном порядке
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });

    // Возвращаем заказы в формате JSON
    return NextResponse.json(orders);
  } catch (err) {
    // Обработка ошибок и возврат информации об ошибке
    console.error('Ошибка при получении заказов:', err); // Логирование для отладки на сервере
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
