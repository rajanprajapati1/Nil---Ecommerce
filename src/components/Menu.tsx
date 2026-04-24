import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./Menu.module.css";
import { getZaraCategory } from "@/data/zaraParser";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get first non-video image or first image from a category
function getCategoryImage(key: "womens" | "mens" | "kids" | "perfumes"): string {
  const products = getZaraCategory(key);
  for (const p of products) {
    const img = p.images?.[0] ?? "";
    if (img && !img.split("?")[0].endsWith(".mp4")) return img;
  }
  return products?.[0]?.images?.[0] ?? "";
}

const menuData = [
  {
    name: "WOMAN",
    slug: "woman",
    catKey: "womens" as const,
    groups: [
      { num: "01", label: "NEW IN", links: ["THE NEW", "THE ITEM", "CLUB SERIES"] },
      { num: "02", label: "TRENDS", links: ["SPRING LOOKS", "ALL WHITES", "LINEN"] },
      { num: "03", label: "COLLECTION", links: ["BEST SELLERS", "DRESSES", "TOPS", "SHIRTS", "T-SHIRTS", "TROUSERS"] },
    ],
  },
  {
    name: "MAN",
    slug: "man",
    catKey: "mens" as const,
    groups: [
      { num: "01", label: "NEW IN", links: ["NEW ARRIVALS", "BASICS", "TRENDING"] },
      { num: "02", label: "TAILORING", links: ["SUITS", "BLAZERS", "TROUSERS"] },
      { num: "03", label: "COLLECTION", links: ["T-SHIRTS", "JEANS", "SWEATERS", "JACKETS"] },
    ],
  },
  {
    name: "KIDS",
    slug: "kids",
    catKey: "kids" as const,
    groups: [
      { num: "01", label: "NEW IN", links: ["GIRL", "BOY", "BABY"] },
      { num: "02", label: "EDITION", links: ["SPECIAL OCCASIONS", "BASICS"] },
      { num: "03", label: "COLLECTION", links: ["SHIRTS", "TROUSERS", "KNITWEAR", "SHOES"] },
    ],
  },
  {
    name: "PERFUMES",
    slug: "perfumes",
    catKey: "perfumes" as const,
    groups: [
      { num: "01", label: "WOMAN", links: ["NIGHT", "DAY", "FLORAL"] },
      { num: "02", label: "MAN", links: ["WOODY", "CITRUS", "SPICY"] },
      { num: "03", label: "HOME", links: ["CANDLES", "DIFFUSERS"] },
    ],
  }];

export default function Menu({ isOpen, onClose }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLElement | null)[]>([]);
  const categoryRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const subContentRefs = useRef<(HTMLElement | null)[]>([]);
  const dotRef = useRef<HTMLDivElement>(null);

  const [activeCat, setActiveCat] = useState(0);
  const [isInitialOpen, setIsInitialOpen] = useState(false);

  // 1. Handle Open/Close Menu Animation
  useEffect(() => {
    if (isOpen) {
      setIsInitialOpen(true);
      gsap.to(menuRef.current, {
        duration: 0.8,
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power4.inOut",
      });

      // Initial stagger reveal of EVERYTHING
      gsap.fromTo(
        linksRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.4,
          onComplete: () => setIsInitialOpen(false)
        }
      );
    } else {
      gsap.to(menuRef.current, {
        duration: 0.8,
        clipPath: "inset(0% 0% 100% 0%)",
        ease: "power4.inOut",
      });
    }
  }, [isOpen]);

  // 2. Handle active category dot positioning
  useEffect(() => {
    if (!isOpen) return;

    const target = categoryRefs.current[activeCat];
    if (target && dotRef.current) {
      const top = target.offsetTop;
      const height = target.offsetHeight;
      gsap.to(dotRef.current, {
        y: top + height / 2 - 3,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  }, [activeCat, isOpen]);

  // 3. Handle category switching animation for the 2nd and 3rd parts
  useEffect(() => {
    if (!isOpen || isInitialOpen) return;

    // When category changes, animate the sub items and feature image
    gsap.fromTo(
      subContentRefs.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
    );
  }, [activeCat, isInitialOpen, isOpen]);

  const addGlobalRef = (el: HTMLElement | null) => {
    if (el && !linksRef.current.includes(el)) linksRef.current.push(el);
  };

  const addSubRef = (el: HTMLElement | null) => {
    if (el && !subContentRefs.current.includes(el)) subContentRefs.current.push(el);
  };

  const currentData = menuData[activeCat];

  return (
    <div className={styles.menuOverlay} ref={menuRef}>
      <div className={styles.menuContainer}>
        {/* PART 1: Main Categories */}
        <div className={styles.mainCol}>
          <div ref={dotRef} className={styles.activeDot}></div>
          {menuData.map((cat, i) => (
            <h2
              key={cat.name}
              ref={(el) => {
                categoryRefs.current[i] = el;
                addGlobalRef(el);
              }}
              onClick={() => setActiveCat(i)}
            >
              <Link href={`/category/${cat.slug}`} onClick={onClose}>
                {cat.name}
              </Link>
            </h2>
          ))}
          {/* TRAVEL MODE — special link */}
          <h2
            ref={(el) => addGlobalRef(el)}
            style={{ marginTop: '8px' }}
          >
            <Link href="/travel" onClick={onClose} style={{ color: 'inherit' }}>
              • TRAVEL MODE
            </Link>
          </h2>
        </div>

        {/* PART 2: Sub Categories */}
        <div className={styles.subCol}>
          {currentData.groups.map((group, i) => (
            <div
              key={`${currentData.name}-${i}`}
              className={styles.subCategoryBlock}
              ref={(el) => {
                addGlobalRef(el);
                addSubRef(el);
              }}
            >
              <span className={styles.subNumber}>[{group.num}]</span>
              <span className={styles.subLabel}>{group.label}</span>
              <div className={styles.subLinks}>
                {group.links.map((link) => (
                  <Link
                    href={`/category/${currentData.slug}`}
                    key={link}
                    onClick={onClose}
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PART 3: Featured Image */}
        <div
          className={styles.featureCol}
          ref={(el) => {
            addGlobalRef(el);
            addSubRef(el);
          }}
        >
          <div className={styles.featureImage}>
            <img
              src={getCategoryImage(currentData?.catKey)}
              alt={currentData.name}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
