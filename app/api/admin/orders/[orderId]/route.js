import { NextResponse } from "next/server"; 
import dbConnect from "@/utils/dbConnect"; 
import Order from "@/models/order"; 

export async function PUT(req, context) {
  await dbConnect(); 
  const body = await req.json(); 
  try {
    // Обновляем данные заказа на основе переданного идентификатора и статуса доставки
    const order = await Order.findByIdAndUpdate(
      context.params.orderId, // Извлекаем идентификатор заказа из параметров запроса
      { delivery_status: body.delivery_status }, // Обновляемое значение статуса доставки
      { new: true } // Опция, указывающая на необходимость возвращения обновленного документа
    );
    // Возвращаем обновленный заказ в формате JSON
    return NextResponse.json(order);
  } catch (err) {
    console.log(err); // В случае ошибки выводим информацию об ошибке в консоль
    // Возвращаем ошибку сервера с сообщением
    return NextResponse.json(
      { err: "Server error. Please try again." },
      { status: 500 } // Указываем статус-код HTTP ответа
    );
  }
}
