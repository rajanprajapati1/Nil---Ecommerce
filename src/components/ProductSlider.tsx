"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import styles from "./ProductSlider.module.css";

interface ProductSliderProps {
  category: {
    id: string;
    name: string;
    image: string;
  };
}

const products = [
  { id: 1, name: "NEW ARRIVALS", price: "VIEW ALL" },
  { id: 2, name: "LIMITED EDITION", price: "$129.00" },
  { id: 3, name: "ESSENTIAL HOODIE", price: "$89.00" },
];

export default function ProductSlider({ category }: ProductSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use IntersectionObserver with the container as root for better precision
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target.querySelectorAll(".reveal"), {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: "auto",
            });
            
            const line = entry.target.querySelector(".revealLine");
            if (line) {
              gsap.to(line, { 
                scaleY: 1, 
                transformOrigin: "top center", 
                duration: 1.2, 
                delay: 0.5, 
                ease: "power3.out", 
                overwrite: "auto" 
              });
            }
          }
        });
      },
      { 
        threshold: 0.05 // Trigger much earlier 
      }
    );

    if (containerRef.current) {
      const sections = containerRef.current.querySelectorAll(`.${styles.section}`);
      sections.forEach((sec) => observer.observe(sec));
    }

    return () => observer.disconnect();
  }, [category.id]); // Re-init if category changes

  return (
    <div className={styles.productScroll} ref={containerRef}>
      {/* 1. Category Hero */}
      <section className={styles.section}>
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${category.image})` }}
        >
          <div className="absolute-fill overlay"></div>
        </div>

        <div className={styles.content}>
          <h2 className={`${styles.catName} reveal`}>
            {category.name}
          </h2>
          <h1 className={`${styles.prodName} reveal`}>
            DISCOVER
          </h1>
          <div className={`${styles.scrollHint} reveal`}>
            <span>SCROLL</span>
          </div>
        </div>
      </section>

      {/* 2. Products */}
      {products.map((item, idx) => (
        <section key={idx} className={styles.section}>
          <div
            className={styles.bg}
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="absolute-fill overlay"></div>
          </div>

          <div className={styles.content}>
            <Link href={`/product/${item.id}`} className="no-underline">
              <h1 className={`${styles.prodName} reveal`}>
                {item.name}
              </h1>
            </Link>
            <p className={`${styles.price} reveal`}>
              {item.price}
            </p>
            <Link href={`/product/${item.id}`}>
              <button className={`${styles.buyBtn} reveal`}>
                ADD TO BAG
              </button>
            </Link>
          </div>
        </section>
      ))}

      {/* 3. Minimalist White Transition Block (End) */}
      <section className={`${styles.section} ${styles.cleanBlock}`}>
        <div className={styles.cleanContent}>
          <h1 className={`${styles.cleanTitle} reveal`}>THE NEW</h1>
          <p className={`${styles.cleanSub} reveal`}>COLLECTION 2026</p>
          <div className={`${styles.scrollLine} revealLine`} style={{ transform: "scaleY(0)" }}></div>
        </div>
      </section>
    </div>
  );
}
