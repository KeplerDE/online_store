import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
import { currentUser } from "@/utils/currentUser";
import { URLSearchParams } from "url";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();

  try {
    // Получаем текущего пользователя асинхронно
    const user = await currentUser();
    // Извлекаем orderId из URL запроса
    const params = new URLSearchParams(req.url.split('?')[1]);
    const orderId = params.get("orderId");
    const order = await Order.findById(orderId);

    // Проверяем, существует ли заказ и принадлежит ли он текущему пользователю
    if (!order || order.userId.toString() !== user._id.toString()) {
      return new NextResponse(JSON.stringify({ error: "Order not found or unauthorized" }), { status: 404 });
    }

    // Проверяем, не обработан ли заказ уже
    if (order.delivery_status !== "Not Processed") {
      return new NextResponse(JSON.stringify({ error: "Order cannot be refunded" }), { status: 400 });
    }

    // Выполняем запрос на возврат средств через Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.payment_intent,
      reason: "requested_by_customer",
    });

    // Обновляем количество товаров на складе в соответствии с возвращенными позициями
    for (const cartItem of order.cartItems) {
      const product = await Product.findById(cartItem._id);
      if (product) {
        product.stock += cartItem.quantity;
        await product.save();
      }
    }

    // Обновляем информацию о заказе в базе данных с деталями возврата
    order.status = "Refunded";
    order.refunded = true;
    order.delivery_status = "Cancelled";
    order.refundId = refund.id; // Сохраняем ID возврата для справки
    await order.save();

    return new NextResponse(JSON.stringify({ message: "Order refunded successfully" }), { status: 200 });
  } catch (err) {
    return new NextResponse(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
