"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import styles from "./MainSlider.module.css";
import Link from "next/link";
import { zaraCategories, getZaraCategory } from "@/data/zaraParser";
import type { CategoryKey } from "@/data/zaraParser";

const HERO_IMAGES: Record<CategoryKey, string> = {
  womens: "/images/women.png",
  mens: "/images/men.png",
  kids: "/images/kids.png",
  perfumes: "/images/originals.png",
};

const HERO_TAGLINES: Record<CategoryKey, string> = {
  womens: "New Collection 2026",
  mens: "New Collection 2026",
  kids: "Kids 2026",
  perfumes: "Fragrance 2026",
};

export default function MainSlider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className={styles.root}>
      {/* ── Horizontal category swiper ── */}
      <Swiper
        onSwiper={(sw) => { swiperRef.current = sw; }}
        onSlideChange={(sw) => setActiveIdx(sw.activeIndex)}
        direction="horizontal"
        slidesPerView={1}
        spaceBetween={0}
        speed={900}
        allowTouchMove={true}
        simulateTouch={true}
        className={styles.swiper}
      >
        {zaraCategories.map((cat) => {
          const catProducts = getZaraCategory(cat.key).slice(0, 8);
          return (
            <SwiperSlide key={cat.key} className={styles.swiperSlide}>
              <div className={styles.scrollPane}>



                {/* Product sections — show first 4 from Zara data */}
                {catProducts.map((product, idx) => (
                  <section
                    key={product.id}
                    className={`${styles.productSection} ${idx % 2 === 1 ? styles.productSectionAlt : ""}`}
                  >
                    {product.images[0].split('?')[0].endsWith('.mp4') ? (
                      <video 
                        className={styles.productImage}
                        src={product.images[0]} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                      />
                    ) : (
                      <img
                        className={styles.productImage}
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.productOverlay} />
                    <div className={styles.productInfo}>
                      <p className={styles.productCat}>{product.familyName || product.category}</p>
                      <h2 className={styles.productName}>{product.name}</h2>
                      <p className={styles.productPrice}>{product.price}</p>

                      {/* Color swatches */}
                      {product.colors.length > 0 && (
                        <div className={styles.colorSwatches}>
                          {product.colors.slice(0, 4).map((c) => (
                            <span
                              key={c.hex}
                              className={styles.colorSwatch}
                              style={{ background: c.hex }}
                              title={c.name}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className={styles.colorMore}>+{product.colors.length - 4}</span>
                          )}
                        </div>
                      )}

                      <Link href={`/product/${product.id}`} className={styles.viewBtn}>
                        VIEW DETAILS
                      </Link>
                    </div>
                  </section>
                ))}

                <div className={styles.categoryEnd}>
                  <Link href={`/category/${cat.slug}`} className={styles.viewAllBanner}>
                    VIEW ALL {cat.label} →
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ── Right-side category switcher ──
      <div className={styles.sideTabs}>
        {zaraCategories.map((cat, i) => (
          <button
            key={cat.key}
            className={`${styles.sideTab} ${activeIdx === i ? styles.sideTabActive : ""}`}
            onClick={() => swiperRef.current?.slideTo(i)}
          >
            {cat.label}
          </button>
        ))}
      </div> */}
    </div>
  );
}
