import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Загрузить элементы корзины из локального хранилища при монтировании компонента
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  // Сохранить элементы корзины в локальное хранилище при изменении состояния cartItems
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // добавить в корзину

  // удалить из корзины

  // обновить количество

  return (
    <CartContext.Provider
      value={{
        cartItems,

      }}
    >
      {children}
    </CartContext.Provider>
  );
};
