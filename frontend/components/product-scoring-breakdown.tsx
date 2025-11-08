"use client"
import { Progress } from "@/components/ui/progress"
import type { GroceryItem } from "@/lib/types"

interface ProductScoringBreakdownProps {
  item: GroceryItem
}

export function ProductScoringBreakdown({ item }: ProductScoringBreakdownProps) {
  // Mock scoring factors for demonstration
  const factors = {
    organic: item.sustainabilityScore >= 75 ? 90 : item.sustainabilityScore >= 50 ? 60 : 30,
    transportation: item.sustainabilityScore >= 75 ? 85 : item.sustainabilityScore >= 50 ? 65 : 40,
    packaging: item.sustainabilityScore >= 75 ? 80 : item.sustainabilityScore >= 50 ? 55 : 35,
    certification: item.sustainabilityScore >= 75 ? 95 : item.sustainabilityScore >= 50 ? 70 : 25,
    waterUsage: item.sustainabilityScore >= 75 ? 85 : item.sustainabilityScore >= 50 ? 60 : 35,
  }

  const getFactorColor = (score: number): string => {
    if (score >= 75) return "bg-green-500"
    if (score >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Score</span>
          <span className="text-2xl font-bold text-emerald-600">{item.sustainabilityScore}%</span>
        </div>
        <Progress value={item.sustainabilityScore} className="h-2" />
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Scoring Factors</h4>

        {Object.entries(factors).map(([key, score]) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</span>
              <span className="font-medium">{score}%</span>
            </div>
            <Progress value={score} className="h-1" />
          </div>
        ))}
      </div>

      <div className="pt-3 border-t">
        <h4 className="text-sm font-semibold mb-2">What Affects This Score</h4>
        <ul className="text-xs space-y-1 text-muted-foreground">
          <li>• Organic or Fair Trade certification</li>
          <li>• Distance traveled from farm to store</li>
          <li>• Packaging materials and recyclability</li>
          <li>• Water and resource usage</li>
          <li>• Environmental impact practices</li>
        </ul>
      </div>
    </div>
  )
}
