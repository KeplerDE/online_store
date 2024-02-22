import React from 'react';
import { useCart } from '@/context/cart'; 


export default function Step3({ onPrevStep }) {
  const { cartItems } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <p className="alert alert-warning">Your cart is empty.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-8">
          <p className="alert alert-primary">Review Your Order</p>
          <h2 className="text-center">🛒 Your Cart Items</h2>
          {/* Здесь может быть компонент для отображения элементов корзины, если нужно */}
          <div className="d-flex justify-content-end my-4">
            <button className="btn btn-outline-danger btn-raised col-6" onClick={onPrevStep}>
              Previous
            </button>
            {/* Предполагается действие при завершении заказа, например, подтверждение заказа */}
            <button className="btn btn-success btn-raised col-6" onClick={() => alert('Order confirmed!')}>
              Confirm Order
            </button>
          </div>
        </div>
        <div className="col-lg-4">
          <p> OrderSummary  </p>
        </div>
      </div>
    </div>
  );
}
