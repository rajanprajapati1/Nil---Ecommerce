"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./SearchOverlay.module.css";
import { zaraCategories, getZaraCategory, ZaraProduct } from "@/data/zaraParser";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function getAllProducts(): ZaraProduct[] {
  return zaraCategories.flatMap((cat) => getZaraCategory(cat.key));
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ZaraProduct[]>([]);
  const [recommendations, setRecommendations] = useState<ZaraProduct[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recommendations once
  useEffect(() => {
    const all = getAllProducts();
    // Pick 8 random products
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    setRecommendations(shuffled.slice(0, 8));
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const all = getAllProducts();
    const matched = all.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.familyName?.toLowerCase().includes(q) ||
        p.subfamilyName?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
    setResults(matched.slice(0, 12));
  }, [query]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const displayProducts = query.trim() ? results : recommendations;
  const sectionLabel = query.trim()
    ? results.length > 0
      ? `${results.length} RESULTS FOR "${query.toUpperCase()}"`
      : `NO RESULTS FOR "${query.toUpperCase()}"`
    : "RECOMMENDED FOR YOU";


  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ""}`}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>
          CLOSE ✕
        </button>
      </div>

      <div className={styles.searchContainer}>
        <input
          ref={inputRef}
          className={styles.searchInput}
          type="text"
          placeholder="WHAT ARE YOU LOOKING FOR?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.sectionTitle}>{sectionLabel}</p>

        {displayProducts.length > 0 && (
          <div className={styles.grid}>
            {displayProducts.map((product) => {
              const firstImg = product.images?.[0] ?? "";
              const isVideo = firstImg.split("?")[0].endsWith(".mp4");

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className={styles.card}
                  onClick={onClose}
                >
                  <div className={styles.cardImgWrap}>
                    {isVideo ? (
                      <video
                        src={firstImg}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={styles.cardImg}
                      />
                    ) : (
                      <img
                        src={firstImg}
                        alt={product.name}
                        className={styles.cardImg}
                      />
                    )}
                  </div>
                  <p className={styles.cardName}>{product.name}</p>
                  <p className={styles.cardPrice}>{product.price}</p>
                </Link>
              );
            })}
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px", opacity: 0.4 }}>
            <p style={{ fontSize: "0.75rem", letterSpacing: "2px" }}>
              TRY SEARCHING FOR SOMETHING ELSE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
