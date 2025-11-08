// Multi-merchant transaction fetching and consolidation

import type { TransactionData, MerchantInfo } from "./types"

export const SUPPORTED_MERCHANTS: Record<string, MerchantInfo> = {
  amazon: {
    id: "amazon",
    name: "Amazon Fresh",
    icon: "🛒",
    category: "grocery",
  },
  doordash: {
    id: "doordash",
    name: "DoorDash",
    icon: "🚗",
    category: "delivery",
  },
  uber_eats: {
    id: "uber_eats",
    name: "Uber Eats",
    icon: "🍽️",
    category: "delivery",
  },
  instacart: {
    id: "instacart",
    name: "Instacart",
    icon: "🛍️",
    category: "grocery",
  },
  whole_foods: {
    id: "whole_foods",
    name: "Whole Foods",
    icon: "🥬",
    category: "grocery",
  },
}

// Mock transaction data for testing
const mockTransactions: TransactionData[] = [
  {
    id: "txn-001",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    total: 67.89,
    merchant: SUPPORTED_MERCHANTS.amazon,
    userId: "test-user-001",
    products: [
      {
        id: "prod-001",
        name: "Organic Spinach",
        quantity: 1,
        price: 3.99,
        sustainabilityScore: 88,
        farmName: "Local Harvest Farm",
      },
      {
        id: "prod-002",
        name: "Free-Range Eggs",
        quantity: 1,
        price: 7.99,
        sustainabilityScore: 82,
        farmName: "Happy Hens Farm",
      },
      {
        id: "prod-003",
        name: "Almond Butter",
        quantity: 1,
        price: 12.99,
        sustainabilityScore: 71,
        farmName: "Organic Valley",
      },
    ],
  },
  {
    id: "txn-002",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    total: 45.23,
    merchant: SUPPORTED_MERCHANTS.doordash,
    userId: "test-user-001",
    products: [
      {
        id: "prod-004",
        name: "Salad Bowl",
        quantity: 1,
        price: 14.99,
        sustainabilityScore: 65,
        farmName: "Unknown",
      },
      {
        id: "prod-005",
        name: "Grilled Chicken",
        quantity: 1,
        price: 16.99,
        sustainabilityScore: 55,
        farmName: "Conventional Farm",
      },
      {
        id: "prod-006",
        name: "Bottled Water",
        quantity: 1,
        price: 3.99,
        sustainabilityScore: 42,
        farmName: "Unknown",
      },
    ],
  },
  {
    id: "txn-003",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    total: 52.45,
    merchant: SUPPORTED_MERCHANTS.instacart,
    userId: "test-user-001",
    products: [
      {
        id: "prod-007",
        name: "Organic Tomatoes",
        quantity: 4,
        price: 8.99,
        sustainabilityScore: 85,
        farmName: "Local Farm Co-op",
      },
      {
        id: "prod-008",
        name: "Grass-Fed Beef",
        quantity: 1,
        price: 28.99,
        sustainabilityScore: 78,
        farmName: "Sustainable Pastures",
      },
      {
        id: "prod-009",
        name: "Plant-Based Milk",
        quantity: 1,
        price: 5.99,
        sustainabilityScore: 72,
        farmName: "EcoMilk Co",
      },
    ],
  },
  {
    id: "txn-004",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    total: 38.67,
    merchant: SUPPORTED_MERCHANTS.uber_eats,
    userId: "test-user-001",
    products: [
      {
        id: "prod-010",
        name: "Buddha Bowl",
        quantity: 1,
        price: 15.99,
        sustainabilityScore: 68,
        farmName: "Local Kitchen",
      },
      {
        id: "prod-011",
        name: "Vegan Smoothie",
        quantity: 1,
        price: 8.99,
        sustainabilityScore: 74,
        farmName: "Fresh Juice Bar",
      },
    ],
  },
]

export async function fetchTransactionsForMerchant(
  merchantId: string,
  userId: string,
  limit = 20,
): Promise<TransactionData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Return mock data for specified merchant
  return mockTransactions.filter((txn) => txn.merchant.id === merchantId && txn.userId === userId).slice(0, limit)
}

export async function fetchAllTransactions(userId: string, limit = 50): Promise<TransactionData[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return all mock transactions for user, sorted by date (newest first)
  return mockTransactions
    .filter((txn) => txn.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
}

export function getMerchantInfo(merchantId: string): MerchantInfo | null {
  return SUPPORTED_MERCHANTS[merchantId] || null
}

export function getAllSupportedMerchants(): MerchantInfo[] {
  return Object.values(SUPPORTED_MERCHANTS)
}
