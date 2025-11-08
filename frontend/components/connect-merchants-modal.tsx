"use client";

import React, { useState } from "react";
import { X, Link as LinkIcon, Unlink, Search, ChevronDown, Star } from "lucide-react";
import { merchantRatings, getRatingInfo, type MerchantRating } from "@/lib/merchantRatings";

interface ConnectMerchantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedMerchants: number[];
  onToggleMerchant: (merchantId: number) => void;
}

export default function ConnectMerchantsModal({
  isOpen,
  onClose,
  connectedMerchants,
  onToggleMerchant,
}: ConnectMerchantsModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(12);
  const [filterScore, setFilterScore] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredMerchants = merchantRatings.filter((merchant) => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterScore === null || merchant.sustainabilityScore === filterScore;
    return matchesSearch && matchesFilter;
  });

  const displayedMerchants = filteredMerchants.slice(0, displayCount);
  const hasMore = filteredMerchants.length > displayCount;

  const getScoreStars = (score: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < score ? "fill-current" : "fill-none"}`}
        style={{
          color: i < score ? getScoreColor(score) : "#52525b",
        }}
      />
    ));
  };

  const getScoreColor = (score: number) => {
    const colors = {
      5: "#10b981", // emerald-500
      4: "#22c55e", // green-500
      3: "#f59e0b", // amber-500
      2: "#f97316", // orange-500
      1: "#ef4444", // red-500
    };
    return colors[score as keyof typeof colors] || colors[3];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Connect Merchants</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Manage your merchant connections • {connectedMerchants.length} connected
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-zinc-800 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Score Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-zinc-400">Filter by score:</span>
            <button
              onClick={() => setFilterScore(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filterScore === null ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((score) => {
              const info = getRatingInfo(score);
              return (
                <button
                  key={score}
                  onClick={() => setFilterScore(score)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    filterScore === score
                      ? `bg-gradient-to-r ${info.color} text-white`
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {score} Stars
                </button>
              );
            })}
          </div>
        </div>

        {/* Merchant Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedMerchants.map((merchant) => {
              const isConnected = connectedMerchants.includes(merchant.id);
              const ratingInfo = getRatingInfo(merchant.sustainabilityScore);

              return (
                <div
                  key={merchant.id}
                  className={`p-4 border rounded-xl transition-all cursor-pointer ${
                    isConnected
                      ? "bg-zinc-800/50 border-emerald-500/50"
                      : "bg-zinc-800/30 border-zinc-700 hover:border-zinc-600"
                  }`}
                  onClick={() => onToggleMerchant(merchant.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{merchant.name}</h3>
                      <div className="flex items-center gap-1 mb-2">{getScoreStars(merchant.sustainabilityScore)}</div>
                    </div>
                    {isConnected ? (
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <LinkIcon className="w-4 h-4 text-emerald-400" />
                      </div>
                    ) : (
                      <div className="p-2 bg-zinc-700/50 rounded-lg">
                        <Unlink className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                  </div>

                  {/* Rating Badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r ${ratingInfo.color} text-white`}
                  >
                    {ratingInfo.title}
                  </div>

                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{ratingInfo.description}</p>
                </div>
              );
            })}
          </div>

          {/* View More Button */}
          {hasMore && (
            <button
              onClick={() => setDisplayCount(displayCount + 12)}
              className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              View More ({filteredMerchants.length - displayCount} remaining)
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {filteredMerchants.length === 0 && (
            <div className="text-center py-12 text-zinc-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No merchants found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 flex items-center justify-between">
          <div className="text-sm text-zinc-400">
            {connectedMerchants.length} of {merchantRatings.length} merchants connected
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
