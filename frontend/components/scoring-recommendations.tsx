"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateRecommendations, generateInsight } from "@/lib/recommendations"
import { RecommendationsPanel } from "./recommendations-panel"
import type { GroceryItem, SustainabilityMetrics } from "@/lib/types"

interface ScoringRecommendationsProps {
  items: GroceryItem[]
  metrics: SustainabilityMetrics
}

export function ScoringRecommendations({ items, metrics }: ScoringRecommendationsProps) {
  const [expanded, setExpanded] = useState(false)

  // Get low-scoring products for recommendations
  const lowScoringProducts = items
    .filter((item) => item.sustainabilityScore < 75)
    .sort((a, b) => a.sustainabilityScore - b.sustainabilityScore)
    .slice(0, 3)
    .map((item) => ({ name: item.name, score: item.sustainabilityScore }))

  const recommendations = generateRecommendations(lowScoringProducts)
  const insight = generateInsight({
    totalScore: metrics.averageScore,
    highSustainability: metrics.highSustainability,
    mediumSustainability: metrics.mediumSustainability,
    lowSustainability: metrics.lowSustainability,
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Sustainability Summary</CardTitle>
          <CardDescription>Personalized insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{metrics.highSustainability}</div>
              <div className="text-xs text-green-700">High Impact</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{metrics.mediumSustainability}</div>
              <div className="text-xs text-yellow-700">Medium Impact</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{metrics.lowSustainability}</div>
              <div className="text-xs text-red-700">Low Impact</div>
            </div>
          </div>

          {/* Main Insight */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm font-medium text-emerald-900 mb-1">Your Impact</p>
            <p className="text-sm text-emerald-800">{insight}</p>
          </div>

          {/* Recommendations Section */}
          {lowScoringProducts.length > 0 && (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between bg-transparent"
                onClick={() => setExpanded(!expanded)}
              >
                <span>See Recommendations</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                  {recommendations.length}
                </span>
              </Button>

              {expanded && (
                <div className="border-t pt-4 mt-4">
                  <RecommendationsPanel recommendations={recommendations} insight={insight} />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
