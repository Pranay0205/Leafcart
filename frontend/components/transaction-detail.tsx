"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TransactionData } from "@/lib/types"

interface TransactionDetailProps {
  transaction: TransactionData | null
  onClose: () => void
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const [showLLMRecommendation, setShowLLMRecommendation] = useState(false)
  const [llmRecommendation, setLlmRecommendation] = useState("")

  if (!transaction) {
    return null
  }

  const avgScore = Math.round(
    transaction.products.reduce((sum, p) => sum + p.sustainabilityScore, 0) / transaction.products.length,
  )

  const lowScoringProducts = transaction.products
    .filter((p) => p.sustainabilityScore < 60)
    .sort((a, b) => a.sustainabilityScore - b.sustainabilityScore)

  const generateRecommendation = async () => {
    setShowLLMRecommendation(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "transaction-recommendation",
          transaction,
          lowScoringProducts: lowScoringProducts.map((p) => ({
            name: p.name,
            score: p.sustainabilityScore,
          })),
        }),
      })
      const data = await response.json()
      setLlmRecommendation(data.recommendation)
    } catch (error) {
      console.error("[v0] Error generating recommendation:", error)
      setLlmRecommendation("Unable to generate recommendation. Please try again.")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600 bg-emerald-50"
    if (score >= 50) return "text-amber-600 bg-amber-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return "bg-emerald-100 text-emerald-800"
    if (score >= 50) return "bg-amber-100 text-amber-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-background border-b">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">{transaction.merchant.icon}</span>
                {transaction.merchant.name}
              </CardTitle>
              <CardDescription>
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${getScoreColor(avgScore)}`}>
              <p className="text-sm font-medium mb-1">Avg Score</p>
              <p className="text-3xl font-bold">{avgScore}</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 text-blue-600">
              <p className="text-sm font-medium mb-1">Total Items</p>
              <p className="text-3xl font-bold">{transaction.products.length}</p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 text-purple-600">
              <p className="text-sm font-medium mb-1">Total Spent</p>
              <p className="text-3xl font-bold">${transaction.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Products List */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Products</h3>
            <div className="space-y-2">
              {transaction.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.farmName} • Qty: {product.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className={getScoreBadgeColor(product.sustainabilityScore)}>
                      Score: {product.sustainabilityScore}
                    </Badge>
                    <p className="text-sm font-medium mt-1">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Scoring Products Highlight */}
          {lowScoringProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Low Sustainability Items</h4>
              <p className="text-sm text-red-800 mb-3">
                {lowScoringProducts.length} item{lowScoringProducts.length !== 1 ? "s" : ""} in this purchase could be
                swapped for more sustainable alternatives.
              </p>
              <div className="space-y-1 text-sm">
                {lowScoringProducts.map((product) => (
                  <p key={product.id} className="text-red-700">
                    • {product.name} ({product.sustainabilityScore}/100)
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* LLM Recommendations */}
          <div>
            {!showLLMRecommendation ? (
              <Button onClick={generateRecommendation} className="w-full bg-emerald-600 hover:bg-emerald-700">
                Get AI Recommendations
              </Button>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-900 mb-2">AI Recommendations</h4>
                <p className="text-emerald-800 text-sm whitespace-pre-wrap">{llmRecommendation}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
