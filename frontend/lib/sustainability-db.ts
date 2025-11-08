// Mock sustainability database
// In production, this would be fetched from an external API or database

export interface FarmData {
  id: string
  name: string
  location: string
  certifications: string[]
  practicesScore: number // 0-100
  productsGrown: string[]
  waterUsage: number // gallons per unit
  carbonFootprint: number // kg CO2 per unit
  organicCertified: boolean
  locallyOwned: boolean
}

export interface ProductSustainability {
  productName: string
  farm?: FarmData
  sustainabilityScore: number // 0-100
  factors: {
    farmCertifications: number // 0-100
    transportDistance: number // 0-100
    seasonality: number // 0-100
    packaging: number // 0-100
    organicStatus: number // 0-100
  }
  recommendations: string[]
}

// Mock farm database
const mockFarms: Record<string, FarmData> = {
  "organic-valley": {
    id: "organic-valley",
    name: "Organic Valley Farm",
    location: "Wisconsin",
    certifications: ["USDA Organic", "Fair Trade"],
    practicesScore: 92,
    productsGrown: ["dairy", "milk", "cheese"],
    waterUsage: 5000,
    carbonFootprint: 2.5,
    organicCertified: true,
    locallyOwned: true,
  },
  "local-harvest": {
    id: "local-harvest",
    name: "Local Harvest Farm",
    location: "California",
    certifications: ["USDA Organic", "Non-GMO"],
    practicesScore: 88,
    productsGrown: ["vegetables", "fruit", "organic produce"],
    waterUsage: 3000,
    carbonFootprint: 1.2,
    organicCertified: true,
    locallyOwned: true,
  },
  "sustainable-grains": {
    id: "sustainable-grains",
    name: "Sustainable Grains Co",
    location: "Iowa",
    certifications: ["Regenerative Organic", "Carbon Neutral"],
    practicesScore: 95,
    productsGrown: ["grains", "rice", "pasta", "bread"],
    waterUsage: 2000,
    carbonFootprint: 0.8,
    organicCertified: true,
    locallyOwned: true,
  },
  "conventional-farm": {
    id: "conventional-farm",
    name: "Large Conventional Farm",
    location: "Texas",
    certifications: [],
    practicesScore: 45,
    productsGrown: ["commodity crops", "conventional produce"],
    waterUsage: 8000,
    carbonFootprint: 4.5,
    organicCertified: false,
    locallyOwned: false,
  },
}

// Analyze product sustainability based on keywords
export async function analyzeProductSustainability(productName: string): Promise<ProductSustainability> {
  const name = productName.toLowerCase()

  // Simulate farm assignment based on product keywords
  let assignedFarm: FarmData | undefined
  let baseScore = 50

  if (name.includes("organic") || name.includes("fair trade") || name.includes("blue diamond")) {
    assignedFarm = mockFarms["organic-valley"]
    baseScore = 85
  } else if (name.includes("local") || name.includes("fresh") || name.includes("vegetable")) {
    assignedFarm = mockFarms["local-harvest"]
    baseScore = 80
  } else if (name.includes("grain") || name.includes("rice")) {
    assignedFarm = mockFarms["sustainable-grains"]
    baseScore = 88
  } else if (name.includes("almond") || name.includes("natural") || name.includes("essential")) {
    assignedFarm = mockFarms["local-harvest"]
    baseScore = 78
  } else {
    assignedFarm = mockFarms["conventional-farm"]
    baseScore = 45
  }

  // Calculate individual factor scores
  const factors = {
    farmCertifications: assignedFarm.organicCertified ? 90 : 40,
    transportDistance: assignedFarm.location === "California" ? 85 : 60,
    seasonality: Math.random() * 40 + 50, // 50-90
    packaging: Math.random() * 30 + 50, // 50-80
    organicStatus: assignedFarm.organicCertified ? 95 : 30,
  }

  // Calculate weighted average
  const sustainabilityScore = Math.round(
    (factors.farmCertifications * 0.25 +
      factors.transportDistance * 0.2 +
      factors.seasonality * 0.15 +
      factors.packaging * 0.15 +
      factors.organicStatus * 0.25) /
      100,
  )

  // Generate recommendations
  const recommendations: string[] = []
  if (!assignedFarm.organicCertified) {
    recommendations.push("Try organic alternatives for better sustainability")
  }
  if (factors.transportDistance < 70) {
    recommendations.push("Consider locally-sourced options to reduce carbon footprint")
  }
  if (assignedFarm.waterUsage > 5000) {
    recommendations.push("This product uses significant water resources")
  }

  return {
    productName,
    farm: assignedFarm,
    sustainabilityScore,
    factors,
    recommendations,
  }
}

// Batch analyze multiple products
export async function analyzeMultipleProducts(productNames: string[]): Promise<ProductSustainability[]> {
  return Promise.all(productNames.map((name) => analyzeProductSustainability(name)))
}
