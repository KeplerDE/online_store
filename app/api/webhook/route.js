import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Order from "@/models/order";
import Product from "@/models/product";
// https://github.com/shadcn-ui/taxonomy
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const _raw = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    // Создание события с использованием Stripe SDK
    const event = stripe.webhooks.constructEvent(
      _raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // Обработка события
    switch (event.type) {
      case "charge.succeeded":
        const chargeSucceeded = event.data.object;
        const { id, ...rest } = chargeSucceeded;

        // Уменьшение количества на складе и сбор ID продуктов
        const cartItems = JSON.parse(chargeSucceeded.metadata.cartItems);
        const productIds = cartItems.map((cartItem) => cartItem._id);

        // Получение всех продуктов одним запросом
        const products = await Product.find({ _id: { $in: productIds } });

        // Создание объекта для быстрого доступа к деталям продуктов по ID
        const productMap = {};
        products.forEach((product) => {
          productMap[product._id.toString()] = {
            _id: product._id,
            title: product.title,
            slug: product.slug,
            price: product.price,
            image: product.images[0]?.secure_url || "",
          };
        });

        // Создание элементов корзины с деталями продуктов
        const cartItemsWithProductDetails = cartItems.map((cartItem) => ({
          ...productMap[cartItem._id],
          quantity: cartItem.quantity,
        }));

        // Создание заказа
        const orderData = {
          ...rest,
          chargeId: id,
          userId: chargeSucceeded.metadata.userId,
          cartItems: cartItemsWithProductDetails,
        };
        await Order.create(orderData);

        // Уменьшение количества продуктов на складе
        for (const cartItem of cartItems) {
          const product = await Product.findById(cartItem._id);
          if (product) {
            product.stock -= cartItem.quantity;
            await product.save();
          }
        }
        return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.log("Ошибка вебхука: ", err);
    return NextResponse.json(`Ошибка вебхука: ${err.message}`, { status: 400 });
  }
}

// Проблемы с вебхуками, как исправить?
// Импортировать модель заказа
// Добавить строковый тип к статусу модели заказа
// Изменить 'event.type' на прослушивание 'charge.succeeded'
// При создании вебхука в Stripe выбрать 'charges'
