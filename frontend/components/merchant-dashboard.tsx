"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Leaf,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  ExternalLink,
  Link as LinkIcon,
  Settings,
  RefreshCw,
  Share2,
  Gift,
} from "lucide-react";
import { FaAmazon, FaApple } from "react-icons/fa";
import { SiWalmart, SiTarget, SiDoordash, SiUber, SiInstacart } from "react-icons/si";
import { TbShoppingCart } from "react-icons/tb";
import {
  merchants,
  getTotalTransactionCount,
  getTotalSpending,
  getOverallScore,
  type Transaction,
} from "@/lib/merchantData";
import ConnectMerchantsModal from "./connect-merchants-modal";
import AISearchBar from "./ai-search-bar";
import { getMerchantRatingByName, getMerchantRating } from "@/lib/merchantRatings";
import { getPreprocessedScore, type PreprocessedProductScore } from "@/lib/preprocessedScores";
import ProductDetailModal from "./product-detail-modal";
import ShareScoreModal from "./share-score-modal";
import ScoreDonutChart from "./score-donut-chart";
import type { ProductSustainabilityScore, ScoredTransaction } from "@/lib/geminiAI";

// Icon mapping for merchants
const merchantIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Amazon: FaAmazon,
  Walmart: SiWalmart,
  Target: SiTarget,
  DoorDash: SiDoordash,
  Costco: TbShoppingCart,
  "Uber Eats": SiUber,
  Instacart: SiInstacart,
};

export default function ModernDashboard() {
  const [expandedMerchant, setExpandedMerchant] = useState<string | null>(null);
  const [transactionLimit, setTransactionLimit] = useState<Record<string, number>>({});
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectedMerchantIds, setConnectedMerchantIds] = useState<number[]>([
    44,
    45,
    12,
    19,
    165,
    36,
    40, // IDs for Amazon, Walmart, Target, DoorDash, Costco, Uber Eats, Instacart
  ]);

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    price: number;
    score: PreprocessedProductScore;
  } | null>(null);

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Use useRef instead of useState for the ref
  const aiSearchBarRef = useRef<{
    triggerSuggestion: (productName: string, score: number) => void;
  } | null>(null);

  const totalSpent = getTotalSpending();
  const totalTransactions = getTotalTransactionCount();

  const toggleMerchant = (merchantId: string) => {
    if (expandedMerchant === merchantId) {
      setExpandedMerchant(null);
    } else {
      setExpandedMerchant(merchantId);
      if (!transactionLimit[merchantId]) {
        setTransactionLimit({ ...transactionLimit, [merchantId]: 10 });
      }
    }
  };

  const loadMoreTransactions = (merchantId: string) => {
    const currentLimit = transactionLimit[merchantId] || 10;
    setTransactionLimit({ ...transactionLimit, [merchantId]: currentLimit + 10 });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 65) return "text-yellow-400";
    if (score >= 45) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10";
    if (score >= 65) return "bg-yellow-500/10";
    if (score >= 45) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleMerchant = (merchantId: number) => {
    setConnectedMerchantIds((prev) =>
      prev.includes(merchantId) ? prev.filter((id) => id !== merchantId) : [...prev, merchantId]
    );
  };

  // Show all merchants from merchant data - they all have transaction data loaded
  const activeMerchants = useMemo(() => {
    // Simply return all merchants from merchantData since all JSON files are loaded
    return merchants.filter((m) => m.connected);
  }, []);

  // Calculate overall score from preprocessed data
  const calculateOverallScore = useMemo(() => {
    let totalScore = 0;
    let productCount = 0;

    activeMerchants.forEach((merchant) => {
      merchant.transactions.forEach((transaction) => {
        transaction.products.forEach((product) => {
          const score = getPreprocessedScore(product.name);
          totalScore += score.score;
          productCount++;
        });
      });
    });

    return productCount > 0 ? Math.round(totalScore / productCount) : 0;
  }, [activeMerchants]);

  // Recalculate stats based on active merchants only
  const activeOverallScore = useMemo(() => {
    const allTransactions = activeMerchants.flatMap((m) => m.transactions);
    if (allTransactions.length === 0) return 0;
    const totalScore = allTransactions.reduce((sum, t) => sum + (t.score || 50), 0);
    return Math.round(totalScore / allTransactions.length);
  }, [activeMerchants]);

  const activeTotalSpent = useMemo(() => {
    return activeMerchants.reduce((total, merchant) => {
      return (
        total +
        merchant.transactions.reduce((merchantTotal, transaction) => {
          return merchantTotal + transaction.price.total;
        }, 0)
      );
    }, 0);
  }, [activeMerchants]);

  const activeTotalTransactions = useMemo(() => {
    return activeMerchants.reduce((total, merchant) => total + merchant.transactions.length, 0);
  }, [activeMerchants]);

  // Handle product click to show details
  const handleProductClick = (productName: string, productPrice: number) => {
    const score = getPreprocessedScore(productName);
    setSelectedProduct({
      name: productName,
      price: productPrice,
      score,
    });
  };

  // Handle getting better suggestions from modal
  const handleGetSuggestions = (productName: string, score: number) => {
    setSelectedProduct(null); // Close modal
    if (aiSearchBarRef.current) {
      aiSearchBarRef.current.triggerSuggestion(productName, score);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  LeafCart
                </h1>
                <p className="text-xs text-zinc-400">Sustainability Dashboard</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/rewards"
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 rounded-lg transition-colors"
              >
                <Gift className="w-4 h-4" />
                <span className="text-sm font-medium">Rewards</span>
              </Link>
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share Score</span>
              </button>
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Manage Merchants</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Overall Score with Donut Chart */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-sm text-zinc-400">Your Sustainability Score</div>
            </div>
            <div className="flex justify-center">
              <ScoreDonutChart score={calculateOverallScore} size={200} />
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-sm text-zinc-400">Total Spending</div>
            </div>
            <div className="text-5xl font-bold text-white mb-3">
              ${activeTotalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-zinc-500">Across all merchants</div>
          </div>

          {/* Total Transactions */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-sm text-zinc-400">Total Transactions</div>
            </div>
            <div className="text-5xl font-bold text-white mb-3">{activeTotalTransactions.toLocaleString()}</div>
            <div className="text-sm text-zinc-500">All time</div>
          </div>
        </div>

        {/* Merchants Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Transactions</h2>
            <p className="text-sm text-zinc-400">{activeMerchants.length} connected</p>
          </div>

          {activeMerchants.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-xl font-semibold mb-2">No Merchants Connected</h3>
              <p className="text-zinc-400 mb-6">
                Connect your favorite merchants to start tracking your sustainability journey!
              </p>
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Connect Merchants
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {activeMerchants.map((merchant) => {
                const Icon = merchantIcons[merchant.name] || ShoppingBag;
                const isExpanded = expandedMerchant === merchant.id;
                const limit = transactionLimit[merchant.id] || 10;
                // Sort transactions by total amount (highest first)
                const sortedTransactions = [...merchant.transactions].sort((a, b) => b.price.total - a.price.total);
                const visibleTransactions = sortedTransactions.slice(0, limit);
                const hasMore = sortedTransactions.length > limit;

                // Calculate merchant's average score
                const merchantScore =
                  merchant.transactions.length > 0
                    ? Math.round(
                        merchant.transactions.reduce((sum, t) => sum + (t.score || 50), 0) /
                          merchant.transactions.length
                      )
                    : 0;

                return (
                  <div key={merchant.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    {/* Merchant Header */}
                    <div
                      className="p-6 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                      onClick={() => toggleMerchant(merchant.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${merchant.color}20` }}
                          >
                            <div style={{ color: merchant.name === "Uber Eats" ? "white" : merchant.color }}>
                              <Icon className="w-8 h-8" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">{merchant.name}</h3>
                            <p className="text-sm text-zinc-400">
                              {merchant.transactions.length} transactions • $
                              {merchant.transactions
                                .reduce((sum, t) => sum + t.price.total, 0)
                                .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Merchant Score Badge */}
                          <div className={`px-4 py-2 rounded-lg ${getScoreBgColor(merchantScore)}`}>
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${getScoreColor(merchantScore)}`}>
                                {merchantScore}
                              </span>
                              <span className="text-xs text-zinc-500">Score</span>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-zinc-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Transactions List */}
                    {isExpanded && (
                      <div className="border-t border-zinc-800">
                        <div className="p-6 space-y-3">
                          {merchant.transactions.length === 0 ? (
                            <div className="text-center py-12">
                              <Package className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
                              <p className="text-zinc-400 font-medium mb-1">No transactions yet</p>
                              <p className="text-sm text-zinc-500">
                                Transaction data will appear here once you make purchases
                              </p>
                            </div>
                          ) : (
                            <>
                              {visibleTransactions.map((transaction) => (
                                <div
                                  key={transaction.externalId}
                                  className="p-4 bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl transition-all group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-3 mb-2">
                                        <span className="font-medium">Order #{transaction.externalId}</span>
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium ${
                                            transaction.orderStatus === "DELIVERED"
                                              ? "bg-emerald-500/10 text-emerald-400"
                                              : transaction.orderStatus === "ORDERED"
                                              ? "bg-blue-500/10 text-blue-400"
                                              : "bg-zinc-500/10 text-zinc-400"
                                          }`}
                                        >
                                          {transaction.orderStatus}
                                        </span>
                                        <a
                                          href={transaction.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-zinc-400 hover:text-emerald-400 transition-colors"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </a>
                                      </div>

                                      <div className="text-sm text-zinc-400 mb-3">
                                        <span>{formatDate(transaction.dateTime)}</span>
                                        <span className="mx-2">•</span>
                                        <span>{transaction.products.length} items</span>
                                      </div>

                                      {/* Products List with Scores */}
                                      <div className="space-y-2 mb-3">
                                        {transaction.products.map((product, idx) => {
                                          const productScore = getPreprocessedScore(product.name);
                                          const scoreColor = getScoreColor(productScore.score);
                                          const isBadScore = productScore.score < 50;

                                          return (
                                            <div
                                              key={idx}
                                              onClick={() => handleProductClick(product.name, product.price.unitPrice)}
                                              className={`flex items-center justify-between p-2 rounded-lg transition-all cursor-pointer ${
                                                isBadScore
                                                  ? "bg-red-500/5 hover:bg-red-500/10 border border-red-500/20"
                                                  : "bg-zinc-800/30 hover:bg-zinc-800/50"
                                              }`}
                                            >
                                              <div className="flex items-center gap-2 flex-1">
                                                <Package className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                                                <span className="text-sm text-zinc-300">
                                                  {product.quantity}x {product.name}
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <span className="text-sm text-zinc-400">
                                                  ${product.price.unitPrice.toFixed(2)}
                                                </span>
                                                <div
                                                  className={`px-2 py-1 rounded ${getScoreBgColor(productScore.score)}`}
                                                >
                                                  <span className={`text-xs font-bold ${scoreColor}`}>
                                                    {productScore.score}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>

                                    <div className="flex items-end flex-col gap-2 ml-4">
                                      <div className="text-right">
                                        <div className="text-xl font-semibold">
                                          ${transaction.price.total.toFixed(2)}
                                        </div>
                                        <div className="text-xs text-zinc-500">
                                          Subtotal: ${transaction.price.subTotal.toFixed(2)}
                                        </div>
                                      </div>

                                      {transaction.score && (
                                        <div className={`px-3 py-1 rounded-lg ${getScoreBgColor(transaction.score)}`}>
                                          <span className={`text-lg font-bold ${getScoreColor(transaction.score)}`}>
                                            {transaction.score}
                                          </span>
                                          <span className="text-xs text-zinc-500 ml-1">score</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}

                              {/* Load More Button */}
                              {hasMore && (
                                <button
                                  onClick={() => loadMoreTransactions(merchant.id)}
                                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-medium transition-colors"
                                >
                                  View More ({sortedTransactions.length - limit} remaining)
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Connect Merchants Modal */}
      <ConnectMerchantsModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        connectedMerchants={connectedMerchantIds}
        onToggleMerchant={handleToggleMerchant}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={true}
          onClose={() => setSelectedProduct(null)}
          productName={selectedProduct.name}
          price={selectedProduct.price}
          score={selectedProduct.score}
          onGetSuggestions={handleGetSuggestions}
        />
      )}

      {/* Share Score Modal */}
      <ShareScoreModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        score={calculateOverallScore}
        totalTransactions={activeTotalTransactions}
        totalSpent={activeTotalSpent}
      />

      {/* AI Search Bar */}
      <AISearchBar ref={aiSearchBarRef} userScore={calculateOverallScore} />
    </div>
  );
}
