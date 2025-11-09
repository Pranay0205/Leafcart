"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Leaf, Gift, Trophy, Star, Award, ChevronLeft, Copy, Check, Calendar, Tag } from "lucide-react";
import { merchants } from "@/lib/merchantData";
import { getPreprocessedScore } from "@/lib/preprocessedScores";

export default function RewardsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Calculate overall score from all transactions
  const calculateOverallScore = useMemo(() => {
    let totalScore = 0;
    let productCount = 0;

    merchants.forEach((merchant) => {
      merchant.transactions.forEach((transaction) => {
        transaction.products.forEach((product) => {
          const score = getPreprocessedScore(product.name);
          totalScore += score.score;
          productCount++;
        });
      });
    });

    return productCount > 0 ? Math.round(totalScore / productCount) : 0;
  }, []);

  // Calculate achievements
  const totalTransactions = useMemo(() => {
    return merchants.reduce((total, merchant) => total + merchant.transactions.length, 0);
  }, []);

  const totalSpent = useMemo(() => {
    return merchants.reduce((total, merchant) => {
      return (
        total +
        merchant.transactions.reduce((merchantTotal, transaction) => {
          return merchantTotal + transaction.price.total;
        }, 0)
      );
    }, 0);
  }, []);

  // Generate coupons based on score
  const coupons = useMemo(() => {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() + 30); // 30 days from now

    const allCoupons = [];

    if (calculateOverallScore >= 50) {
      allCoupons.push({
        id: 1,
        code: "LEAFCART10",
        title: "10% Off Your Next Purchase",
        description: "Congratulations on reaching a sustainability score of 50+!",
        discount: "10% OFF",
        minScore: 50,
        expiryDate: expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        merchants: ["Amazon", "Walmart", "Target"],
        color: "from-yellow-400 to-orange-500",
      });
    }

    if (calculateOverallScore >= 60) {
      allCoupons.push({
        id: 2,
        code: "GREENLEAF15",
        title: "15% Off Eco-Friendly Products",
        description: "Amazing! Your score of 60+ unlocks this exclusive reward!",
        discount: "15% OFF",
        minScore: 60,
        expiryDate: expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        merchants: ["All Eco-Friendly Items"],
        color: "from-emerald-400 to-green-500",
      });
    }

    if (calculateOverallScore >= 70) {
      allCoupons.push({
        id: 3,
        code: "ECOCHAMP20",
        title: "20% Off + Free Shipping",
        description: "Exceptional sustainability! You've earned our premium reward!",
        discount: "20% OFF",
        minScore: 70,
        expiryDate: expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        merchants: ["All Merchants"],
        color: "from-emerald-500 to-teal-500",
      });
    }

    if (calculateOverallScore >= 80) {
      allCoupons.push({
        id: 4,
        code: "SUSTAINHERO25",
        title: "25% Off Everything!",
        description: "You're a sustainability hero! Enjoy our highest reward!",
        discount: "25% OFF",
        minScore: 80,
        expiryDate: expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        merchants: ["All Merchants + Free Gift"],
        color: "from-purple-400 to-pink-500",
      });
    }

    return allCoupons;
  }, [calculateOverallScore]);

  // Achievements/Badges
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Made your first sustainable purchase",
      icon: Leaf,
      earned: totalTransactions >= 1,
      color: "from-green-400 to-emerald-500",
    },
    {
      id: 2,
      title: "Eco Warrior",
      description: "Reached sustainability score of 50+",
      icon: Award,
      earned: calculateOverallScore >= 50,
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: 3,
      title: "Green Champion",
      description: "Reached sustainability score of 70+",
      icon: Trophy,
      earned: calculateOverallScore >= 70,
      color: "from-emerald-400 to-green-600",
    },
    {
      id: 4,
      title: "Planet Protector",
      description: "Reached sustainability score of 80+",
      icon: Star,
      earned: calculateOverallScore >= 80,
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 5,
      title: "Shopping Streak",
      description: "Made 10+ sustainable purchases",
      icon: Gift,
      earned: totalTransactions >= 10,
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 6,
      title: "Eco Spender",
      description: "Spent $500+ on sustainable products",
      icon: Tag,
      earned: totalSpent >= 500,
      color: "from-orange-400 to-red-500",
    },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-white pb-24">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  LeafCart
                </h1>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-medium">
            <Gift className="w-4 h-4" />
            <span>Rewards & Achievements</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Your Rewards</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Earn exclusive coupons and unlock achievements by making sustainable choices
          </p>
        </div>

        {/* Score Overview */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-green-600/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold text-emerald-400">Current Sustainability Score</span>
          </div>
          <div className="text-6xl font-bold mb-2">{calculateOverallScore}</div>
          <p className="text-zinc-400">
            {calculateOverallScore >= 80
              ? "Outstanding! You're a sustainability champion!"
              : calculateOverallScore >= 70
              ? "Excellent work! Keep it up!"
              : calculateOverallScore >= 60
              ? "Great progress! You're making a difference!"
              : calculateOverallScore >= 50
              ? "Good start! Keep improving!"
              : "Start your journey to unlock rewards!"}
          </p>
        </div>

        {/* Available Coupons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-400" />
            Your Coupons
          </h2>

          {coupons.length === 0 ? (
            <div className="bg-card/50 border border-border rounded-2xl p-12 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-xl font-semibold mb-2">No Coupons Yet</h3>
              <p className="text-zinc-400 mb-4">
                Reach a sustainability score of 50 or higher to unlock your first coupon!
              </p>
              <p className="text-sm text-zinc-500">Current Score: {calculateOverallScore}/50</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-card/50 border border-border rounded-2xl overflow-hidden hover:border-border/80 transition-all"
                >
                  <div className={`h-2 bg-gradient-to-r ${coupon.color}`} />
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">{coupon.title}</h3>
                        <p className="text-sm text-zinc-400">{coupon.description}</p>
                      </div>
                      <div
                        className={`px-4 py-2 bg-gradient-to-r ${coupon.color} rounded-lg text-white font-bold text-lg shrink-0`}
                      >
                        {coupon.discount}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Calendar className="w-4 h-4" />
                      <span>Valid until {coupon.expiryDate}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-zinc-500 uppercase tracking-wider">Coupon Code</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-4 py-3 bg-zinc-800 rounded-lg font-mono text-lg font-bold tracking-wider">
                          {coupon.code}
                        </div>
                        <button
                          onClick={() => handleCopyCode(coupon.code)}
                          className="px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                        >
                          {copiedCode === coupon.code ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-800">
                      <div className="text-xs text-zinc-500 mb-1">Valid at:</div>
                      <div className="flex flex-wrap gap-2">
                        {coupon.merchants.map((merchant, idx) => (
                          <span key={idx} className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300">
                            {merchant}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            Achievements
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-2xl border transition-all ${
                  achievement.earned
                    ? "bg-card/50 border-border hover:border-border/80"
                    : "bg-card/20 border-border opacity-50"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      achievement.earned ? `bg-gradient-to-br ${achievement.color}` : "bg-zinc-800"
                    }`}
                  >
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-zinc-400">{achievement.description}</p>
                    {achievement.earned && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-medium">
                        <Check className="w-3 h-3" />
                        Unlocked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Reward */}
        {calculateOverallScore < 80 && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-500/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold">Next Reward</h3>
            </div>
            <p className="text-zinc-400 mb-4">
              {calculateOverallScore < 50
                ? "Reach a score of 50 to unlock your first coupon (10% off)!"
                : calculateOverallScore < 60
                ? "Reach a score of 60 to unlock 15% off eco-friendly products!"
                : calculateOverallScore < 70
                ? "Reach a score of 70 to unlock 20% off + free shipping!"
                : "Reach a score of 80 to unlock 25% off everything!"}
            </p>
            <div className="w-full bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{
                  width: `${
                    calculateOverallScore < 50
                      ? (calculateOverallScore / 50) * 100
                      : calculateOverallScore < 60
                      ? ((calculateOverallScore - 50) / 10) * 100
                      : calculateOverallScore < 70
                      ? ((calculateOverallScore - 60) / 10) * 100
                      : ((calculateOverallScore - 70) / 10) * 100
                  }%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-zinc-500 mt-2">
              <span>
                {calculateOverallScore < 50
                  ? "0"
                  : calculateOverallScore < 60
                  ? "50"
                  : calculateOverallScore < 70
                  ? "60"
                  : "70"}
              </span>
              <span>
                {calculateOverallScore < 50
                  ? "50"
                  : calculateOverallScore < 60
                  ? "60"
                  : calculateOverallScore < 70
                  ? "70"
                  : "80"}{" "}
                points
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
