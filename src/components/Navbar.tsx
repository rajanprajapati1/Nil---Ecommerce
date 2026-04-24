"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Menu from "./Menu";
import SearchOverlay from "./SearchOverlay";
import { useUI } from "@/context/UIContext";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { CartIcon, WishlistIcon } from "@/data/Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openCart, openWishlist } = useUI();
  const cartItemsCount = useLiveQuery(() => db.cart.count());
  const WishItemsCount = useLiveQuery(() => db.wishlist.count());
  const users = useLiveQuery(() => db.user.toArray()) || [];
  const isLoggedIn = users.length > 0;

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleAuthClick = (e: React.MouseEvent) => {
    if (isLoggedIn) {
      e.preventDefault();
      db.user.clear(); // Simulate logout
    }
  };

  return (
    <>
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <button className={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className={`${styles.hamburger} ${isMenuOpen ? styles.open : ""}`}>
              <span className={styles.line}></span>
              <span className={styles.line}></span>
            </div>
          </button>
          <Link href="/" className={styles.logo}>
            IIL
          </Link>
        </div>

        <div className={styles.right}>
          <div className={styles.search}>
            <button onClick={() => setIsSearchOpen(true)}>SEARCH</button>
            <div className={styles.searchUnderline}></div>
          </div>
          <Link href="/auth" onClick={handleAuthClick}>
            <button>{isLoggedIn ? "LOG OUT" : "LOG IN"}</button>
          </Link>
          {/* Wishlist icon */}
          <button
            className={styles.iconBtn}
            onClick={openWishlist}
            aria-label="Wishlist"
          >
            <WishlistIcon size={20} />
            {WishItemsCount && WishItemsCount > 0 ? (
              <span className={styles.cartBadge}>{WishItemsCount}</span>
            ) : null}
          </button>

          {/* Cart icon */}
          <button
            className={styles.cart}
            onClick={openCart}
            style={{ position: 'relative' }}
            aria-label="Cart"
          >
            <CartIcon size={22} />
            {cartItemsCount && cartItemsCount > 0 ? (
              <span className={styles.cartBadge}>{cartItemsCount}</span>
            ) : null}
          </button>
        </div>
      </nav>
    </>
  );
}
