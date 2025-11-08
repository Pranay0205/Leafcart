# AI-Powered Sustainability Scoring System

## Overview

This document explains the AI-powered sustainability scoring system that analyzes your transactions and products using Google's Gemini AI to provide accurate environmental impact assessments.

## How It Works

### 1. Product Extraction & Analysis

The system extracts all products from your transactions across all connected merchants and analyzes each one using AI.

**File**: `lib/transactionScoring.ts`

```typescript
// Extracts products from all transactions
extractAllProducts(transactions, merchantName);

// Merges data from multiple merchants
mergeAllTransactionData(merchantsData);
```

### 2. AI-Powered Product Scoring

Each product is scored (0-100) based on multiple sustainability factors using Google Gemini AI.

**File**: `lib/geminiAI.ts`

**Scoring Factors**:

- **Materials** (0-100): Sustainability of materials used
  - Organic, recycled, renewable materials score higher
  - Synthetic, non-renewable materials score lower
- **Packaging** (0-100): Packaging sustainability
  - Minimal, biodegradable, or recycled packaging scores higher
  - Excessive plastic packaging scores lower
- **Durability** (0-100): Product lifespan and quality
  - Durable, long-lasting products score higher
  - Disposable, single-use items score lower
- **Recyclability** (0-100): End-of-life recyclability
  - Fully recyclable or biodegradable products score higher
  - Non-recyclable materials score lower
- **Carbon Footprint** (0-100): Production and transport impact
  - Locally sourced, low-carbon products score higher
  - High-carbon footprint items score lower

### 3. Scoring Hierarchy

```
Product Score (0-100)
    ↓ Average all products
Transaction Score (0-100)
    ↓ Average all transactions
User Sustainability Score (0-100)
```

### 4. Score Calculation Process

```typescript
// 1. Extract all products from transactions
const allProducts = extractAllProducts(transactions, merchantName);

// 2. Score products in batches (10 at a time to avoid API limits)
const productScores = await scoreBatchOfProducts(products);

// 3. Calculate transaction score (average of product scores)
const transactionScore = average(productScores);

// 4. Calculate overall user score (average of transaction scores)
const overallScore = average(allTransactionScores);
```

## AI Search Bar

**File**: `components/ai-search-bar.tsx`

The AI search bar provides an interactive interface for users to:

- Ask questions about their transactions
- Get sustainability tips
- Learn about product alternatives
- Understand their environmental impact

### Features

- **Floating Search Bar**: Fixed at the bottom with margin
- **Expandable Chat**: Click to expand full conversation history
- **Context-Aware**: AI has access to your transactions and score
- **Quick Suggestions**: Pre-filled questions to get started
- **Real-time Responses**: Powered by Gemini AI

### Example Queries

```
"How sustainable are my Amazon purchases?"
"What are eco-friendly alternatives to plastic products?"
"How can I improve my sustainability score?"
"Show me my most sustainable transactions"
"What products have the lowest carbon footprint?"
```

## Implementation Guide

### Step 1: Environment Setup

Add your Gemini API key to `.env`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your key from: https://makersuite.google.com/app/apikey

### Step 2: Automatic Scoring

Scores are calculated automatically when:

- Dashboard loads for the first time
- Merchants are connected/disconnected
- "Recalculate Scores" button is clicked

### Step 3: Caching

Scores are cached in localStorage for 24 hours to:

- Reduce API calls
- Improve performance
- Save costs

Clear cache manually:

```typescript
import { clearScoreCache } from "@/lib/transactionScoring";
clearScoreCache();
```

## API Integration

### Gemini AI Integration

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Score a product
const result = await model.generateContent(prompt);
const response = await result.response;
const score = JSON.parse(response.text());
```

### Batch Processing

Products are processed in batches of 10 to:

- Optimize API usage
- Avoid rate limiting
- Provide better context to the AI

```typescript
const batchSize = 10;
for (let i = 0; i < products.length; i += batchSize) {
  const batch = products.slice(i, i + batchSize);
  const scores = await scoreBatchOfProducts(batch);

  // Small delay to avoid rate limiting
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

## Progress Tracking

The system provides real-time progress updates:

```typescript
await scoreAllTransactions(merchantsData, (progress, message) => {
  console.log(`${progress}%: ${message}`);
});
```

Progress is displayed in the UI:

- Progress bar at the top of the dashboard
- Percentage complete
- Current action message

## Data Structure

### Product Sustainability Score

```typescript
{
  productId: string;
  productName: string;
  score: number; // 0-100
  reasoning: string;
  category: string;
  sustainabilityFactors: {
    materials: number;
    packaging: number;
    durability: number;
    recyclability: number;
    carbonFootprint: number;
  }
}
```

### Scored Transaction

```typescript
{
  transactionId: string;
  merchantName: string;
  products: ProductSustainabilityScore[];
  transactionScore: number; // Average of product scores
  totalAmount: number;
  date: string;
}
```

## Performance Optimization

### 1. Caching Strategy

- **Cache Duration**: 24 hours
- **Cache Key**: `leafcart_scored_transactions`
- **Storage**: Browser localStorage
- **Auto-refresh**: When merchants change

### 2. Batch Processing

- **Batch Size**: 10 products per API call
- **Delay**: 1 second between batches
- **Parallel**: Process multiple merchants sequentially

### 3. Rate Limiting

- Built-in delays prevent API rate limits
- Fallback scores (50) if API fails
- Error handling for network issues

## Error Handling

### Fallback Scores

If AI scoring fails, products receive:

- Score: 50 (neutral)
- Reasoning: "Unable to analyze product with AI"
- Default sustainability factors

### Network Errors

```typescript
try {
  const scores = await scoreProductWithAI(product);
} catch (error) {
  console.error("Error scoring product:", error);
  return fallbackScore;
}
```

## Cost Optimization

### Reducing API Calls

1. **Use Cache**: Scores are cached for 24 hours
2. **Batch Processing**: Process 10 products at once
3. **Smart Refresh**: Only recalculate when needed

### Estimated Costs

With Google Gemini AI:

- Free tier: 60 requests per minute
- Batch size: 10 products per request
- 1000 products ≈ 100 API calls
- Well within free tier limits

## Usage Examples

### In Dashboard Component

```typescript
import { getOrCalculateScores } from "@/lib/transactionScoring";

const [scoredTransactions, setScoredTransactions] = useState([]);
const [overallScore, setOverallScore] = useState(null);

useEffect(() => {
  const calculateScores = async () => {
    const result = await getOrCalculateScores(merchantsData, (progress, message) => {
      console.log(`${progress}%: ${message}`);
    });

    setScoredTransactions(result.scoredTransactions);
    setOverallScore(result.overallScore);
  };

  calculateScores();
}, [merchantsData]);
```

### In AI Chat

```typescript
import { chatWithAI } from "@/lib/geminiAI";

const response = await chatWithAI("How can I improve my sustainability score?", {
  transactions: scoredTransactions,
  userScore: overallScore,
});
```

## Future Enhancements

1. **Product Database**: Cache common products to reduce API calls
2. **Merchant Scoring**: Add merchant-level sustainability ratings
3. **Trend Analysis**: Track score improvements over time
4. **Recommendations**: AI-powered product recommendations
5. **Comparative Analysis**: Compare with similar users
6. **Carbon Calculator**: Detailed CO2 emissions tracking
7. **Goals & Challenges**: Gamification features

## Troubleshooting

### Issue: Scores not calculating

**Solution**: Check Gemini API key in `.env`:

```bash
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### Issue: Slow calculation

**Solution**:

- Normal for first-time calculation
- Use cached results for subsequent loads
- Consider reducing transaction history

### Issue: API rate limit

**Solution**:

- Batch size is already optimized
- Delays are built-in
- Free tier should handle most use cases

### Issue: Chat not responding

**Solution**:

- Check API key
- Verify internet connection
- Check browser console for errors

## Security Considerations

1. **API Key**: Use NEXT*PUBLIC* prefix for client-side access
2. **Data Privacy**: Scores are cached locally only
3. **No Server Storage**: All data remains on client
4. **HTTPS**: Always use HTTPS in production

## Conclusion

The AI-powered scoring system provides accurate, actionable sustainability insights by analyzing each product individually and aggregating scores up through transactions to your overall sustainability score. The AI search bar makes it easy to understand and improve your environmental impact through conversational interactions.
