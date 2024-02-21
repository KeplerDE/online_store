"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart"; 
import Link from "next/link"; 

// Компонент для добавления товара в корзину
export default function AddToCart({ product }) {
  const { addToCart, updateQuantity, cartItems, removeFromCart } = useCart(); // Используем контекст корзины

  // Поиск продукта в списке товаров корзины
  const existingProduct = cartItems.find((item) => item._id === product._id);
  // Определение начального количества товара
  const initialQuantity = existingProduct ? existingProduct.quantity : 1;
  // Состояние для управления количеством товара
  const [quantity, setQuantity] = useState(initialQuantity);

  // Обновление количества товара при изменении его значения в корзине
  useEffect(() => {
    setQuantity(existingProduct ? existingProduct.quantity : 1);
  }, [existingProduct]);

  // Увеличение количества товара
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(product, newQuantity); // Обновляем количество в корзине
  };

  // Уменьшение количества товара
  const handleDecrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product, newQuantity); // Обновляем количество в корзине
    } else {
      // Удаление товара из корзины, если его количество становится 0
      removeFromCart(product._id);
      setQuantity(1); // Сброс количества товара до 1
    }
  };

  // Добавление товара в корзину
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div>
      {cartItems.some((item) => item._id === product._id) ? (
        <>
          <div className="input-group quantity-input">
            <div className="input-group-prepend">
              <button className="btn btn-outline-secondary" type="button" onClick={handleDecrement}>
                -
              </button>
            </div>
            <input type="number" className="form-control no-spin-arrows mx-5 text-center" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" type="button" onClick={handleIncrement}>
                +
              </button>
            </div>
          </div>
          <Link className="btn btn-outline-danger btn-raised btn-block mt-2" href="/cart">
            Review & Checkout
          </Link>
        </>
      ) : (
        <button className="btn btn-danger btn-raised btn-block" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
}
