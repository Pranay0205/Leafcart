import { generateText } from "ai"
import type { TransactionData } from "./types"

export async function generatePersonalizedRecommendation(
  transaction: TransactionData,
  lowScoringProducts: Array<{ name: string; score: number }>,
): Promise<string> {
  const productsList = lowScoringProducts.map((p) => `${p.name} (score: ${p.score})`).join(", ")

  const prompt = `You are a sustainability advisor. Based on the user's DoorDash purchase, identify products that reduce their sustainability score and suggest eco-friendly alternatives.

Transaction from: ${transaction.merchant.name}
Purchase date: ${transaction.date}
Low-scoring products: ${productsList}

Provide specific, actionable recommendations with sustainable alternatives. Keep it under 100 words and focus on the most impactful changes they can make.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.7,
      maxTokens: 150,
    })
    return text
  } catch (error) {
    console.error("[v0] Error generating recommendation:", error)
    return generateFallbackRecommendation(lowScoringProducts)
  }
}

export async function generateChatResponse(userMessage: string, transactions: TransactionData[]): Promise<string> {
  const recentPurchases = transactions
    .slice(0, 5)
    .map((t) => `${t.merchant.name}: ${t.products.map((p) => p.name).join(", ")}`)
    .join("; ")

  const prompt = `You are an eco-conscious sustainability advisor helping users make greener purchasing choices.

User recent purchases: ${recentPurchases}

User question: "${userMessage}"

Provide helpful, encouraging advice about sustainable consumption. Focus on practical alternatives and environmental impact. Keep responses concise and actionable.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.8,
      maxTokens: 200,
    })
    return text
  } catch (error) {
    console.error("[v0] Error generating chat response:", error)
    return `I'm here to help you make more sustainable choices! Try asking about alternatives for specific products from your recent purchases, or let me know what areas you'd like to improve.`
  }
}

export async function generateImpactAnalysis(transactions: TransactionData[]): Promise<string> {
  const merchantBreakdown = transactions.reduce(
    (acc, t) => {
      acc[t.merchant.name] = (acc[t.merchant.name] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const avgScore =
    transactions.reduce(
      (sum, t) => sum + t.products.reduce((ps, p) => ps + p.sustainabilityScore, 0) / t.products.length,
      0,
    ) / transactions.length

  const prompt = `Analyze this user's sustainability across different merchants and provide insights:
- Merchant breakdown: ${JSON.stringify(merchantBreakdown)}
- Average sustainability score: ${avgScore.toFixed(1)}/100
- Total transactions analyzed: ${transactions.length}

Provide a brief 2-3 sentence analysis of their sustainability patterns and one key recommendation.`

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.6,
      maxTokens: 150,
    })
    return text
  } catch (error) {
    console.error("[v0] Error generating impact analysis:", error)
    return "Your sustainability journey is showing progress! Keep tracking your purchases to see improvements over time."
  }
}

function generateFallbackRecommendation(products: Array<{ name: string; score: number }>): string {
  return `Consider these sustainable swaps for your low-scoring items: Choose organic/local alternatives, look for minimal packaging, and opt for plant-based options when available. Even small changes add up!`
}
