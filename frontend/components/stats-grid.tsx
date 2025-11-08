"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SustainabilityMetrics } from "@/lib/types"

interface StatsGridProps {
  metrics: SustainabilityMetrics
}

export function StatsGrid({ metrics }: StatsGridProps) {
  const stats = [
    {
      label: "Overall Score",
      value: `${metrics.totalScore}%`,
      description: "Your sustainability rating",
    },
    {
      label: "Products Analyzed",
      value: metrics.productsAnalyzed,
      description: "Total products tracked",
    },
    {
      label: "Average Score",
      value: `${metrics.averageScore}%`,
      description: "Mean sustainability rating",
    },
    {
      label: "High Impact",
      value: metrics.highSustainability,
      description: "Sustainable products",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
