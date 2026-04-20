"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { products, getRecommendedProducts } from "@/data/products";
import Link from "next/link";
import Image from "next/image";
import styles from "./cart.module.css";

export default function CartPage() {
  const cartItems = useLiveQuery(() => db.cart.toArray()) ?? [];

  const enriched = cartItems.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })).filter((i) => i.product);

  const total = enriched.reduce((sum, item) => {
    const price = parseFloat(item.product!.price.replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);

  const recommendations = getRecommendedProducts("", 4);

  const remove = (id: number) => db.cart.delete(id);

  const updateQty = (id: number, qty: number) => {
    if (qty < 1) return;
    db.cart.update(id, { quantity: qty });
  };

  return (
    <div className={styles.page}>
      {/* ── Left: product grid ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h1 className={styles.title}>SHOPPING BAG</h1>
          <span className={styles.count}>{enriched.length}</span>
        </div>

        {enriched.length === 0 ? (
          <div className={styles.empty}>
            <p>Your bag is empty.</p>
            <Link href="/" className={styles.emptyLink}>CONTINUE SHOPPING</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {enriched.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={item.product!.images[0]} alt={item.product!.name} className={styles.image} />
                </div>
                <div className={styles.meta}>
                  <p className={styles.productName}>{item.product!.name}</p>
                  {item.size && <p className={styles.detail}>{item.size}</p>}
                  <p className={styles.price}>{item.product!.price}</p>
                  <div className={styles.qtyRow}>
                    <button onClick={() => updateQty(item.id!, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQty(item.id!, item.quantity + 1)}>+</button>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => remove(item.id!)}>DELETE</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── You may also like ── */}
        <div className={styles.recSection}>
          <p className={styles.recTitle}>YOU MAY ALSO LIKE</p>
          <div className={styles.recGrid}>
            {recommendations.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className={styles.recCard}>
                <img src={p.images[0]} alt={p.name} className={styles.recImage} />
                <p className={styles.recName}>{p.name}</p>
                <p className={styles.recPrice}>{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Right: summary sidebar ── */}
      <aside className={styles.sidebar}>
        <nav className={styles.sideNav}>
          <span className={styles.sideNavActive}>SHOPPING BAG &nbsp;{enriched.length > 0 ? `(${enriched.length})` : ""}</span>
          <Link href="/wishlist" className={styles.sideNavLink}>FAVOURITES</Link>
          <Link href="/auth" className={styles.sideNavLink}>LOG IN</Link>
          <Link href="/" className={styles.sideNavLink}>HELP</Link>
        </nav>

        {enriched.length > 0 && (
          <>
            <div className={styles.summaryRow}>
              <span>☐ &nbsp;ALL</span>
              <span>₹ {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <p className={styles.shippingNote}>* Free shipping</p>
            <button className={styles.checkoutBtn}>
              CONTINUE ({enriched.length})
            </button>
            <p className={styles.termsNote}>
              By continuing, I declare that I have read and accept the purchase conditions and privacy policy.
            </p>
          </>
        )}
      </aside>
    </div>
  );
}
