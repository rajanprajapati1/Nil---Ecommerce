export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  images: string[];
  category: string;
  composition: string;
  care: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "STRUCTURAL LINEN BLAZER",
    price: "12,990.00 INR",
    description: "Relaxed-fit blazer made of linen blend fabric. Notched lapel collar and long sleeves with padded shoulders. Front welt pockets and a chest pocket. Central back vent. Front button fastening.",
    images: [
      "/images/ChatGPT Image Apr 19, 2026, 04_40_01 PM.png", 
      "/images/Gemini_Generated_Image_dmva37dmva37dmva.png", 
      "/images/Gemini_Generated_Image_xk8swdxk8swdxk8s.png"
    ],
    category: "WOMAN / COLLECTION",
    composition: "Outer shell: 55% linen, 45% viscose. Lining: 100% acetate.",
    care: "Dry clean only. Do not wash."
  },
  {
    id: "2",
    name: "OVERSIZED WOOL COAT",
    price: "18,990.00 INR",
    description: "Long sleeve coat made of wool blend fabric. Lapel collar and front welt pockets. Oversized fit with interior lining.",
    images: [
      "/images/Gemini_Generated_Image_ykdzomykdzomykdz.png", 
      "/images/men.png", 
      "/images/Gemini_Generated_Image_3wsth63wsth63wst.png"
    ],
    category: "MAN / COATS",
    composition: "80% Wool, 20% Polyamide.",
    care: "Professional dry clean only."
  },
  {
    id: "3",
    name: "ESSENTIAL HOODIE",
    price: "5,990.00 INR",
    description: "Heavyweight cotton blend hoodie. Adjustable drawstring hood, long sleeves and pouch pocket. Ribbed trims.",
    images: [
      "/images/Gemini_Generated_Image_cnmvlcnmvlcnmvlc.png",
      "/images/kids.png"
    ],
    category: "ORIGINALS / BASICS",
    composition: "Outer shell: 85% cotton, 15% polyester.",
    care: "Machine wash at max. 30ºC/86ºF with short spin cycle. Do not use bleach."
  },
  {
    id: "4",
    name: "LIMITED EDITION VINTAGE DENIM",
    price: "8,990.00 INR",
    description: "Faded vintage style denim jeans with a straight leg fit. Five-pocket design and front zip fly and metal button fastening.",
    images: [
      "/images/Gemini_Generated_Image_jguwjfjguwjfjguw.png"
    ],
    category: "WOMAN / DENIM",
    composition: "100% Cotton.",
    care: "Machine wash at max. 30ºC/86ºF inside out."
  },
  {
    id: "5",
    name: "MINIMALIST TRENCH",
    price: "15,500.00 INR",
    description: "Flowing trench coat featuring a lapel collar, long sleeves and front pockets. Adjustable belt in the same fabric. Double-breasted front fastening.",
    images: [
      "/images/ChatGPT Image Apr 19, 2026, 04_26_22 PM.png",
      "/images/women.png"
    ],
    category: "WOMAN / OUTERWEAR",
    composition: "Outer shell: 100% Lyocell.",
    care: "Professional dry clean recommended."
  },
  {
    id: "6",
    name: "LEATHER ANKLE BOOTS",
    price: "9,990.00 INR",
    description: "100% leather ankle boots. Track sole design. Elastic side gores. Back pull tab for ease.",
    images: [
      "/images/Gemini_Generated_Image_jyedc7jyedc7jyed.png"
    ],
    category: "MAN / SHOES",
    composition: "Upper: 100% cow leather. Lining: 80% polyurethane, 20% polyester.",
    care: "Do not wash. Wipe with a dry cotton cloth."
  },
  {
    id: "7",
    name: "SEAMLESS RIBBED TOP",
    price: "2,590.00 INR",
    description: "Seamless sleeveless top made of ribbed stretch fabric. Round neckline.",
    images: [
      "/images/Gemini_Generated_Image_wfzqnowfzqnowfzq.png"
    ],
    category: "ORIGINALS / KNITWEAR",
    composition: "95% polyamide, 5% elastane.",
    care: "Machine wash at max. 30ºC/86ºF."
  },
  {
    id: "8",
    name: "TAILORED TROUSERS",
    price: "6,990.00 INR",
    description: "High-waist trousers with front darts. Front pockets and false welt pockets at the back. Front zip fly, inner button and metal hook fastening.",
    images: [
      "/images/originals.png"
    ],
    category: "WOMAN / TAILORING",
    composition: "Outer shell: 70% polyester, 25% viscose, 5% elastane.",
    care: "Machine wash at max. 30ºC/86ºF."
  }
];

// Helper functions for easy access
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getRecommendedProducts = (currentId: string, limit: number = 4): Product[] => {
  // Simple mock recommendation: return random elements, excluding current
  const filtered = products.filter(p => p.id !== currentId);
  return filtered.sort(() => 0.5 - Math.random()).slice(0, limit);
};
