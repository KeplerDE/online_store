import React, { createContext, useState, useEffect, useContext } from "react";
import { useSnackbar } from 'notistack';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(storedCartItems);
  }, []);

  const [couponCode, setCouponCode] = useState("");
  const [percentOff, setPercentOff] = useState(0);
  const [validCoupon, setValidCoupon] = useState(false);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

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
    enqueueSnackbar('Product added to cart!', { variant: 'success' });
  };

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item._id !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    enqueueSnackbar('Product removed from cart.', { variant: 'warning' });
  };

  const updateQuantity = (product, quantity) => {
    const updatedItems = cartItems.map((item) =>
      item._id === product._id ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedItems));
    enqueueSnackbar('Product quantity updated.', { variant: 'info' });
  };

  const handleCoupon = async (coupon) => {
    try {
      const response = await fetch(`${process.env.API}/stripe/coupon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ couponCode: coupon }),
      });

      if (!response.ok) {
        throw new Error('Invalid coupon code');
      }

      const data = await response.json();
      setPercentOff(data.percent_off);
      setValidCoupon(true);
      enqueueSnackbar(`${data.name} applied successfully, ${data.percent_off}% off`, { variant: 'success' });
    } catch (error) {
      setPercentOff(0);
      setValidCoupon(false);
      enqueueSnackbar(error.message || "An error occurred. Please try again.", { variant: 'error' });
    }
  };


  //clear Cart

  const clearCart = () => {
    localStorage.removeItem("cartItems");

  }

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
        validCoupon,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
