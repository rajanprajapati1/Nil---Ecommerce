"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getProductById } from "@/data/products";
import { useUI } from "@/context/UIContext";
import styles from "./Drawers.module.css";

export default function Drawers() {
  const { isCartOpen, isWishlistOpen, closeCart, closeWishlist, openCart } = useUI();
  const router = useRouter();

  const cartItems = useLiveQuery(() => db.cart.toArray()) || [];
  const wishlistItems = useLiveQuery(() => db.wishlist.toArray()) || [];
  const users = useLiveQuery(() => db.user.toArray()) || []; // Check if logged in

  const handleCheckout = () => {
    if (users.length === 0) {
      closeCart();
      router.push("/auth?login=1");
    } else {
      console.log("Proceeding to checkout...");
      // router.push("/checkout"); // Placeholder
    }
  };

  const currentCartDetails = cartItems.map(item => ({
    ...item,
    product: getProductById(item.productId)
  })).filter(i => i.product);

  const currentWishlistDetails = wishlistItems.map(item => ({
    ...item,
    product: getProductById(item.productId)
  })).filter(i => i.product);

  const cartTotal = currentCartDetails.reduce((sum, item) => {
    // Basic price parsing (assumes "X,XXX.00 INR")
    const priceNum = parseFloat(item.product?.price.replace(/[^0-9.]/g, '') || "0");
    return sum + (priceNum * item.quantity);
  }, 0);

  // Cart Drawer
  return (
    <>
      <div className={`${styles.overlay} ${isCartOpen || isWishlistOpen ? styles.showOverlay : ''}`} onClick={() => { closeCart(); closeWishlist(); }} />

      {/* Cart Drawer */}
      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Shopping Bag ({cartItems.length})</h2>
          <button onClick={closeCart} className={styles.closeBtn}>✕</button>
        </div>
        <div className={styles.drawerBody}>
          {currentCartDetails.length === 0 ? (
            <p className={styles.emptyMsg}>Your bag is empty.</p>
          ) : (
            currentCartDetails.map(item => (
              <div key={item.id} className={styles.bagItem}>
                <img src={item.product?.images[0]} alt={item.product?.name} className={styles.bagImg} />
                <div className={styles.bagInfo}>
                  <p className={styles.bagName}>{item.product?.name}</p>
                  <p className={styles.bagDetail}>Size: {item.size || "M"}</p>
                  <p className={styles.bagPrice}>{item.product?.price}</p>
                  <div className={styles.actionRow}>
                    <div className={styles.qtyBox}>
                      <button
                        onClick={() => item.quantity > 1 ? db.cart.update(item.id!, { quantity: item.quantity - 1 }) : db.cart.delete(item.id!)}
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => db.cart.update(item.id!, { quantity: item.quantity + 1 })}
                      >+</button>
                    </div>
                    <button onClick={() => db.cart.delete(item.id!)} className={styles.removeBtn}>DELETE</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles.drawerFooter}>
          <div className={styles.totalRow}>
            <span>TOTAL</span>
            <span>₹ {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            disabled={currentCartDetails.length === 0}
          >
            CONTINUE
          </button>
        </div>
      </div>

      {/* Wishlist Drawer */}
      <div className={`${styles.drawer} ${isWishlistOpen ? styles.open : ''}`}>
        <div className={styles.drawerHeader}>
          <h2>Favourites ({wishlistItems.length})</h2>
          <button onClick={closeWishlist} className={styles.closeBtn}>✕</button>
        </div>
        <div className={styles.drawerBody}>
          {currentWishlistDetails.length === 0 ? (
            <p className={styles.emptyMsg}>Your wishlist is empty.</p>
          ) : (
            currentWishlistDetails.map(item => (
              <div key={item.id} className={styles.bagItem}>
                <img src={item.product?.images[0]} alt={item.product?.name} className={styles.bagImg} />
                <div className={styles.bagInfo}>
                  <p className={styles.bagName}>{item.product?.name}</p>
                  <p className={styles.bagPrice}>{item.product?.price}</p>
                  <div className={styles.actionRow}>
                    <button onClick={() => db.wishlist.delete(item.id!)} className={styles.removeBtn}>REMOVE</button>
                    <button
                      className={styles.moveToBagBtn}
                      onClick={async () => {
                        const existing = await db.cart.where("productId").equals(item.productId).first();
                        if (!existing) {
                          await db.cart.put({ productId: item.productId, quantity: 1, addedAt: Date.now() });
                        }
                        await db.wishlist.delete(item.id!);
                        openCart();
                      }}
                    >
                      MOVE TO BAG
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
