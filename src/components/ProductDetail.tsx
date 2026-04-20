"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import styles from "./ProductDetail.module.css";
import { getProductById, getRecommendedProducts, products } from "@/data/products";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useUI } from "@/context/UIContext";

export default function ProductDetail({ id }: { id: string }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { openCart, openWishlist } = useUI();

  const product = getProductById(id) || products[0]; // Fallback to first product

  const recommendedItems = getRecommendedProducts(product.id);

  // Track and fetch recently viewed
  const recentlyViewedQuery = useLiveQuery(() => db.recentlyViewed.orderBy('viewedAt').reverse().toArray());
  const recentlyViewedIds = recentlyViewedQuery?.map(item => item.productId).filter(pid => pid !== product.id) || [];
  const recentlyViewedProducts = recentlyViewedIds.map(vid => getProductById(vid)).filter(Boolean).slice(0, 4);

  // Check Cart/Wishlist status
  const cartQuery = useLiveQuery(() => db.cart.where("productId").equals(product.id).first(), [product.id]);
  const wishlistQuery = useLiveQuery(() => db.wishlist.where("productId").equals(product.id).first(), [product.id]);
  const isInCart = !!cartQuery;
  const isSaved = !!wishlistQuery;

  // Complete The Look (a quick shuffle or curated slice of other items)
  const completeTheLookItems = products.filter(p => p.category !== product.category && p.id !== product.id).slice(0, 4);

  useEffect(() => {
    // Record this product view in Dexie
    if (product.id) {
      db.recentlyViewed.where({ productId: product.id }).delete().then(() => {
        db.recentlyViewed.put({ productId: product.id, viewedAt: Date.now() });
      });
    }
  }, [product.id]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance staggered animation for text
      gsap.from(".reveal", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });

      // Subtle parallax or fade for gallery images as they scroll?
      // For now just ensuring they load smoothly
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  const handleAddToCart = async () => {
    if (isInCart) {
      openCart();
    } else {
      await db.cart.put({ productId: product.id, size: selectedSize || "M", quantity: 1, addedAt: Date.now() });
      openCart();
    }
  };

  const handleWishlistToggle = async () => {
    if (isSaved) {
      // Toggle off? Or just open wishlist? Zara typically toggles off.
      await db.wishlist.delete(wishlistQuery!.id!);
    } else {
      await db.wishlist.put({ productId: product.id, addedAt: Date.now() });
      openWishlist();
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} ref={containerRef}>
        {/* Gallery */}
        <div className={styles.gallery}>
          {product.images.map((img, idx) => (
            <div key={idx} className={styles.galleryImg}>
              <img src={img} alt={product.name} style={{ width: '100%', display: 'block' }} />
            </div>
          ))}
        </div>

        {/* Details Sticky Panel */}
        <div className={styles.details} ref={detailsRef}>
          <span className={`${styles.bread} reveal`}>{product.category}</span>
          <h1 className={`${styles.title} reveal`}>{product.name}</h1>
          <p className={`${styles.price} reveal`}>{product.price}</p>

          <p className={`${styles.desc} reveal`}>{product.description}</p>

          <div className={`${styles.section} reveal`}>
            <span className={styles.sectionTitle}>SELECT SIZE</span>
            <div className={styles.sizeGrid}>
              {sizeOptions.map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.infoSection} reveal`}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>COMPOSITION</span>
              <span className={styles.infoText}>{product.composition}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>CARE</span>
              <span className={styles.infoText}>{product.care}</span>
            </div>
          </div>

          <div className={`${styles.actions} reveal`}>
            <button 
              className={`${styles.addBtn} ${isInCart ? styles.inCart : ""}`} 
              onClick={handleAddToCart}
            >
              {isInCart ? "IN CART" : "ADD TO BAG"}
            </button>
            <button 
              className={styles.wishlistBtn} 
              onClick={handleWishlistToggle}
            >
              {isSaved ? "SAVED TO WISHLIST" : "SAVE TO WISHLIST"}
            </button>
          </div>
        </div>
      </div>

      {/* Editorial Banner */}
      <div className={styles.editorialBanner}>
        <img src="/product/women11.png" alt="Nil Editorial" className={styles.editorialImage} />
        <div className={styles.editorialContent}>
          <h3 className={styles.editorialTitle}>THE ESSENCE OF MINIMALISM</h3>
          <p className={styles.editorialText}>Curated silhouettes and uncompromising materials designed for the modern wardrobe.</p>
          <Link href="/" className={styles.editorialLink}>EXPLORE CAMPAIGN</Link>
        </div>
      </div>

      {/* Complete The Look */}
      {completeTheLookItems.length > 0 && (
        <div className={styles.suggestionSection}>
          <h2 className={styles.suggestionTitle}>Complete The Look</h2>
          <div className={styles.suggestionGrid}>
            {completeTheLookItems.map(item => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.suggestionCard}>
                <img src={item.images[0]} alt={item.name} className={styles.suggestionImg} />
                <span className={styles.suggestionName}>{item.name}</span>
                <span className={styles.suggestionPrice}>{item.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Items */}
      {recommendedItems.length > 0 && (
        <div className={styles.suggestionSection}>
          <h2 className={styles.suggestionTitle}>You May Also Like</h2>
          <div className={styles.suggestionGrid}>
            {recommendedItems.map(item => (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.suggestionCard}>
                <img src={item.images[0]} alt={item.name} className={styles.suggestionImg} />
                <span className={styles.suggestionName}>{item.name}</span>
                <span className={styles.suggestionPrice}>{item.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewedProducts.length > 0 && (
        <div className={styles.suggestionSection}>
          <h2 className={styles.suggestionTitle}>Recently Viewed</h2>
          <div className={styles.suggestionGrid}>
            {recentlyViewedProducts.map(item => item && (
              <Link href={`/product/${item.id}`} key={item.id} className={styles.suggestionCard}>
                <img src={item.images[0]} alt={item.name} className={styles.suggestionImg} />
                <span className={styles.suggestionName}>{item.name}</span>
                <span className={styles.suggestionPrice}>{item.price}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
