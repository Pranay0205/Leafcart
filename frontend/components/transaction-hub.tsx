"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TransactionData, MerchantInfo } from "@/lib/types"
import { fetchAllTransactions } from "@/lib/multi-merchant-api"

interface MerchantGroup {
  merchant: MerchantInfo
  transactions: TransactionData[]
}

export function TransactionHub() {
  const [transactions, setTransactions] = useState<TransactionData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMerchant, setSelectedMerchant] = useState<string>("all")

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const data = await fetchAllTransactions("test-user-001")
        setTransactions(data)
      } catch (error) {
        console.error("[v0] Failed to load transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  // Group transactions by merchant
  const groupedByMerchant = transactions.reduce(
    (acc, txn) => {
      const merchantId = txn.merchant.id
      if (!acc[merchantId]) {
        acc[merchantId] = {
          merchant: txn.merchant,
          transactions: [],
        }
      }
      acc[merchantId].transactions.push(txn)
      return acc
    },
    {} as Record<string, MerchantGroup>,
  )

  const merchantGroups = Object.values(groupedByMerchant).sort((a, b) => b.transactions.length - a.transactions.length)

  // Filter transactions based on selected merchant
  const filteredTransactions =
    selectedMerchant === "all" ? transactions : transactions.filter((txn) => txn.merchant.id === selectedMerchant)

  const calculateSustainabilityScore = (txn: TransactionData): number => {
    if (txn.products.length === 0) return 0
    return Math.round(txn.products.reduce((sum, p) => sum + p.sustainabilityScore, 0) / txn.products.length)
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-600"
    if (score >= 50) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-emerald-50"
    if (score >= 50) return "bg-amber-50"
    return "bg-red-50"
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Loading your transactions...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction Hub</CardTitle>
          <CardDescription>
            View all your purchases across connected merchants with sustainability scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Merchant Tabs */}
          <Tabs value={selectedMerchant} onValueChange={setSelectedMerchant} className="w-full">
            <TabsList className="grid w-full grid-cols-auto gap-2 h-auto">
              <TabsTrigger value="all">
                <span className="mr-2">All</span>
                <Badge variant="secondary">{transactions.length}</Badge>
              </TabsTrigger>
              {merchantGroups.map((group) => (
                <TabsTrigger key={group.merchant.id} value={group.merchant.id}>
                  <span className="mr-2">{group.merchant.icon}</span>
                  <span className="hidden sm:inline">{group.merchant.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {group.transactions.length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Transaction List */}
            <TabsContent value={selectedMerchant} className="mt-6 space-y-4">
              {filteredTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No transactions found for this merchant.</p>
              ) : (
                filteredTransactions.map((txn) => {
                  const score = calculateSustainabilityScore(txn)
                  const date = new Date(txn.date)
                  const formattedDate = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })

                  return (
                    <div
                      key={txn.id}
                      className={`rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer ${getScoreBg(score)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{txn.merchant.icon}</span>
                            <div>
                              <h3 className="font-semibold text-foreground">{txn.merchant.name}</h3>
                              <p className="text-sm text-muted-foreground">{formattedDate}</p>
                            </div>
                          </div>

                          {/* Products Preview */}
                          <div className="mt-3 space-y-1">
                            {txn.products.map((product) => (
                              <p key={product.id} className="text-sm text-foreground">
                                {product.name}
                                <span className={`ml-2 font-medium ${getScoreColor(product.sustainabilityScore)}`}>
                                  ({product.sustainabilityScore})
                                </span>
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Score and Total */}
                        <div className="ml-4 text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
                          <p className="text-sm text-muted-foreground">sustainability score</p>
                          <p className="text-lg font-semibold text-foreground mt-2">${txn.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </TabsContent>
          </Tabs>

          {/* Summary Stats */}
          {filteredTransactions.length > 0 && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-lg font-semibold text-foreground">
                  ${filteredTransactions.reduce((sum, t) => sum + t.total, 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p
                  className={`text-lg font-semibold ${getScoreColor(Math.round(filteredTransactions.reduce((sum, t) => sum + calculateSustainabilityScore(t), 0) / filteredTransactions.length))}`}
                >
                  {Math.round(
                    filteredTransactions.reduce((sum, t) => sum + calculateSustainabilityScore(t), 0) /
                      filteredTransactions.length,
                  )}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-lg font-semibold text-foreground">
                  {filteredTransactions.reduce((sum, t) => sum + t.products.length, 0)}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
