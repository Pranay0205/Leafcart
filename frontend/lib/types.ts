export interface TransactionData {
  id: string
  date: string
  total: number
  products: GroceryItem[]
  merchant: MerchantInfo
  userId: string
}

export interface MerchantInfo {
  id: string
  name: string
  icon: string
  category: "grocery" | "delivery" | "other"
}

export interface GroceryItem {
  id: string
  name: string
  quantity: number
  price: number
  sustainabilityScore: number
  farmName?: string
}

export interface SustainabilityMetrics {
  totalScore: number // 0-100
  productsAnalyzed: number
  averageScore: number
  highSustainability: number // count
  mediumSustainability: number // count
  lowSustainability: number // count
  monthlyTrend: Array<{ month: string; score: number }>
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export interface UserProfile {
  userId: string
  email: string
  displayName?: string
  connectedMerchants: MerchantConnection[]
  createdAt: Date
  updatedAt: Date
}

export interface MerchantConnection {
  merchantId: string
  merchantName: string
  connected: boolean
  connectedAt?: Date
  status: "active" | "disconnected" | "error"
}
