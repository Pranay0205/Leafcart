import {
  generatePersonalizedRecommendation,
  generateChatResponse,
  generateImpactAnalysis,
} from "@/lib/enhanced-ai-chat"
import type { TransactionData } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, transaction, lowScoringProducts, userMessage, transactions } = body

    if (type === "transaction-recommendation") {
      const recommendation = await generatePersonalizedRecommendation(
        transaction as TransactionData,
        lowScoringProducts,
      )
      return NextResponse.json({ recommendation })
    } else if (type === "chat") {
      const response = await generateChatResponse(userMessage, transactions as TransactionData[])
      return NextResponse.json({ response })
    } else if (type === "impact-analysis") {
      const insight = await generateImpactAnalysis(transactions as TransactionData[])
      return NextResponse.json({ insight, recommendation: insight })
    }

    return NextResponse.json({ error: "Unknown request type" }, { status: 400 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to generate recommendation" }, { status: 500 })
  }
}
