// Generate personalized sustainability recommendations

export interface ProductRecommendation {
  productName: string
  currentScore: number
  recommendedAlternative: string
  alternativeScore: number
  scoreDifference: number
  reason: string
}

const recommendationDatabase = [
  {
    originalProduct: "conventional produce",
    alternative: "organic produce",
    scoreBoost: 40,
    reason: "Organic eliminates synthetic pesticides and is often locally sourced",
  },
  {
    originalProduct: "imported fruit",
    alternative: "local seasonal fruit",
    scoreBoost: 35,
    reason: "Reduces transportation emissions significantly",
  },
  {
    originalProduct: "conventional dairy",
    alternative: "grass-fed dairy",
    scoreBoost: 25,
    reason: "Better animal welfare and lower carbon footprint",
  },
  {
    originalProduct: "packaged snacks",
    alternative: "bulk alternatives",
    scoreBoost: 20,
    reason: "Reduces packaging waste and often from sustainable sources",
  },
  {
    originalProduct: "conventional almonds",
    alternative: "local nuts or seeds",
    scoreBoost: 15,
    reason: "Reduces water usage and transportation",
  },
]

export function generateRecommendations(
  lowScoringProducts: Array<{ name: string; score: number }>,
): ProductRecommendation[] {
  return lowScoringProducts.slice(0, 3).map((product) => {
    const rec = recommendationDatabase.find((r) => product.name.toLowerCase().includes(r.originalProduct))

    if (rec) {
      return {
        productName: product.name,
        currentScore: product.score,
        recommendedAlternative: rec.alternative,
        alternativeScore: Math.min(100, product.score + rec.scoreBoost),
        scoreDifference: rec.scoreBoost,
        reason: rec.reason,
      }
    }

    return {
      productName: product.name,
      currentScore: product.score,
      recommendedAlternative: "organic alternative",
      alternativeScore: Math.min(100, product.score + 25),
      scoreDifference: 25,
      reason: "Choose organic or locally-sourced versions when available",
    }
  })
}

export function generateInsight(metrics: {
  totalScore: number
  highSustainability: number
  mediumSustainability: number
  lowSustainability: number
}): string {
  if (metrics.totalScore >= 80) {
    return "Excellent! You're making highly sustainable choices. Keep up the great work and inspire others!"
  }
  if (metrics.totalScore >= 65) {
    return "Good progress! Focus on the low-scoring items in your cart and consider sustainable alternatives."
  }
  if (metrics.totalScore >= 50) {
    return "There's room for improvement. Try switching to organic, local, or fair-trade options for better impact."
  }
  return "Start small: pick one category (like produce) and commit to more sustainable choices this week."
}
