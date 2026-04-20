"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import styles from "./MainSlider.module.css";
import Link from "next/link";
import { products } from "@/data/products";

/* ── Category definitions ─────────────────────────────────── */
const categories = [
  { key: "WOMEN", label: "WOMEN", image: "/images/women.png" },
  { key: "MEN", label: "MEN", image: "/images/men.png" },
  { key: "KIDS", label: "KIDS", image: "/images/kids.png" },
  { key: "ORIGINALS", label: "ORIGINALS", image: "/images/originals.png" },
];

const catMatchMap: Record<string, string[]> = {
  WOMEN: ["WOM"],
  MEN: ["MAN"],
  KIDS: ["KID"],
  ORIGINALS: ["ORI"],
};

function getProductsFor(catKey: string) {
  const prefixes = catMatchMap[catKey] || [];
  const matched = products.filter(p =>
    prefixes.some(pfx => p.category.toUpperCase().startsWith(pfx))
  );
  return matched.length > 0 ? matched.slice(0, 4) : products.slice(0, 3);
}

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
        {categories.map((cat) => {
          const catProducts = getProductsFor(cat.key);
          return (
            <SwiperSlide key={cat.key} className={styles.swiperSlide}>
              <div className={styles.scrollPane}>

                {/* Hero — just full image + minimal bottom-right info, no big title */}
                <section className={styles.hero}>
                  <div
                    className={styles.heroBg}
                    style={{ backgroundImage: `url(${cat.image})` }}
                  />
                  <div className={styles.heroOverlay} />
                  <div className={styles.heroInfo}>
                    <p className={styles.heroCatLabel}>{cat.label}</p>
                    <h2 className={styles.heroTagline}>New Collection 2026</h2>
                    <div className={styles.scrollHint}>
                      <div className={styles.scrollBar} />
                      <span>SCROLL</span>
                    </div>
                  </div>
                </section>

                {/* Product sections */}
                {catProducts.map((product, idx) => (
                  <section
                    key={product.id}
                    className={`${styles.productSection} ${idx % 2 === 1 ? styles.productSectionAlt : ""}`}
                  >
                    <div
                      className={styles.productBg}
                      style={{ backgroundImage: `url(${product.images[0]})` }}
                    />
                    <div className={styles.productOverlay} />
                    <div className={styles.productInfo}>
                      <p className={styles.productCat}>{product.category}</p>
                      <h2 className={styles.productName}>{product.name}</h2>
                      <p className={styles.productPrice}>{product.price}</p>
                      <Link href={`/product/${product.id}`} className={styles.viewBtn}>
                        VIEW DETAILS
                      </Link>
                    </div>
                  </section>
                ))}

                <div className={styles.categoryEnd}>
                  <p>— {cat.label} —</p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* ── Right-side category switcher (minimal) ── */}
      <div className={styles.sideTabs}>
        {categories.map((cat, i) => (
          <button
            key={cat.key}
            className={`${styles.sideTab} ${activeIdx === i ? styles.sideTabActive : ""}`}
            onClick={() => swiperRef.current?.slideTo(i)}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
