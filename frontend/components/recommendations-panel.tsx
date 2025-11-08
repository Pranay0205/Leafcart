"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductRecommendation } from "@/lib/recommendations"

interface RecommendationsPanelProps {
  recommendations: ProductRecommendation[]
  insight: string
}

export function RecommendationsPanel({ recommendations, insight }: RecommendationsPanelProps) {
  return (
    <div className="space-y-4">
      {/* Insight Card */}
      <Card className="bg-emerald-50 border-emerald-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Insight</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-900">{insight}</p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recommendations</CardTitle>
            <CardDescription>Products to swap for better impact</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="border border-emerald-100 rounded-lg p-3 space-y-2">
                <div>
                  <p className="text-sm font-medium text-red-600">Current: {rec.productName}</p>
                  <Badge variant="outline" className="mt-1">
                    Score: {rec.currentScore}%
                  </Badge>
                </div>

                <div className="flex items-center justify-center text-emerald-600">
                  <span className="text-xs font-semibold">↓ SWITCH TO ↓</span>
                </div>

                <div>
                  <p className="text-sm font-medium text-emerald-600">Try: {rec.recommendedAlternative}</p>
                  <Badge className="mt-1 bg-emerald-100 text-emerald-900 border-emerald-300">
                    Score: {rec.alternativeScore}%<span className="ml-1 font-bold">(+{rec.scoreDifference})</span>
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground pt-2">{rec.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
