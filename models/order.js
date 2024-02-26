import mongoose from "mongoose";
import Product from "@/models/product";
import User from "@/models/user";


const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", 
  },
  title: String,
  slug: String,
  price: Number,
  image: String,
  quantity: Number,
});

// Схема для заказа
const orderSchema = new mongoose.Schema({
  chargeId: String,
  payment_intent: String,
  receipt_url: String,
  refunded: Boolean,
  status: String,
  amount_captured: Number,
  currency: String,
  shipping: {
    address: {
      city: String,
      country: String,
      line1: String,
      line2: String,
      postal_code: String,
      state: String,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Ссылка на модель User
  },
  cartItems: [cartItemSchema], // Массив элементов корзины
  delivery_status: {
    type: String,
    default: "Not Processed", // Статус доставки по умолчанию
    enum: [ // Перечисление возможных статусов доставки
      "Not Processed",
      "Processing",
      "Dispatched",
      "Refunded",
      "Cancelled",
      "Delivered",
    ],
  },
});

// Экспорт модели Order, если она еще не была создана
export default mongoose.models.Order || mongoose.model("Order", orderSchema);
