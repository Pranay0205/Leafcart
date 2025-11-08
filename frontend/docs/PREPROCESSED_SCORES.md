# Preprocessed Sustainability Scores - Feature Documentation

## Overview

The application now uses **preprocessed sustainability scores** instead of real-time AI analysis. This improves performance and prepares the system for backend preprocessing.

## New Features

### 1. **Preprocessed Scoring System**

- **File**: `/lib/preprocessedScores.ts`
- **Purpose**: Contains precalculated sustainability scores for common product categories
- **Score Database**:
  - Organic products: 75-95 (high sustainability)
  - Electronics: 35-60 (medium-low)
  - Plastic products: 15-40 (low sustainability)
  - Food & groceries: 40-80 (variable)
  - Cleaning products: 35-78 (eco-friendly vs chemical)
  - Clothing: 25-80 (fast fashion vs organic cotton)

### 2. **Product Detail Modal**

- **File**: `/components/product-detail-modal.tsx`
- **Features**:
  - Shows product name, price, and sustainability score
  - Displays detailed sustainability breakdown:
    - Materials score
    - Packaging score
    - Durability score
    - Recyclability score
    - Carbon footprint score
  - Color-coded scores (green = sustainable, yellow = moderate, red = poor)
  - **"Get Better Alternatives" button** for low-scoring products (< 50)

### 3. **Interactive Product List**

- **Location**: Merchant Dashboard → Transaction → Products
- **Features**:
  - Each product shows:
    - Product name and quantity
    - Unit price
    - Sustainability score badge
  - **Clickable products**: Click any product to see detailed scores
  - **Visual indicators**: Low-scoring products (<50) have red background highlighting

### 4. **AI-Powered Product Suggestions**

- **Integration**: Product Detail Modal → AI Search Bar
- **Flow**:
  1. User clicks product to view details
  2. If score < 50, user can click "Get Better Alternatives"
  3. AI Search Bar automatically opens with suggestion request
  4. Gemini AI provides eco-friendly alternatives using `getBetterProductSuggestion()`

## Removed Features

- ❌ **"Recalculate Scores" button** - Real-time AI analysis removed
- ❌ **Scoring progress banner** - No longer needed with preprocessed scores
- ❌ **"AI Powered" badge** - Scores are now based on preprocessed data

## Technical Changes

### Dashboard Updates

- Uses `getPreprocessedScore()` for instant score lookup
- Overall score calculated from all products in active merchants
- Removed `getOrCalculateScores()` and real-time AI calls
- Simplified state management (removed `scoredTransactions`, `isCalculatingScores`, etc.)

### AI Search Bar Enhancement

- Now uses `forwardRef` to expose `triggerSuggestion()` method
- Can be programmatically triggered by other components
- Integrates with `getBetterProductSuggestion()` from Gemini AI
- Maintains conversation history with context

### Gemini API Migration

- **Old Library**: `@google/generative-ai` ❌
- **New Library**: `@google/genai` ✅
- **Model**: Uses `gemini-2.5-flash` for faster responses
- **API Pattern**: `genAI.models.generateContent({ model, contents })`

## Scoring Algorithm

### Keyword Matching

```typescript
getPreprocessedScore(productName: string)
```

- Analyzes product name for sustainability keywords
- Returns precalculated score object with:
  - Overall score (0-100)
  - Reasoning
  - Category
  - Sustainability factor breakdown

### Score Color Coding

| Score Range | Color           | Label       |
| ----------- | --------------- | ----------- |
| 70-100      | Green (Emerald) | Sustainable |
| 40-69       | Yellow          | Moderate    |
| 0-39        | Red             | Poor        |

## User Experience Flow

### Viewing Product Details

1. Navigate to Dashboard
2. Expand any merchant
3. Click on any product in a transaction
4. Modal opens showing detailed sustainability analysis

### Getting Better Alternatives

1. Open product with low score (<50)
2. Click "Get Better Alternatives" button
3. AI chat opens automatically
4. Receive personalized eco-friendly product suggestions

## Future Backend Integration

The preprocessed scores are designed to be easily migrated to backend processing:

- Replace `preprocessedScores.ts` with API calls to backend
- Backend can run batch AI analysis overnight
- Frontend remains unchanged - just swap data source
- Potential endpoints:
  - `GET /api/products/scores` - Get all scores
  - `GET /api/products/:id/score` - Get single product score
  - `POST /api/products/suggest` - Get alternative suggestions

## Environment Setup

Required environment variable:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## Dependencies

- `@google/genai` - Gemini AI integration
- `lucide-react` - Icons
- `react-icons` - Brand logos

## Files Modified

- `/components/merchant-dashboard.tsx` - Updated to use preprocessed scores
- `/components/ai-search-bar.tsx` - Added ref forwarding and suggestion trigger
- `/lib/geminiAI.ts` - Migrated to new Gemini API, added `getBetterProductSuggestion()`

## Files Created

- `/lib/preprocessedScores.ts` - Scoring database
- `/components/product-detail-modal.tsx` - Product detail UI
- `/docs/PREPROCESSED_SCORES.md` - This documentation
