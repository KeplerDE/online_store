import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import { currentUser } from "@/utils/currentUser";
import Product from "@/models/product";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  
  const { cartItems } = await req.json();
  const user = await currentUser();

  try {
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item._id);
        const unitAmount = product.price * 100;
        
        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: product.title,
              images: [product.images[0].secure_url],
            },
            unit_amount: unitAmount,
          },
          tax_rates: [process.env.STRIPE_TAX_RATE],
          quantity: item.quantity,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      // Другие параметры сессии
    });
  
    return NextResponse.json(session);

  } catch (err) {
    console.log(err);
    return NextResponse.json({
      err: "Server error. Please try again",
      status: 500,
    });
  }
}
