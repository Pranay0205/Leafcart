"use client"
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SustainabilityChartProps {
  highCount: number
  mediumCount: number
  lowCount: number
}

export function SustainabilityChart({ highCount, mediumCount, lowCount }: SustainabilityChartProps) {
  const totalProducts = highCount + mediumCount + lowCount

  const data = [
    { name: "Sustainable", value: highCount, color: "#16a34a" },
    { name: "Moderate", value: mediumCount, color: "#eab308" },
    { name: "Lower Impact", value: lowCount, color: "#ef4444" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Grocery Sustainability Score</CardTitle>
        <CardDescription>Distribution of {totalProducts} products across sustainability levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            high: { label: "Sustainable", color: "#16a34a" },
            medium: { label: "Moderate", color: "#eab308" },
            low: { label: "Lower Impact", color: "#ef4444" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

interface TrendChartProps {
  data: Array<{ month: string; score: number }>
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sustainability Score Trend</CardTitle>
        <CardDescription>Monthly average sustainability rating</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: { label: "Score", color: "#06b6d4" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--color-score)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
