// Preprocessed sustainability scores for products
// This file contains precalculated scores to avoid real-time API calls
// Scores will be moved to backend processing in the future

export interface PreprocessedProductScore {
  productName: string;
  score: number; // 0-100
  reasoning: string;
  category: string;
  sustainabilityFactors: {
    materials: number;
    packaging: number;
    durability: number;
    recyclability: number;
    carbonFootprint: number;
  };
}

// Common product sustainability scores database
export const preprocessedScores: Record<string, PreprocessedProductScore> = {
  // Organic/Sustainable Products (High Scores: 75-95)
  organic: {
    productName: "Organic Product",
    score: 85,
    reasoning: "Made from certified organic materials with minimal environmental impact",
    category: "Organic",
    sustainabilityFactors: { materials: 95, packaging: 75, durability: 80, recyclability: 85, carbonFootprint: 85 },
  },
  bamboo: {
    productName: "Bamboo Product",
    score: 88,
    reasoning: "Bamboo is highly renewable and biodegradable",
    category: "Sustainable Materials",
    sustainabilityFactors: { materials: 95, packaging: 80, durability: 85, recyclability: 90, carbonFootprint: 88 },
  },
  recycled: {
    productName: "Recycled Product",
    score: 82,
    reasoning: "Made from recycled materials, reducing waste and resource consumption",
    category: "Recycled",
    sustainabilityFactors: { materials: 90, packaging: 75, durability: 75, recyclability: 95, carbonFootprint: 80 },
  },

  // Electronics (Medium-Low Scores: 35-60)
  electronic: {
    productName: "Electronic Device",
    score: 45,
    reasoning: "High energy consumption in production, contains rare earth metals, limited recyclability",
    category: "Electronics",
    sustainabilityFactors: { materials: 35, packaging: 40, durability: 70, recyclability: 35, carbonFootprint: 45 },
  },

  // Plastic Products (Low Scores: 20-40)
  plastic: {
    productName: "Plastic Product",
    score: 25,
    reasoning: "Made from non-renewable petroleum, not biodegradable, contributes to pollution",
    category: "Plastic",
    sustainabilityFactors: { materials: 15, packaging: 20, durability: 50, recyclability: 30, carbonFootprint: 20 },
  },
  "single-use plastic": {
    productName: "Single-Use Plastic",
    score: 15,
    reasoning: "Single-use plastic is highly wasteful and harmful to the environment",
    category: "Disposable",
    sustainabilityFactors: { materials: 10, packaging: 10, durability: 5, recyclability: 15, carbonFootprint: 10 },
  },

  // Food & Groceries (Variable: 40-80)
  "fresh produce": {
    productName: "Fresh Produce",
    score: 75,
    reasoning: "Minimal processing, biodegradable, often locally sourced",
    category: "Food",
    sustainabilityFactors: { materials: 80, packaging: 60, durability: 50, recyclability: 95, carbonFootprint: 85 },
  },
  "processed food": {
    productName: "Processed Food",
    score: 40,
    reasoning: "High processing energy, excessive packaging, long supply chains",
    category: "Food",
    sustainabilityFactors: { materials: 35, packaging: 30, durability: 40, recyclability: 40, carbonFootprint: 35 },
  },

  // Cleaning Products
  "eco-friendly cleaner": {
    productName: "Eco-Friendly Cleaner",
    score: 78,
    reasoning: "Plant-based ingredients, biodegradable, minimal chemical impact",
    category: "Cleaning",
    sustainabilityFactors: { materials: 85, packaging: 70, durability: 75, recyclability: 80, carbonFootprint: 78 },
  },
  "chemical cleaner": {
    productName: "Chemical Cleaner",
    score: 35,
    reasoning: "Contains harsh chemicals, plastic packaging, potential water pollution",
    category: "Cleaning",
    sustainabilityFactors: { materials: 30, packaging: 25, durability: 60, recyclability: 30, carbonFootprint: 35 },
  },

  // Clothing & Textiles
  "organic cotton": {
    productName: "Organic Cotton Product",
    score: 80,
    reasoning: "Certified organic cotton, sustainable farming practices, biodegradable",
    category: "Textiles",
    sustainabilityFactors: { materials: 90, packaging: 70, durability: 80, recyclability: 85, carbonFootprint: 75 },
  },
  "fast fashion": {
    productName: "Fast Fashion Item",
    score: 25,
    reasoning: "Low quality, synthetic materials, poor labor practices, high waste",
    category: "Clothing",
    sustainabilityFactors: { materials: 20, packaging: 25, durability: 15, recyclability: 25, carbonFootprint: 30 },
  },
};

// Score product based on name matching keywords
export function getPreprocessedScore(productName: string): PreprocessedProductScore {
  const nameLower = productName.toLowerCase();

  // High sustainability keywords
  if (nameLower.includes("organic") && nameLower.includes("cotton")) return preprocessedScores["organic cotton"];
  if (nameLower.includes("organic")) return preprocessedScores["organic"];
  if (nameLower.includes("bamboo")) return preprocessedScores["bamboo"];
  if (nameLower.includes("recycled") || nameLower.includes("recycle")) return preprocessedScores["recycled"];
  if (nameLower.includes("eco-friendly") || nameLower.includes("eco friendly"))
    return preprocessedScores["eco-friendly cleaner"];

  // Food categories
  if (nameLower.match(/fruit|vegetable|fresh|produce/)) return preprocessedScores["fresh produce"];
  if (nameLower.match(/frozen|packaged|processed|snack/)) return preprocessedScores["processed food"];

  // Electronics
  if (nameLower.match(/phone|computer|laptop|tablet|electronic|charger|cable/)) return preprocessedScores["electronic"];

  // Plastic products
  if (nameLower.match(/disposable|single-use|plastic bag|straw/)) return preprocessedScores["single-use plastic"];
  if (nameLower.includes("plastic") && !nameLower.includes("free")) return preprocessedScores["plastic"];

  // Cleaning
  if (nameLower.match(/clean|detergent|soap/) && nameLower.match(/chemical|bleach|toxic/))
    return preprocessedScores["chemical cleaner"];
  if (nameLower.match(/clean|detergent|soap/)) return preprocessedScores["eco-friendly cleaner"];

  // Clothing
  if (nameLower.match(/shirt|pant|dress|clothing|apparel/) && nameLower.match(/cheap|fashion/))
    return preprocessedScores["fast fashion"];

  // Default score based on general category inference
  return getDefaultScore(productName);
}

function getDefaultScore(productName: string): PreprocessedProductScore {
  const nameLower = productName.toLowerCase();

  // High-scoring categories (70-90)
  if (nameLower.match(/organic|natural|sustainable|eco-friendly|biodegradable/)) {
    return {
      productName,
      score: 82,
      reasoning: "Eco-friendly materials with minimal environmental impact",
      category: "Sustainable Products",
      sustainabilityFactors: { materials: 88, packaging: 75, durability: 80, recyclability: 85, carbonFootprint: 82 },
    };
  }

  // Paper products - medium-high (60-70)
  if (nameLower.match(/paper|tissue|towel/)) {
    return {
      productName,
      score: 64,
      reasoning: "Biodegradable but requires tree harvesting and processing energy",
      category: "Paper Products",
      sustainabilityFactors: { materials: 68, packaging: 55, durability: 45, recyclability: 82, carbonFootprint: 62 },
    };
  }

  // Personal care - medium (45-60)
  if (nameLower.match(/shampoo|soap|lotion|cosmetic/)) {
    return {
      productName,
      score: 56,
      reasoning: "Varies by ingredients and packaging; often contains chemicals",
      category: "Personal Care",
      sustainabilityFactors: { materials: 52, packaging: 48, durability: 60, recyclability: 54, carbonFootprint: 58 },
    };
  }

  // Meat/dairy - lower (35-45)
  if (nameLower.match(/beef|meat|pork|dairy|cheese|milk/)) {
    return {
      productName,
      score: 38,
      reasoning: "High carbon footprint from livestock farming and methane emissions",
      category: "Animal Products",
      sustainabilityFactors: { materials: 35, packaging: 45, durability: 30, recyclability: 28, carbonFootprint: 25 },
    };
  }

  // Beverages in bottles - medium-low (40-55)
  if (nameLower.match(/soda|juice|water|beverage/)) {
    return {
      productName,
      score: 48,
      reasoning: "Plastic/glass bottles require significant resources and transportation",
      category: "Beverages",
      sustainabilityFactors: { materials: 42, packaging: 38, durability: 55, recyclability: 65, carbonFootprint: 45 },
    };
  }

  // Default varied score (45-65)
  const randomOffset = Math.floor(Math.random() * 20) - 10; // -10 to +10
  const baseScore = 55 + randomOffset;

  return {
    productName,
    score: baseScore,
    reasoning: "Product sustainability varies by materials, packaging, and production methods",
    category: "General",
    sustainabilityFactors: {
      materials: baseScore + 5,
      packaging: baseScore - 8,
      durability: baseScore + 3,
      recyclability: baseScore - 5,
      carbonFootprint: baseScore,
    },
  };
}

// Get alternative recommendations for low-scoring products
export function getBetterAlternatives(productName: string, currentScore: number): string[] {
  if (currentScore >= 70) return [];

  const alternatives: string[] = [];
  const nameLower = productName.toLowerCase();

  if (nameLower.includes("plastic")) {
    alternatives.push("Look for products made from bamboo, glass, or stainless steel");
    alternatives.push("Consider reusable alternatives instead of single-use items");
  }

  if (nameLower.match(/clean|detergent/)) {
    alternatives.push("Try eco-friendly cleaners with plant-based ingredients");
    alternatives.push("Look for brands like Seventh Generation or Method");
  }

  if (nameLower.match(/electronic/)) {
    alternatives.push("Consider refurbished electronics to extend product lifecycle");
    alternatives.push("Look for Energy Star certified devices");
  }

  if (nameLower.match(/clothing|apparel/)) {
    alternatives.push("Choose organic cotton or recycled fabric clothing");
    alternatives.push("Support sustainable fashion brands like Patagonia or Everlane");
  }

  if (alternatives.length === 0) {
    alternatives.push("Look for products with eco-certifications (GOTS, FSC, Fair Trade)");
    alternatives.push("Choose items with minimal or recyclable packaging");
  }

  return alternatives;
}
