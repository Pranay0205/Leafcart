import type { Transaction } from "./merchantData";
import { scoreBatchOfProducts, type ProductSustainabilityScore, type ScoredTransaction } from "./geminiAI";

export interface ExtractedProduct {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  merchantName: string;
  transactionId: string;
  transactionDate: string;
}

export interface MergedTransactionData {
  allProducts: ExtractedProduct[];
  productsByMerchant: Map<string, ExtractedProduct[]>;
  productsByCategory: Map<string, ExtractedProduct[]>;
  totalProducts: number;
  totalSpent: number;
}

// Extract all products from all transactions
export function extractAllProducts(transactions: Transaction[], merchantName: string): ExtractedProduct[] {
  const products: ExtractedProduct[] = [];

  transactions.forEach((transaction) => {
    transaction.products.forEach((product) => {
      products.push({
        name: product.name,
        quantity: product.quantity,
        price: product.price.total,
        category: inferCategory(product.name),
        merchantName,
        transactionId: transaction.externalId,
        transactionDate: transaction.dateTime,
      });
    });
  });

  return products;
}

// Merge all products from multiple merchants into a structured format
export function mergeAllTransactionData(
  merchantsData: Array<{ name: string; transactions: Transaction[] }>
): MergedTransactionData {
  const allProducts: ExtractedProduct[] = [];
  const productsByMerchant = new Map<string, ExtractedProduct[]>();
  const productsByCategory = new Map<string, ExtractedProduct[]>();

  let totalSpent = 0;

  merchantsData.forEach(({ name, transactions }) => {
    const merchantProducts = extractAllProducts(transactions, name);
    allProducts.push(...merchantProducts);
    productsByMerchant.set(name, merchantProducts);

    // Group by category
    merchantProducts.forEach((product) => {
      const category = product.category || "Uncategorized";
      if (!productsByCategory.has(category)) {
        productsByCategory.set(category, []);
      }
      productsByCategory.get(category)!.push(product);
      totalSpent += product.price;
    });
  });

  return {
    allProducts,
    productsByMerchant,
    productsByCategory,
    totalProducts: allProducts.length,
    totalSpent,
  };
}

// Infer product category from name
function inferCategory(productName: string): string {
  const lower = productName.toLowerCase();

  // Food & Groceries
  if (lower.match(/food|grocery|fruit|vegetable|meat|dairy|bread|milk|cheese|egg|organic|snack|cereal/i)) {
    return "Food & Groceries";
  }

  // Household & Cleaning
  if (lower.match(/clean|detergent|soap|tissue|paper|towel|trash|bag|laundry|dish/i)) {
    return "Household & Cleaning";
  }

  // Personal Care
  if (lower.match(/shampoo|deodorant|toothpaste|lotion|cosmetic|skincare|beauty|hygiene/i)) {
    return "Personal Care";
  }

  // Electronics
  if (lower.match(/electronic|phone|computer|laptop|tablet|camera|charger|cable|headphone|speaker/i)) {
    return "Electronics";
  }

  // Clothing & Apparel
  if (lower.match(/shirt|pant|dress|shoe|sock|jacket|coat|clothing|apparel|fashion/i)) {
    return "Clothing & Apparel";
  }

  // Home & Garden
  if (lower.match(/furniture|decor|garden|plant|tool|hardware|bedding|pillow|curtain/i)) {
    return "Home & Garden";
  }

  // Baby & Kids
  if (lower.match(/baby|diaper|formula|toy|kids|children/i)) {
    return "Baby & Kids";
  }

  // Pet Supplies
  if (lower.match(/pet|dog|cat|animal|treat/i)) {
    return "Pet Supplies";
  }

  // Books & Media
  if (lower.match(/book|magazine|movie|music|dvd|cd|game/i)) {
    return "Books & Media";
  }

  return "Other";
}

// Score all products and calculate transaction and overall scores
export async function scoreAllTransactions(
  merchantsData: Array<{ name: string; transactions: Transaction[] }>,
  onProgress?: (progress: number, message: string) => void
): Promise<{
  scoredTransactions: ScoredTransaction[];
  overallScore: number;
  productScores: ProductSustainabilityScore[];
}> {
  const allScoredTransactions: ScoredTransaction[] = [];
  const allProductScores: ProductSustainabilityScore[] = [];

  let processedTransactions = 0;
  const totalTransactions = merchantsData.reduce((sum, m) => sum + m.transactions.length, 0);

  // Process each merchant's transactions
  for (const { name: merchantName, transactions } of merchantsData) {
    for (const transaction of transactions) {
      onProgress?.(
        (processedTransactions / totalTransactions) * 100,
        `Analyzing ${merchantName} transaction ${transaction.externalId}...`
      );

      // Prepare products for batch scoring
      const productsToScore = transaction.products.map((p) => ({
        name: p.name,
        category: inferCategory(p.name),
      }));

      // Score products in batches of 10 to avoid API limits
      const batchSize = 10;
      const productScores: ProductSustainabilityScore[] = [];

      for (let i = 0; i < productsToScore.length; i += batchSize) {
        const batch = productsToScore.slice(i, i + batchSize);
        const batchScores = await scoreBatchOfProducts(batch);
        productScores.push(...batchScores);
        allProductScores.push(...batchScores);

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Calculate transaction score as average of product scores
      const transactionScore =
        productScores.length > 0
          ? Math.round(productScores.reduce((sum, p) => sum + p.score, 0) / productScores.length)
          : 50;

      allScoredTransactions.push({
        transactionId: transaction.externalId,
        merchantName,
        products: productScores,
        transactionScore,
        totalAmount: transaction.price.total,
        date: transaction.dateTime,
      });

      processedTransactions++;
    }
  }

  // Calculate overall user score as average of all transaction scores
  const overallScore =
    allScoredTransactions.length > 0
      ? Math.round(allScoredTransactions.reduce((sum, t) => sum + t.transactionScore, 0) / allScoredTransactions.length)
      : 50;

  onProgress?.(100, "Analysis complete!");

  return {
    scoredTransactions: allScoredTransactions,
    overallScore,
    productScores: allProductScores,
  };
}

// Get cached scores or calculate new ones
export async function getOrCalculateScores(
  merchantsData: Array<{ name: string; transactions: Transaction[] }>,
  onProgress?: (progress: number, message: string) => void
): Promise<{
  scoredTransactions: ScoredTransaction[];
  overallScore: number;
  productScores: ProductSustainabilityScore[];
}> {
  // Check if we have cached scores in localStorage
  const cacheKey = "leafcart_scored_transactions";
  const cached = typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Check if cache is recent (less than 24 hours old)
      const cacheAge = Date.now() - parsed.timestamp;
      if (cacheAge < 24 * 60 * 60 * 1000) {
        return {
          scoredTransactions: parsed.scoredTransactions,
          overallScore: parsed.overallScore,
          productScores: parsed.productScores,
        };
      }
    } catch (e) {
      console.error("Error parsing cached scores:", e);
    }
  }

  // Calculate new scores
  const result = await scoreAllTransactions(merchantsData, onProgress);

  // Cache the results
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          ...result,
          timestamp: Date.now(),
        })
      );
    } catch (e) {
      console.error("Error caching scores:", e);
    }
  }

  return result;
}

// Clear cached scores
export function clearScoreCache() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("leafcart_scored_transactions");
  }
}
