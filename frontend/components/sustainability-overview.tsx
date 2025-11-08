"use client"

import type { TransactionData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SustainabilityOverviewProps {
  transactions: TransactionData[]
}

export function SustainabilityOverview({ transactions }: SustainabilityOverviewProps) {
  if (transactions.length === 0) {
    return null
  }

  // Calculate metrics across all transactions
  const allProducts = transactions.flatMap((t) => t.products)

  const overallScore = Math.round(
    allProducts.reduce((sum, p) => sum + p.sustainabilityScore, 0) / (allProducts.length || 1),
  )

  const highCount = allProducts.filter((p) => p.sustainabilityScore >= 75).length
  const mediumCount = allProducts.filter((p) => p.sustainabilityScore >= 50 && p.sustainabilityScore < 75).length
  const lowCount = allProducts.filter((p) => p.sustainabilityScore < 50).length

  // Merchant breakdown
  const merchantScores = transactions.reduce(
    (acc, txn) => {
      const avg = Math.round(
        txn.products.reduce((sum, p) => sum + p.sustainabilityScore, 0) / (txn.products.length || 1),
      )
      acc[txn.merchant.name] = (acc[txn.merchant.name] || 0) + avg
      return acc
    },
    {} as Record<string, number>,
  )

  const bestMerchant = Object.entries(merchantScores).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">{overallScore}</div>
          <p className="text-xs text-muted-foreground mt-1">across all purchases</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">High Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">{highCount}</div>
          <p className="text-xs text-muted-foreground mt-1">sustainable products</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-600">{lowCount}</div>
          <p className="text-xs text-muted-foreground mt-1">low sustainability items</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Best Merchant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{bestMerchant ? bestMerchant[0].split(" ")[0] : "N/A"}</div>
          <p className="text-xs text-muted-foreground mt-1">for sustainable choices</p>
        </CardContent>
      </Card>
    </div>
  )
}
