# GreenCart - Sustainability Tracker Setup Guide

## Overview
GreenCart tracks your Amazon Fresh grocery purchases and rates them based on sustainability practices. It includes:
- Transaction syncing via Knot API
- AI-powered sustainability scoring
- Interactive pie charts showing your sustainability impact
- AI chatbot for personalized recommendations

## Environment Variables Required

Add these to your Vercel project settings (or .env.local for local development):

\`\`\`
# Knot API Credentials
KNOT_CLIENT_ID=your_client_id_here
KNOT_SECRET=your_secret_here
\`\`\`

### Getting Knot API Credentials:
1. Sign up at https://knotapi.com
2. Create a new application
3. Get your client_id and secret
4. For Amazon Fresh: use merchant_id = 44

## Features

### 1. Dashboard
- Overall sustainability score (0-100%)
- Pie chart showing product distribution
- Sustainability trend over time
- Recent purchases with individual scores

### 2. Product Scoring
Each product is scored based on:
- **Farm Certifications (25%)** - USDA Organic, Fair Trade, etc.
- **Transportation Distance (20%)** - Local vs. imported
- **Seasonality (15%)** - In-season vs. out-of-season
- **Packaging (15%)** - Minimal vs. excessive packaging
- **Organic Status (25%)** - Conventional vs. organic

### 3. AI Chatbot
Ask questions about:
- Sustainable alternatives to current purchases
- How your score is calculated
- Tips to improve sustainability
- Farm information and sourcing
- Environmental impact of foods

### 4. Personalized Recommendations
The system suggests swaps for low-scoring products, showing:
- Current product and score
- Recommended alternative
- Potential score improvement
- Reason for the recommendation

## Usage

1. **Connect Account**
   - Click "Connect Amazon Fresh Account"
   - Use your Amazon Fresh credentials through Knot API

2. **View Dashboard**
   - See your overall sustainability metrics
   - Review pie chart of products
   - Track trends over time

3. **Ask the Chatbot**
   - Type questions about any product
   - Get AI-powered recommendations
   - Learn about sustainable practices

4. **Make Changes**
   - Swap recommended products
   - Buy from suggested farms
   - Improve your score

## API Integration

The app uses:
- **Knot API**: For transaction syncing (Amazon Fresh, merchant_id 44)
- **OpenAI API**: For AI chatbot (can be configured in lib/ai-chat.ts)

### Transaction Data Structure
Transactions include:
- Product name and ASIN
- Quantity and price
- Order date and status
- Payment method

## Sustainability Database

Farm data includes:
- Certifications (USDA Organic, Fair Trade, etc.)
- Location (for calculating transport distance)
- Practices score
- Water usage and carbon footprint metrics

## Extending the App

### Add More Farms
Edit `lib/sustainability-db.ts` to add farms to the mockFarms database.

### Improve Scoring Algorithm
Modify the `analyzeProductSustainability` function to add more factors:
- Pesticide usage
- Soil health metrics
- Biodiversity impact
- Worker welfare scores

### Connect Real Data
Replace mock data with real APIs:
- Real farm sustainability ratings
- Actual carbon footprint data
- Weather/seasonality APIs
- Grocer supply chain transparency

## Troubleshooting

**No transactions appearing:**
- Check Knot API credentials
- Verify Amazon Fresh account is connected
- Check rate limits

**Low scores for all products:**
- This is normal for conventional products
- The algorithm favors organic and local options
- Adjust weights in the scoring algorithm if needed

**Chatbot not responding:**
- Check OpenAI API key
- Verify API quota
- Check browser console for errors

## Future Enhancements

- Integration with Carbon Trust database
- Real-time farm location mapping
- Community sustainability challenges
- Meal planning with sustainability filtering
- Export sustainability reports
- Share achievements with friends
