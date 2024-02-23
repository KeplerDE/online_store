// Несколько обновлений необходимы для корректировки доставки, налогов и купонов
// Изменение на основе идентификатора продукта, количества и автоматически расчитываемого налога
import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { getToken } from "next-auth/jwt";
import Product from "@/models/product";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Создать сессию оформления заказа
// https://stripe.com/docs/api/checkout/sessions/create?lang=node
export async function POST(req) {
  await dbConnect();
  const _req = await req.json();
  console.log("_req в API сессии оформления заказа Stripe", _req);
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  try {
    const lineItems = await Promise.all(
      _req.cartItems.map(async (item) => {
        const product = await Product.findById(item._id); // Получить данные о продукте из базы данных
        const unitAmount = product.price * 100; // Stripe ожидает сумму в центах
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.title,
              images: [product.images[0]?.secure_url],
            },
            unit_amount: unitAmount,
          },
          tax_rates: [process.env.STRIPE_TAX_RATE],
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      success_url: `${process.env.DOMAIN}/dashboard/user/stripe/success`,
      client_reference_id: token?.user?._id,
      line_items: lineItems,
      mode: "payment",
      // https://stripe.com/docs/api/payment_methods/create
      payment_method_types: ["card"],
      // Искать налоги в панели настроек под "Каталог цен"
      // https://dashboard.stripe.com/test/settings/tax
      payment_intent_data: {
        metadata: {
          cartItems: JSON.stringify(_req.cartItems), // Сохранить элементы корзины в метаданных
          userId: token?.user?._id,
        },
      },
      shipping_options: [
        {
          shipping_rate: process.env.STRIPE_SHIPPING_RATE,
        },
      ],
      shipping_address_collection: {
        allowed_countries: ["DE"], // Разрешить доставку только в DE
      },
      discounts: [
        {
          coupon: _req.couponCode, // Заменить на код вашего купона
        },
      ],
      customer_email: token?.user?.email, // Автоматически заполнить электронную почту клиента на странице оформления заказа
    });

    return NextResponse.json(session);
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      err: "Ошибка сервера. Пожалуйста, попробуйте снова.",
      status: 500
    });
  }
}
