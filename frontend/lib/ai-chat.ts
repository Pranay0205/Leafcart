// AI Chat responses for sustainability advisor
// Generates contextual recommendations based on user input

const sustainabilityResponses = {
  alternatives: {
    keywords: ["alternative", "instead", "better", "replace", "substitute"],
    response: (product: string) =>
      `For "${product}", consider these sustainable alternatives:
      
• Buy from local farms or farmers markets
• Choose organic or fair-trade certified options
• Look for minimal or compostable packaging
• Buy in bulk to reduce packaging waste
• Check for certifications like USDA Organic or Rainforest Alliance

These options typically have scores 20-30 points higher!`,
  },

  score: {
    keywords: ["score", "rating", "how sustainable", "impact"],
    response: `Your overall sustainability score is based on:

• Farm Certifications (25%): Organic, Fair Trade, etc.
• Transportation Distance (20%): Local vs. imported
• Seasonality (15%): In-season vs. out-of-season
• Packaging (15%): Minimal vs. excessive packaging
• Organic Status (25%): Conventional vs. organic

Your current average is 73%, which is great! Keep pushing for 80%+.`,
  },

  tips: {
    keywords: ["tip", "advice", "help", "how to", "improve"],
    response: `Here are practical ways to improve your sustainability:

1. Buy seasonal produce - reduces transportation emissions
2. Choose local farms over imported goods
3. Buy organic when possible (less water/pesticides)
4. Reduce meat consumption or choose grass-fed options
5. Buy in bulk to reduce packaging waste
6. Choose products with minimal or recyclable packaging
7. Support fair-trade certified products
8. Plan meals to reduce food waste

Start with one change this week!`,
  },

  farms: {
    keywords: ["farm", "where from", "origin", "local"],
    response: `Farm transparency matters! Look for:

• Local farms (lowest carbon footprint)
• Certified organic farms
• Regenerative agriculture practices
• Fair trade certifications
• Direct-to-consumer farms

Many of your products are from Local Harvest Farm (California) - excellent choice for local sourcing!`,
  },

  water: {
    keywords: ["water", "environmental impact", "carbon", "resources"],
    response: `Water usage varies significantly by product:

HIGH water usage:
• Almonds: ~1.1 gallons per nut
• Meat & dairy: Significant water requirements
• Avocados: ~60 gallons per fruit

LOWER water usage:
• Leafy greens
• Beans and lentils
• Root vegetables
• Local seasonal produce

Reducing meat/dairy is one of the biggest water-saving changes!`,
  },

  default: `I can help you with:
• Sustainable product alternatives
• Understanding your sustainability score
• Tips to improve your impact
• Information about farms and sourcing
• Environmental impact of different foods

What would you like to know?`,
}

export async function generateChatResponse(userMessage: string): Promise<string> {
  const lowerMessage = userMessage.toLowerCase()

  // Check for keywords in predefined responses
  for (const [key, data] of Object.entries(sustainabilityResponses)) {
    if (key === "default") continue

    const keywords = "keywords" in data ? (data as any).keywords : []
    if (keywords.some((kw) => lowerMessage.includes(kw))) {
      const response = (data as any).response
      if (typeof response === "function") {
        // Extract product name if asking about alternatives
        const productMatch = userMessage.match(/(?:for|to|about|instead of)\s+(.+?)(?:\?|$)/i)
        const product = productMatch ? productMatch[1].trim() : "this product"
        return response(product)
      }
      return response
    }
  }

  // Default response if no keywords match
  return sustainabilityResponses.default
}
