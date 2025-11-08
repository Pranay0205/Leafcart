// Knot API client for Amazon Fresh transaction tracking
// Uses basic auth with merchant_id 44 for Amazon Fresh

const KNOT_BASE_URL = "https://development.knotapi.com"

// These credentials should be stored in environment variables
const KNOT_CLIENT_ID = process.env.KNOT_CLIENT_ID || "demo_client_id"
const KNOT_SECRET = process.env.KNOT_SECRET || "demo_secret"

interface SyncTransactionsRequest {
  merchant_id: number
  external_user_id: string
  cursor?: string
  limit?: number
}

interface Product {
  external_id: string
  name: string
  url: string
  quantity: number
  price: {
    unit_price: number
    total: number
  }
}

interface Transaction {
  id: string
  external_id: string
  datetime: string
  order_status: string
  products: Product[]
  price: {
    total: string
  }
}

interface TransactionResponse {
  merchant: {
    id: number
    name: string
  }
  transactions: Transaction[]
  next_cursor?: string
}

// Create basic auth header
function getAuthHeader(): string {
  const credentials = `${KNOT_CLIENT_ID}:${KNOT_SECRET}`
  const encoded = Buffer.from(credentials).toString("base64")
  return `Basic ${encoded}`
}

// Sync transactions from Knot API
export async function syncTransactions(request: SyncTransactionsRequest): Promise<TransactionResponse> {
  const body = {
    merchant_id: request.merchant_id,
    external_user_id: request.external_user_id,
    limit: request.limit || 10,
    ...(request.cursor && { cursor: request.cursor }),
  }

  try {
    const response = await fetch(`${KNOT_BASE_URL}/transactions/sync`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Knot API error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Knot API sync error:", error)
    throw error
  }
}

// Filter products to only include grocery items (detect by keywords)
export function filterGroceryProducts(products: Product[]): Product[] {
  const groceryKeywords = [
    "amazon fresh",
    "vegetable",
    "fruit",
    "organic",
    "produce",
    "dairy",
    "milk",
    "cheese",
    "egg",
    "meat",
    "chicken",
    "beef",
    "fish",
    "bread",
    "grain",
    "cereal",
    "rice",
    "pasta",
    "bean",
    "nut",
    "seed",
    "oil",
    "sauce",
    "spice",
    "tea",
    "coffee",
    "juice",
    "water",
    "beverage",
    "almond",
    "honey",
    "yogurt",
  ]

  return products.filter((product) => groceryKeywords.some((keyword) => product.name.toLowerCase().includes(keyword)))
}
