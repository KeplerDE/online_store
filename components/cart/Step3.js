import { useState } from "react";
import { useCart } from "@/context/cart"; 
import toast from "react-hot-toast";
import OrderSummary from "./OrderSummary";

export default function Step3({ onPrevStep }) {
  const { cartItems, validCoupon, couponCode } = useCart();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    console.log("Начало процесса оформления заказа...");

    try {
      // Подготовка данных для запроса
      const payload = {
        cartItems: cartItems.map((item) => ({
          _id: item._id,
          quantity: item.quantity,
        })),
      };

      // Добавление кода купона, если он действителен
      if(validCoupon) {
        payload.couponCode = couponCode;
        console.log(`Применение кода купона: ${couponCode}`);
      } else {
        console.log("Действительный код купона отсутствует.");
      }

      console.log("Данные для создания сессии Stripe:", payload);

      // Отправка запроса на сервер
      const response = await fetch(`${process.env.API}/user/stripe/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Статус ответа от API:", response.status);

      // Обработка ответа от сервера
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Данные об ошибке:", errorData);
        toast.error(errorData.err);
      } else {
        const data = await response.json();
        console.log("Сессия Stripe успешно создана, перенаправление...", data.url);
        window.location.href = data.url; // Перенаправление на страницу оплаты Stripe
      }
    } catch (err) {
      console.error("Исключение во время выполнения запроса:", err);
      toast.error("Произошла ошибка. Пожалуйста, попробуйте снова.");
    } finally {
      setLoading(false);
      console.log("Процесс оформления заказа завершён.");
    }
  };


  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Payment Method</p>
          <h2 className="text-center">🔒 💳</h2>
          <p className="alert alert-danger">
            Flat rate $5 shipping fee will apply for all orders Europe wide!
          </p>
          <p className="lead card p-5 bg-secondary text-light">
            Clicking 'Place Order' will securely redirect you to our trusted payment partner, Stripe, to complete your checkout. Your payment information is fully protected and encrypted for your security.
          </p>
          <div className="d-flex justify-content-end my-4">
            <button className="btn btn-outline-danger btn-raised col-6" onClick={onPrevStep}>
              Previous
            </button>
            <button className="btn btn-success btn-raised col-6" onClick={handleClick} disabled={loading}>
              {loading ? "Processing ..." : "Place Order"}
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          < OrderSummary/>
        </div>
      </div>
    </div>
  );
}
