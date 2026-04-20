"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const openCart = () => {
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };
  
  const closeCart = () => setIsCartOpen(false);
  
  const openWishlist = () => {
    setIsCartOpen(false);
    setIsWishlistOpen(true);
  };
  
  const closeWishlist = () => setIsWishlistOpen(false);

  return (
    <UIContext.Provider value={{ isCartOpen, isWishlistOpen, openCart, closeCart, openWishlist, closeWishlist }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
