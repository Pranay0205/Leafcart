"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Leaf,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
} from "lucide-react";
import { FaAmazon, FaApple } from "react-icons/fa";
import { SiWalmart, SiTarget, SiDoordash, SiUber, SiStarbucks } from "react-icons/si";
import { TbTruckDelivery, TbShoppingCart } from "react-icons/tb";
import { MdStore } from "react-icons/md";

// Brand colors and icons for merchants
const merchantBrands: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> }> = {
  Amazon: { color: "#FF9900", icon: FaAmazon },
  Walmart: { color: "#0071CE", icon: SiWalmart },
  Target: { color: "#CC0000", icon: SiTarget },
  "Whole Foods": { color: "#00684A", icon: FaApple },
  "Best Buy": { color: "#FFF200", icon: TbTruckDelivery },
  Costco: { color: "#0468B1", icon: TbShoppingCart },
  DoorDash: { color: "#FF3008", icon: SiDoordash },
  Uber: { color: "#000000", icon: SiUber },
  Starbucks: { color: "#00704A", icon: SiStarbucks },
};

interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  score: number;
  items: number;
  category: string;
}

interface DashboardProps {
  externalUserId?: string;
}

export default function ModernDashboard({ externalUserId = "demo_user" }: DashboardProps) {
  // Mock data
  const overallScore = 68;
  const scoreChange = +5;
  const totalSpent = 2847.32;
  const spendingChange = -12;
  const transactionsCount = 24;
  const avgItemScore = 72;

  const recentTransactions: Transaction[] = [
    { id: "1", merchant: "Amazon", amount: 275.45, date: "2024-01-27", score: 65, items: 14, category: "Electronics" },
    {
      id: "2",
      merchant: "Whole Foods",
      amount: 145.5,
      date: "2024-02-04",
      score: 85,
      items: 28,
      category: "Groceries",
    },
    { id: "3", merchant: "DoorDash", amount: 42.99, date: "2024-03-08", score: 62, items: 3, category: "Food Delivery" },
    { id: "4", merchant: "Target", amount: 89.99, date: "2024-03-10", score: 58, items: 6, category: "Home" },
    { id: "5", merchant: "Costco", amount: 321.0, date: "2024-04-14", score: 78, items: 24, category: "Groceries" },
  ];

  const categoryBreakdown = [
    { name: "Electronics", percentage: 35, color: "from-blue-500 to-blue-600" },
    { name: "Groceries", percentage: 25, color: "from-green-500 to-emerald-600" },
    { name: "Clothing", percentage: 15, color: "from-purple-500 to-pink-600" },
    { name: "Home", percentage: 20, color: "from-orange-500 to-red-600" },
    { name: "Other", percentage: 5, color: "from-zinc-500 to-zinc-600" },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 65) return "text-yellow-400";
    if (score >= 45) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 65) return "from-yellow-500 to-orange-500";
    if (score >= 45) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-600";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  LeafCart
                </h1>
                <p className="text-xs text-zinc-500">Sustainability Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Calendar className="w-5 h-5 text-zinc-400" />
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Filter className="w-5 h-5 text-zinc-400" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                {externalUserId.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overall Score */}
          <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    scoreChange >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {scoreChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(scoreChange)}%
                </div>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-br from-emerald-400 to-green-500 bg-clip-text text-transparent mb-1">
                {overallScore}
              </div>
              <div className="text-zinc-400 text-sm">Sustainability Score</div>
              <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getScoreGradient(overallScore)} rounded-full transition-all`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Total Spending */}
          <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-blue-400" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    spendingChange >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {spendingChange >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(spendingChange)}%
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-1">${totalSpent.toLocaleString()}</div>
              <div className="text-zinc-400 text-sm">Total Spent</div>
            </div>
          </div>

          {/* Transactions */}
          <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-sm text-zinc-400">This month</div>
              </div>
              <div className="text-4xl font-bold text-white mb-1">{transactionsCount}</div>
              <div className="text-zinc-400 text-sm">Transactions</div>
            </div>
          </div>

          {/* Average Item Score */}
          <div className="relative overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Award className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-sm text-emerald-400">+8 pts</div>
              </div>
              <div className="text-4xl font-bold text-white mb-1">{avgItemScore}</div>
              <div className="text-zinc-400 text-sm">Avg Item Score</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Category Breakdown */}
          <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Category Breakdown</h3>
                <p className="text-sm text-zinc-400 mt-1">Spending by product category</p>
              </div>
              <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <PieChart className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-4">
              {categoryBreakdown.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300">{category.name}</span>
                    <span className="text-zinc-400">{category.percentage}%</span>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${category.color} rounded-full transition-all duration-500`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: "View All Transactions", icon: ShoppingBag, color: "blue" },
                { label: "Connect Merchant", icon: Leaf, color: "green" },
                { label: "View Insights", icon: Sparkles, color: "purple" },
                { label: "Export Report", icon: BarChart3, color: "orange" },
              ].map((action, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 p-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-all group"
                >
                  <div
                    className={`p-2 bg-${action.color}-500/10 rounded-lg group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className={`w-4 h-4 text-${action.color}-400`} />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <p className="text-sm text-zinc-400 mt-1">Your latest sustainable purchases</p>
            </div>
            <button className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${merchantBrands[transaction.merchant]?.color}20` }}
                  >
                    {merchantBrands[transaction.merchant]?.icon ? (
                      <div style={{ color: merchantBrands[transaction.merchant].color }}>
                        {React.createElement(merchantBrands[transaction.merchant].icon, {
                          className: "w-7 h-7"
                        })}
                      </div>
                    ) : (
                      <ShoppingBag className="w-7 h-7 text-zinc-400" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.merchant}</div>
                    <div className="text-sm text-zinc-400">
                      {transaction.items} items • {transaction.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                    <div className="text-sm text-zinc-500">{transaction.date}</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(transaction.score)}`}>{transaction.score}</div>
                    <div className="text-xs text-zinc-500">score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
