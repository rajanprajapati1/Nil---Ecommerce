import rawData from "./zaraProducts.json";

export interface ZaraColor {
  name: string;
  hex: string;
}

export interface ZaraProduct {
  id: string;
  name: string;
  price: string;
  priceRaw: number;
  images: string[];
  category: "WOMAN" | "MAN" | "KIDS" | "PERFUMES" | string;
  familyName: string;
  subfamilyName: string;
  description: string;
  availability: string;
  colors: ZaraColor[];
  keyword: string;
  reference: string;
}

export type CategoryKey = "womens" | "mens" | "kids" | "perfumes";

const data = rawData as {
  womens: ZaraProduct[];
  mens: ZaraProduct[];
  kids: ZaraProduct[];
  perfumes: ZaraProduct[];
};

export const zaraCategories: { key: CategoryKey; label: string; slug: string }[] = [
  { key: "womens",   label: "WOMAN",     slug: "woman"    },
  { key: "mens",     label: "MAN",       slug: "man"      },
  { key: "kids",     label: "KIDS",      slug: "kids"     },
  { key: "perfumes", label: "PERFUMES",  slug: "perfumes" },
];

/** All products from one category */
export function getZaraCategory(key: CategoryKey): ZaraProduct[] {
  return data[key] ?? [];
}

/** Slug → products */
export function getZaraBySlug(slug: string): ZaraProduct[] {
  const cat = zaraCategories.find((c) => c.slug === slug);
  return cat ? getZaraCategory(cat.key) : [];
}

/** Product by id (search all categories) */
export function getZaraProductById(id: string): ZaraProduct | undefined {
  for (const key of Object.keys(data) as CategoryKey[]) {
    const found = data[key].find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

/** Recommended products (same category, exclude current) */
export function getZaraRecommended(product: ZaraProduct, limit = 6): ZaraProduct[] {
  const catKey = zaraCategories.find((c) => c.label === product.category)?.key;
  const pool = catKey ? data[catKey] : data.womens;
  return pool.filter((p) => p.id !== product.id).slice(0, limit);
}

/** Complete the look products (same category, different family) */
export function getZaraCompleteTheLook(product: ZaraProduct, limit = 4): ZaraProduct[] {
  const catKey = zaraCategories.find((c) => c.label === product.category)?.key;
  const pool = catKey ? data[catKey] : data.womens;
  return pool
    .filter((p) => p.id !== product.id && p.familyName !== product.familyName)
    .slice(0, limit);
}

/** A few (up to `limit`) products per category for the homepage */
export function getZaraHomepageProducts(limit = 4): Record<CategoryKey, ZaraProduct[]> {
  return {
    womens:   data.womens.slice(0, limit),
    mens:     data.mens.slice(0, limit),
    kids:     data.kids.slice(0, limit),
    perfumes: data.perfumes.slice(0, limit),
  };
}
