import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
});

export interface ProductSustainabilityScore {
  productId: string;
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

export interface ScoredTransaction {
  transactionId: string;
  merchantName: string;
  products: ProductSustainabilityScore[];
  transactionScore: number; // Average of all product scores
  totalAmount: number;
  date: string;
}

// Helper function to batch products for API calls
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Get better product suggestions using Gemini AI
export async function getBetterProductSuggestion(
  productName: string,
  currentScore: number,
  category?: string
): Promise<string> {
  try {
    const prompt = `Suggest 2 eco-friendly alternatives for "${productName}" (Score: ${currentScore}/100).

Be concise:
• Product name
• Why it's better (1 sentence)
• Where to buy

Keep it under 100 words total.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return (
      response.text ||
      "I couldn't find better alternatives right now. Try looking for products with eco-certifications like GOTS, FSC, or Fair Trade! 🌱"
    );
  } catch (error) {
    console.error("Error getting product suggestions:", error);
    return "I'm having trouble connecting right now. Generally, look for products made with organic materials, minimal packaging, and recognized eco-certifications! 🌿";
  }
}

// Score a single product using Gemini AI
export async function scoreProductWithAI(productName: string, category?: string): Promise<ProductSustainabilityScore> {
  try {
    const prompt = `You are a sustainability expert. Analyze this product and provide a comprehensive environmental sustainability score.

Product Name: ${productName}
Category: ${category || "Unknown"}

Score products 0-100 (100 = most sustainable). Use this scale:
• 85-100: Organic/bamboo/recycled materials (e.g., "Organic Cotton T-Shirt" = 88)
• 70-84: Eco-friendly items (e.g., "Reusable Water Bottle" = 75)
• 50-69: Standard products (e.g., "Cotton Blend Hoodie" = 62)
• 30-49: Resource-intensive (e.g., "Laptop Computer" = 42)
• 10-29: Harmful products (e.g., "Plastic Water Bottles 24-Pack" = 22)

Examples:
- "Organic Banana" → score: 92 (organic, biodegradable, low carbon)
- "iPhone 15" → score: 38 (rare earth metals, high energy, e-waste)
- "Single-Use Plastic Fork" → score: 8 (petroleum-based, non-recyclable)
- "Bamboo Toothbrush" → score: 86 (renewable, biodegradable)

Return ONLY this JSON:
{
  "score": (0-100),
  "reasoning": "Why this score (1 sentence)",
  "category": "Product category",
  "sustainabilityFactors": {
    "materials": (0-100),
    "packaging": (0-100),
    "durability": (0-100),
    "recyclability": (0-100),
    "carbonFootprint": (0-100)
  }
}`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      productId: `${productName}-${Date.now()}`,
      productName,
      score: parsed.score || 50,
      reasoning: parsed.reasoning || "Unable to analyze",
      category: parsed.category || category || "Unknown",
      sustainabilityFactors: parsed.sustainabilityFactors || {
        materials: 50,
        packaging: 50,
        durability: 50,
        recyclability: 50,
        carbonFootprint: 50,
      },
    };
  } catch (error) {
    console.error("Error scoring product with AI:", error);
    // Return fallback score
    return {
      productId: `${productName}-${Date.now()}`,
      productName,
      score: 50,
      reasoning: "Unable to analyze product with AI",
      category: category || "Unknown",
      sustainabilityFactors: {
        materials: 50,
        packaging: 50,
        durability: 50,
        recyclability: 50,
        carbonFootprint: 50,
      },
    };
  }
}

// Score multiple products in batch (to optimize API calls)
export async function scoreBatchOfProducts(
  products: Array<{ name: string; category?: string }>
): Promise<ProductSustainabilityScore[]> {
  try {
    const productList = products.map((p, i) => `${i + 1}. ${p.name} (Category: ${p.category || "Unknown"})`).join("\n");

    const prompt = `You are a sustainability expert. Analyze these products and provide environmental sustainability scores for each.

Products:
${productList}

For each product, provide a JSON object with:
- score (0-100, where 100 is most sustainable)
- reasoning (brief explanation)
- category (product category)
- sustainabilityFactors (materials, packaging, durability, recyclability, carbonFootprint - each 0-100)

Return a JSON array with exactly ${products.length} objects, one for each product in order.

Consider:
- Organic, recycled, or renewable materials score higher
- Minimal or eco-friendly packaging scores higher
- Durable, long-lasting products score higher
- Recyclable or biodegradable products score higher
- Single-use plastics and fast fashion score very low

Return ONLY the JSON array, no additional text.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const text = response.text || "";

    // Parse JSON array from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return products.map((product, index) => {
      const aiResult = parsed[index] || {};
      return {
        productId: `${product.name}-${Date.now()}-${index}`,
        productName: product.name,
        score: aiResult.score || 50,
        reasoning: aiResult.reasoning || "Unable to analyze",
        category: aiResult.category || product.category || "Unknown",
        sustainabilityFactors: aiResult.sustainabilityFactors || {
          materials: 50,
          packaging: 50,
          durability: 50,
          recyclability: 50,
          carbonFootprint: 50,
        },
      };
    });
  } catch (error) {
    console.error("Error scoring products in batch:", error);
    // Return fallback scores
    return products.map((product, index) => ({
      productId: `${product.name}-${Date.now()}-${index}`,
      productName: product.name,
      score: 50,
      reasoning: "Unable to analyze product with AI",
      category: product.category || "Unknown",
      sustainabilityFactors: {
        materials: 50,
        packaging: 50,
        durability: 50,
        recyclability: 50,
        carbonFootprint: 50,
      },
    }));
  }
}

// Chat with AI about transactions and sustainability
export async function chatWithAI(
  message: string,
  context?: {
    transactions?: ScoredTransaction[];
    userScore?: number;
  }
): Promise<string> {
  try {
    let contextInfo = "";
    if (context) {
      if (context.userScore !== undefined) {
        contextInfo += `User's Overall Sustainability Score: ${context.userScore}/100\n\n`;
      }
      if (context.transactions && context.transactions.length > 0) {
        contextInfo += `Recent Transactions:\n`;
        context.transactions.slice(0, 5).forEach((t) => {
          contextInfo += `- ${t.merchantName}: $${t.totalAmount.toFixed(2)} (Score: ${t.transactionScore}/100)\n`;
        });
        contextInfo += "\n";
      }
    }

    const prompt = `You are a helpful sustainability assistant for LeafCart, a platform that helps users track and improve their environmental impact through shopping choices.

${contextInfo}User Question: ${message}

Provide a helpful, friendly, and informative response. Focus on:
- Practical sustainability advice
- Eco-friendly product alternatives
- Understanding sustainability scores
- Tips to improve environmental impact
- Positive encouragement

Keep responses concise (2-3 paragraphs max) and actionable.`;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I'm here to help you make sustainable choices! 🌱";
  } catch (error) {
    console.error("Error chatting with AI:", error);
    return "I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that every sustainable choice makes a difference! 🌱";
  }
}
