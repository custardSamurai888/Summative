import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (movie) => {
    setCart((prev) => [...prev, movie]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((movie) => movie.id !== id));
  };

  // Clear the cart (for logout or manual clearing)
  const clearCart = () => setCart([]);

  // Check if a movie is in the cart
  const isInCart = (id) => cart.some((movie) => movie.id === id);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};