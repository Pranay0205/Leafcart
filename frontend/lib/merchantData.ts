// Import all merchant transaction data
import amazonData from "@/public/api-sample-responses/development_44_amazon.json";
import walmartData from "@/public/api-sample-responses/development_45_walmart.json";
import targetData from "@/public/api-sample-responses/development_12_target.json";
import doordashData from "@/public/api-sample-responses/development_19_doordash.json";
import costcoData from "@/public/api-sample-responses/development_165_costco.json";
import ubereatsData from "@/public/api-sample-responses/development_36_ubereats.json";
import instacartData from "@/public/api-sample-responses/development_40_instacart.json";

export interface Product {
  externalId: string;
  name: string;
  url: string;
  quantity: number;
  price: {
    subTotal: number;
    total: number;
    currency: string;
    unitPrice: number;
  };
  eligibility: string[];
}

export interface Transaction {
  externalId: string;
  dateTime: string;
  url: string;
  orderStatus: string;
  score?: number;
  paymentMethods: Array<{
    externalId: string;
    type: string;
    brand: string;
    lastFour: string;
    transactionAmount: string;
  }>;
  price: {
    subTotal: number;
    adjustments: Array<{
      type: string;
      label: string;
      amount: number;
    }>;
    total: number;
    currency: string;
  };
  products: Product[];
}

export interface MerchantData {
  id: string;
  name: string;
  color: string;
  connected: boolean;
  transactions: Transaction[];
}

// Calculate sustainability score based on products
function calculateTransactionScore(transaction: Transaction): number {
  // Simple scoring logic - can be enhanced
  let score = 50; // Base score

  const sustainableKeywords = [
    "organic",
    "eco",
    "green",
    "natural",
    "recycled",
    "bamboo",
    "sustainable",
    "plant-based",
  ];
  const unsustainableKeywords = ["plastic", "disposable", "single-use"];

  transaction.products.forEach((product) => {
    const nameLower = product.name.toLowerCase();

    // Add points for sustainable products
    sustainableKeywords.forEach((keyword) => {
      if (nameLower.includes(keyword)) score += 5;
    });

    // Deduct points for unsustainable products
    unsustainableKeywords.forEach((keyword) => {
      if (nameLower.includes(keyword)) score -= 3;
    });
  });

  // Normalize score between 0-100
  return Math.min(100, Math.max(0, score));
}

export const merchants: MerchantData[] = [
  {
    id: "amazon",
    name: "Amazon",
    color: "#FF9900",
    connected: true,
    transactions: (amazonData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "walmart",
    name: "Walmart",
    color: "#0071CE",
    connected: true,
    transactions: (walmartData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "target",
    name: "Target",
    color: "#CC0000",
    connected: true,
    transactions: (targetData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "doordash",
    name: "DoorDash",
    color: "#FF3008",
    connected: true,
    transactions: (doordashData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "costco",
    name: "Costco",
    color: "#0468B1",
    connected: true,
    transactions: (costcoData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "ubereats",
    name: "Uber Eats",
    color: "#000000",
    connected: true,
    transactions: (ubereatsData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
  {
    id: "instacart",
    name: "Instacart",
    color: "#43B02A",
    connected: true,
    transactions: (instacartData as any[]).map((t: any) => ({
      ...t,
      score: calculateTransactionScore(t as Transaction),
    })) as Transaction[],
  },
];

// Get total transaction count across all merchants
export function getTotalTransactionCount(): number {
  return merchants.reduce((total, merchant) => total + merchant.transactions.length, 0);
}

// Get total spending across all merchants
export function getTotalSpending(): number {
  return merchants.reduce((total, merchant) => {
    return (
      total +
      merchant.transactions.reduce((merchantTotal, transaction) => {
        return merchantTotal + transaction.price.total;
      }, 0)
    );
  }, 0);
}

// Get overall sustainability score
export function getOverallScore(): number {
  const allTransactions = merchants.flatMap((m) => m.transactions);
  if (allTransactions.length === 0) return 0;

  const totalScore = allTransactions.reduce((sum, t) => sum + (t.score || 50), 0);
  return Math.round(totalScore / allTransactions.length);
}
