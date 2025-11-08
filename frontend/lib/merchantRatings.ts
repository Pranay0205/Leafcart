// Merchant sustainability ratings (1-5 scale)
// 5 = Great (Green), 4 = Pretty Good, 3 = It's a Start, 2 = Some Problems, 1 = Avoid (Red)

export interface MerchantRating {
  id: number;
  name: string;
  sustainabilityScore: number;
  description: string;
  color: string;
}

const ratingDescriptions = {
  5: {
    title: "Great",
    description:
      "Made from 100% sustainably grown, recycled, or biodegradable materials with recognized certifications.",
    color: "from-emerald-500 to-green-600",
  },
  4: {
    title: "Pretty Good",
    description: "Made from majority sustainable, recycled materials, or partly biodegradable.",
    color: "from-green-400 to-emerald-500",
  },
  3: {
    title: "It's a Start",
    description: "Some effort towards sustainable materials but overall impact is negligible.",
    color: "from-yellow-400 to-orange-400",
  },
  2: {
    title: "Some Problems Here",
    description: "Minimal effort towards sustainability, mostly non-renewable materials.",
    color: "from-orange-500 to-red-500",
  },
  1: {
    title: "Avoid if You Can",
    description: "Made from non-renewable, non-recycled, non-biodegradable materials.",
    color: "from-red-500 to-rose-600",
  },
};

export const merchantRatings: MerchantRating[] = [
  {
    id: 4,
    name: "Max",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 7,
    name: "Best Buy",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 8,
    name: "Disney+",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 10,
    name: "Uber",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 16,
    name: "Netflix",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 18,
    name: "Hulu",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 19,
    name: "DoorDash",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 20,
    name: "Domino's",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 23,
    name: "Peacock",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 25,
    name: "YouTube TV",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 27,
    name: "Audible",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 29,
    name: "DIRECTV",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 30,
    name: "Prime Video",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 31,
    name: "Crunchyroll",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 32,
    name: "Amazon Music",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 36,
    name: "Uber Eats",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 37,
    name: "Postmates",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 39,
    name: "Seamless",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 42,
    name: "Lyft",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 44,
    name: "Amazon",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 48,
    name: "Macy's",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 58,
    name: "Chewy",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 59,
    name: "eBay",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 60,
    name: "Apple",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 129,
    name: "Google",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 175,
    name: "Microsoft",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 386,
    name: "Burger King",
    sustainabilityScore: 1,
    description: ratingDescriptions[1].title,
    color: ratingDescriptions[1].color,
  },
  {
    id: 615,
    name: "Dell",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 625,
    name: "Dollar General",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 898,
    name: "Caviar",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 976,
    name: "The New York Times",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 987,
    name: "YouTube Premium",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 991,
    name: "Apple TV+",
    sustainabilityScore: 4,
    description: ratingDescriptions[4].title,
    color: ratingDescriptions[4].color,
  },
  {
    id: 2125,
    name: "Shop Pay",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 2126,
    name: "Prime",
    sustainabilityScore: 2,
    description: ratingDescriptions[2].title,
    color: ratingDescriptions[2].color,
  },
  {
    id: 2131,
    name: "STARZ",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 2264,
    name: "Bloomingdale's",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 2322,
    name: "YouTube",
    sustainabilityScore: 3,
    description: ratingDescriptions[3].title,
    color: ratingDescriptions[3].color,
  },
  {
    id: 2325,
    name: "7-Eleven",
    sustainabilityScore: 1,
    description: ratingDescriptions[1].title,
    color: ratingDescriptions[1].color,
  },
];

export function getRatingInfo(score: number) {
  return ratingDescriptions[score as keyof typeof ratingDescriptions] || ratingDescriptions[3];
}

export function getMerchantRating(merchantId: number): MerchantRating | undefined {
  return merchantRatings.find((m) => m.id === merchantId);
}

export function getMerchantRatingByName(merchantName: string): MerchantRating | undefined {
  return merchantRatings.find((m) => m.name.toLowerCase() === merchantName.toLowerCase());
}
