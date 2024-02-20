import { createContext, useState, useEffect, useContext } from "react";

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
  const addToCart = (product, quantity) => {
    const existingProduct = cartItems.find((item) => item._id === product._id);
    if (existingProduct) {
      const updatedCartItems = cartItems.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
  };
  // удалить из корзины


  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCartItems);
    // Обновление локального хранилища
    if (typeof window !== "undefined") {
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  };
  // обновить количество
  const updateQuantity = (product, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === product._id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
  };
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
