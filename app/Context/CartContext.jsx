"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
export const CartContext = createContext();

// Create a custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Create the provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = (product, quantity, color, size) => {
    setCart(prevCart => {
      // Check if the product with the same size and color is already in the cart
      const existingProductIndex = prevCart.findIndex(
        item => item._id === product._id && item.size === size && item.color === color
      );

      if (existingProductIndex !== -1) {
        // If it exists, update the quantity
        const updatedCart = [...prevCart];
        const newQuantity = updatedCart[existingProductIndex].quantity + quantity;
        updatedCart[existingProductIndex].quantity = newQuantity > product.stock ? product.stock : newQuantity;
        return updatedCart;
      } else {
        // If it doesn't exist, add it as a new item
        const newItem = {
          ...product,
          quantity,
          color,
          size,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart(prevCart => {
      return prevCart.filter(
        item => !(item._id === productId && item.size === size && item.color === color)
      );
    });
  };

  const updateQuantity = (productId, size, color, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item._id === productId && item.size === size && item.color === color) {
          const newQuantity = item.quantity + amount;
          // Ensure quantity is between 1 and stock
          return { ...item, quantity: Math.max(1, Math.min(item.stock, newQuantity)) };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
