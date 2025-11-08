"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GroceryItem } from "@/lib/types"

interface ProductScorecardProps {
  items: GroceryItem[]
}

function getSustainabilityColor(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-900 border-green-300"
  if (score >= 50) return "bg-yellow-100 text-yellow-900 border-yellow-300"
  return "bg-red-100 text-red-900 border-red-300"
}

function getSustainabilityLabel(score: number): string {
  if (score >= 75) return "High"
  if (score >= 50) return "Medium"
  return "Low"
}

export function ProductScorecard({ items }: ProductScorecardProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Analyzed Products</h3>
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No products analyzed yet. Connect your Amazon Fresh account to get started.
        </p>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity}x • ${item.price.toFixed(2)}
                    </p>
                    {item.farmName && <p className="text-xs text-muted-foreground mt-1">Farm: {item.farmName}</p>}
                  </div>
                  <Badge className={getSustainabilityColor(item.sustainabilityScore)}>
                    {getSustainabilityLabel(item.sustainabilityScore)}
                    <span className="ml-2 font-semibold">{item.sustainabilityScore}%</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
