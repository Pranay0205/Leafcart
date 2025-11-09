# 🍃 LeafCart- by: Arundhati, Pranay, Shreeya

A sustainability tracking dashboard that helps you make eco-friendly shopping decisions. Track your environmental impact across multiple merchants, get AI-powered recommendations, and earn rewards for sustainable choices.

## 💪 How we built it

The web app is powered by the Knot API, allowing users to connect their merchant accounts and pull in real purchase data directly. Every product is analyzed using Google Gemini 2.5 Flash, which performs a deep multi-factor evaluation across materials, packaging, durability, recyclability, and carbon footprint. The AI assigns a 0 - 100 sustainability score, provides clear reasoning, and suggests better eco-friendly alternatives making the entire experience accurate, transparent, and highly personalized.
The platform is built entirely with Next.js 16 (React 19), TypeScript, Tailwind CSS, and Radix UI, featuring smooth, GPU-optimized animations via requestAnimationFrame for a polished user experience. Transaction data is processed client-side for instant performance, and the built-in AI assistant uses the user’s purchase history to deliver context-aware sustainability guidance. Key features include product-level impact scoring, merchant dashboards, a detailed product modal, rewards, and social sharing. Together, these decisions create a fast, scalable, and engaging sustainability companion designed for real-world consumer use.

## ✨ Features

- **Sustainability Tracking**: Track purchases across 7 major merchants (Amazon, Walmart, Target, DoorDash, Costco, Uber Eats, Instacart)
- **Product Scoring**: Every product scored 0-100 based on 10 sustainability factors
- **AI Assistant**: Google Gemini-powered recommendations for eco-friendly alternatives
- **Rewards System**: Earn coupons and achievements based on your sustainability score
- **Animated Dashboard**: Smooth animations and interactive stats
- **Social Sharing**: Share your sustainability score on social media
- **Floating Leaves**: Interactive background animation that reacts to your cursor

## 🔧 Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini AI (gemini-2.5-flash)
- **Fonts**: Averia Serif Libre
- **Icons**: Lucide React + React Icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Knot API credentials (client_id and secret)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Leafcart/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the frontend directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Environment Variables

Create a `.env` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🤝 Contributing

Contributions are welcome! Fork the repo and submit a pull request.

## 📄 License

MIT License

---

**Built with 💚 for a more sustainable future** 🍃
