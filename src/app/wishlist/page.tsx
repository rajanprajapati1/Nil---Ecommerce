"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { getZaraProductById } from "@/data/zaraParser";
import Link from "next/link";
import styles from "./wishlist.module.css";

export default function WishlistPage() {
  const wishlistItems = useLiveQuery(() => db.wishlist.toArray()) ?? [];

  const enriched = wishlistItems.map((item) => ({
    ...item,
    product: getZaraProductById(item.productId),
  })).filter((i) => i.product);

  const remove = (id: number) => db.wishlist.delete(id);

  const moveToBag = async (item: typeof enriched[0]) => {
    const alreadyInCart = await db.cart.where("productId").equals(item.productId).first();
    if (alreadyInCart) {
      await db.cart.update(alreadyInCart.id!, { quantity: alreadyInCart.quantity + 1 });
    } else {
      await db.cart.add({ productId: item.productId, quantity: 1, addedAt: Date.now() });
    }
    await db.wishlist.delete(item.id!);
  };

  return (
    <div className={styles.page}>
      {/* ── Left: product grid ── */}
      <section className={styles.gridSection}>
        <div className={styles.gridHeader}>
          <h1 className={styles.title}>FAVOURITES</h1>
          <span className={styles.count}>{enriched.length}</span>
        </div>

        {enriched.length === 0 ? (
          <div className={styles.empty}>
            <p>Your favourites list is empty.</p>
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
                  <p className={styles.price}>{item.product!.price}</p>
                  <button
                    className={styles.moveBtn}
                    onClick={() => moveToBag(item)}
                  >
                    ADD TO BAG
                  </button>
                  <button className={styles.deleteBtn} onClick={() => remove(item.id!)}>
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Right: sidebar ── */}
      <aside className={styles.sidebar}>
        <nav className={styles.sideNav}>
          <Link href="/cart" className={styles.sideNavLink}>SHOPPING BAG</Link>
          <span className={styles.sideNavActive}>FAVOURITES</span>
          <Link href="/auth" className={styles.sideNavLink}>LOG IN</Link>
          <Link href="/" className={styles.sideNavLink}>HELP</Link>
        </nav>

        {enriched.length > 0 && (
          <button
            className={styles.moveAllBtn}
            onClick={() => Promise.all(enriched.map(moveToBag))}
          >
            ADD ALL TO BAG ({enriched.length})
          </button>
        )}
      </aside>
    </div>
  );
}
