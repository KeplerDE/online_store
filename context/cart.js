import { createContext, useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';


export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Загрузить элементы корзины из локального хранилища при монтировании компонента
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  // coupons
  const [couponCode, setCouponCode] = useState("");
  const [percentOff, setPercentOff] = useState(0);
  const [validCoupon, setValidCoupon] = useState(false);

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



  // Функция обработки купона
  const handleCoupon = async (coupon) => {
    try {
      const response = await fetch(`${process.env.API}/stripe/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode: coupon }),
      });

      // Обработка неудачного ответа сервера
      if (!response.ok) {
        throw new Error('Invalid coupon code');
      }

      // Успешный ответ сервера
      const data = await response.json();
      setPercentOff(data.percent_off);
      setValidCoupon(true);
      toast.success(`${data.name} applied successfully, ${data.percent_off}% off`);
    } catch (error) {
      // Обработка ошибок запроса или неверного кода купона
      console.error(error);
      setPercentOff(0);
      setValidCoupon(false);
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        couponCode,
        setCouponCode,
        handleCoupon,
        percentOff,
        validCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
