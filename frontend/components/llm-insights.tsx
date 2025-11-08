"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { TransactionData } from "@/lib/types"

interface LLMInsightsProps {
  transactions: TransactionData[]
}

export function LLMInsights({ transactions }: LLMInsightsProps) {
  const [insight, setInsight] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateInsight = async () => {
      if (transactions.length === 0) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "impact-analysis",
            transactions,
          }),
        })
        const data = await response.json()
        setInsight(data.insight || data.recommendation)
      } catch (error) {
        console.error("[v0] Error generating insight:", error)
        setInsight("Track more purchases to see personalized sustainability insights!")
      } finally {
        setLoading(false)
      }
    }

    generateInsight()
  }, [transactions])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading insights...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>Based on your transaction history</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-emerald-900 leading-relaxed">{insight}</p>
      </CardContent>
    </Card>
  )
}
