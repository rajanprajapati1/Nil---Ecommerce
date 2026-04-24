"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getZaraBySlug, zaraCategories } from "@/data/zaraParser";
import type { ZaraProduct } from "@/data/zaraParser";
import { db } from "@/lib/db";
import { useUI } from "@/context/UIContext";
import styles from "./page.module.css";

const SORT_OPTIONS = [
  { label: "FEATURED", value: "featured" },
  { label: "PRICE: LOW → HIGH", value: "price_asc" },
  { label: "PRICE: HIGH → LOW", value: "price_desc" },
  { label: "NAME A → Z", value: "name_asc" },
];

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

function sortProducts(products: ZaraProduct[], sort: SortValue): ZaraProduct[] {
  const arr = [...products];
  if (sort === "price_asc") return arr.sort((a, b) => a.priceRaw - b.priceRaw);
  if (sort === "price_desc") return arr.sort((a, b) => b.priceRaw - a.priceRaw);
  if (sort === "name_asc") return arr.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}

function ProductCard({ product }: { product: ZaraProduct }) {
  const [hovered, setHovered] = useState(false);
  const { openCart, openWishlist } = useUI();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await db.cart.add({ productId: product.id, size: "M", quantity: 1, addedAt: Date.now() });
    openCart();
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    await db.wishlist.add({ productId: product.id, addedAt: Date.now() });
    openWishlist();
  };

  const img1 = product.images[0] ?? "";
  const img2 = product.images[1] ?? img1;
  const activeMedia = hovered && img2 ? img2 : img1;
  const isVideo = (url: string) => url.split("?")[0].endsWith(".mp4");

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/product/${product.id}`} className={styles.cardImgWrap}>
        {isVideo(activeMedia) ? (
          <video
            src={activeMedia}
            autoPlay
            loop
            muted
            playsInline
            className={styles.cardImg}
          />
        ) : (
          <img
            src={activeMedia}
            alt={product.name}
            className={styles.cardImg}
            loading="lazy"
          />
        )}
        {/* Availability badge */}
        {product.availability === "coming_soon" && (
          <span className={styles.badge}>COMING SOON</span>
        )}
        {/* Quick actions */}
        <div className={`${styles.quickActions} ${hovered ? styles.quickActionsVisible : ""}`}>
          <button className={styles.quickBtn} onClick={handleAddToCart} title="Add to bag">
            ADD TO BAG
          </button>
          <button className={styles.quickBtnIcon} onClick={handleWishlist} title="Save to wishlist">
            ♡
          </button>
        </div>
      </Link>

      <div className={styles.cardInfo}>
        <p className={styles.cardFamily}>{product.familyName}</p>
        <Link href={`/product/${product.id}`} className={styles.cardName}>
          {product.name}
        </Link>
        <p className={styles.cardPrice}>{product.price}</p>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className={styles.cardColors}>
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.hex}
                className={styles.cardColorDot}
                style={{ background: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 5 && (
              <span className={styles.cardColorMore}>+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const catMeta = zaraCategories.find((c) => c.slug === slug);
  const allProducts = getZaraBySlug(slug);

  const [sort, setSort] = useState<SortValue>("featured");
  const [filterFamily, setFilterFamily] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Unique families for filter tabs
  const families = ["ALL", ...Array.from(new Set(allProducts.map((p) => p.familyName).filter(Boolean)))];

  const filtered = sortProducts(
    allProducts.filter((p) => {
      const matchFamily = filterFamily === "ALL" || p.familyName === filterFamily;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchFamily && matchSearch;
    }),
    sort
  );

  // Sticky header shrink
  useEffect(() => {
    const onScroll = () => {
      if (!headerRef.current) return;
      headerRef.current.classList.toggle(styles.headerSmall, window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader} ref={headerRef}>
        <div className={styles.breadcrumb}>
          <Link href="/">IIL</Link> / {catMeta?.label ?? slug.toUpperCase()}
        </div>
        <h1 className={styles.catTitle}>{catMeta?.label ?? slug.toUpperCase()}</h1>
        <p className={styles.catCount}>{filtered.length} items</p>
      </div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        {/* Family filter pills */}
        <div className={styles.filterPills}>
          {families.slice(0, 8).map((f) => (
            <button
              key={f}
              className={`${styles.pill} ${filterFamily === f ? styles.pillActive : ""}`}
              onClick={() => setFilterFamily(f)}
            >
              {f}
            </button>
          ))}
          {families.length > 8 && (
            <button className={styles.pill} onClick={() => setShowFilters(!showFilters)}>
              MORE +
            </button>
          )}
        </div>

        <div className={styles.toolbarRight}>
          {/* Search */}
          <input
            className={styles.searchInput}
            type="text"
            placeholder="SEARCH..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Sort */}
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value as SortValue)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* More filter pills if needed */}
      {showFilters && (
        <div className={styles.extraFilters}>
          {families.slice(8).map((f) => (
            <button
              key={f}
              className={`${styles.pill} ${filterFamily === f ? styles.pillActive : ""}`}
              onClick={() => setFilterFamily(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* ── Product grid ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>No products found.</div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
