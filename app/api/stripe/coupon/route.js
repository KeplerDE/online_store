import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  await dbConnect();
  const _req = await req.json();

  try {
    const coupon = await stripe.coupons.retrieve(_req.couponCode);
    console.log("coupon", coupon);
    return new NextResponse(JSON.stringify(coupon), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ err: "Server error. Please try again." }), { status: 500 });
  }
}
