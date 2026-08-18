import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (foodItem, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.foodItem._id === foodItem._id);
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.foodItem._id === foodItem._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { foodItem, quantity }];
    });
  };

  // Remove item from cart
  const removeFromCart = (foodItemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.foodItem._id !== foodItemId));
  };

  // Update quantity of item
  const updateQuantity = (foodItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.foodItem._id === foodItemId ? { ...item, quantity } : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total sum price of items in cart
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.foodItem.price * item.quantity, 0);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
