"use client";

import { X, Leaf, AlertCircle, CheckCircle2 } from "lucide-react";
import { PreprocessedProductScore } from "@/lib/preprocessedScores";

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  price: number;
  score: PreprocessedProductScore;
  onGetSuggestions: (productName: string, score: number) => void;
}

export default function ProductDetailModal({
  isOpen,
  onClose,
  productName,
  price,
  score,
  onGetSuggestions,
}: ProductDetailModalProps) {
  if (!isOpen) return null;

  // Generate descriptive text for sustainability factors
  const getFactorDescription = (factor: string, value: number): string => {
    const factorName = factor
      .replace(/([A-Z])/g, " $1")
      .trim()
      .toLowerCase();

    const descriptions: Record<string, { good: string; bad: string; moderate: string }> = {
      "material quality": {
        good: "Made from high-quality, durable materials that last longer",
        bad: "Low-quality materials that wear out quickly and contribute to waste",
        moderate: "Decent material quality but could be more durable",
      },
      "environmental impact": {
        good: "Minimal carbon footprint and eco-friendly production process",
        bad: "High carbon emissions and harmful environmental impact during production",
        moderate: "Moderate environmental impact with room for improvement",
      },
      recyclability: {
        good: "Fully recyclable materials that can be easily repurposed",
        bad: "Non-recyclable materials that end up in landfills",
        moderate: "Partially recyclable with some components that can be reused",
      },
      biodegradability: {
        good: "Biodegradable and breaks down naturally without harming the environment",
        bad: "Non-biodegradable and persists in the environment for years",
        moderate: "Takes time to decompose but eventually breaks down",
      },
      packaging: {
        good: "Minimal, recyclable packaging made from sustainable materials",
        bad: "Excessive plastic packaging that's harmful to the environment",
        moderate: "Some recyclable packaging but could be reduced",
      },
      "carbon footprint": {
        good: "Low carbon emissions from production and transportation",
        bad: "High carbon footprint contributing to climate change",
        moderate: "Average carbon emissions with potential for reduction",
      },
      toxicity: {
        good: "Non-toxic and safe for human health and the environment",
        bad: "Contains harmful chemicals or toxic substances",
        moderate: "Some chemicals present but within acceptable limits",
      },
      renewability: {
        good: "Made from renewable resources that can be replenished",
        bad: "Relies on non-renewable resources that deplete natural reserves",
        moderate: "Mix of renewable and non-renewable materials",
      },
      "production ethics": {
        good: "Ethical production with fair labor practices and sustainable sourcing",
        bad: "Questionable production practices and poor labor conditions",
        moderate: "Some ethical considerations but not fully transparent",
      },
      longevity: {
        good: "Built to last, reducing the need for frequent replacements",
        bad: "Short lifespan requiring frequent replacement and creating waste",
        moderate: "Decent durability but not designed for long-term use",
      },
    };

    const factorKey = factorName.toLowerCase();
    const desc = descriptions[factorKey] || {
      good: `Good ${factorName} rating`,
      bad: `Poor ${factorName} rating`,
      moderate: `Moderate ${factorName} rating`,
    };

    if (value >= 70) return desc.good;
    if (value >= 40) return desc.moderate;
    return desc.bad;
  };

  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "text-emerald-400";
    if (scoreValue >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "bg-emerald-500/20";
    if (scoreValue >= 40) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  const getScoreBorderColor = (scoreValue: number) => {
    if (scoreValue >= 70) return "border-emerald-500/50";
    if (scoreValue >= 40) return "border-yellow-500/50";
    return "border-red-500/50";
  };

  const getScoreLabel = (scoreValue: number) => {
    if (scoreValue >= 70) return "Sustainable";
    if (scoreValue >= 40) return "Moderate";
    return "Poor";
  };

  const isBadScore = score.score < 50;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">{productName}</h2>
            <p className="text-zinc-400">${price.toFixed(2)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Overview */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`${getScoreBgColor(score.score)} ${getScoreBorderColor(
                score.score
              )} border rounded-2xl p-6 flex flex-col items-center justify-center min-w-[140px]`}
            >
              <div className={`text-5xl font-bold ${getScoreColor(score.score)}`}>{score.score}</div>
              <div className="text-zinc-400 text-sm mt-2">{getScoreLabel(score.score)}</div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isBadScore ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                )}
                <span className="font-semibold text-white">{isBadScore ? "Low Sustainability" : "Good Choice"}</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{score.reasoning}</p>
            </div>
          </div>

          {/* Bad Score CTA */}
          {isBadScore && (
            <button
              onClick={() => onGetSuggestions(productName, score.score)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Leaf className="w-5 h-5" />
              Get Better Alternatives
            </button>
          )}
        </div>

        {/* Good & Bad Highlights */}
        <div className="p-6 border-b border-zinc-800">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Good Points */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="font-semibold text-emerald-400">What's Good</h4>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                {Object.entries(score.sustainabilityFactors)
                  .filter(([_, value]) => value >= 70)
                  .map(([factor, value]) => (
                    <li key={factor} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-1 shrink-0">✓</span>
                      <div>
                        <div className="font-medium text-emerald-300 capitalize mb-1">
                          {factor.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">{getFactorDescription(factor, value)}</p>
                      </div>
                    </li>
                  ))}
                {Object.entries(score.sustainabilityFactors).filter(([_, value]) => value >= 70).length === 0 && (
                  <li className="text-zinc-500 italic">No standout positive factors</li>
                )}
              </ul>
            </div>

            {/* Bad Points */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <h4 className="font-semibold text-red-400">What's Bad</h4>
              </div>
              <ul className="space-y-3 text-sm text-zinc-300">
                {Object.entries(score.sustainabilityFactors)
                  .filter(([_, value]) => value < 50)
                  .map(([factor, value]) => (
                    <li key={factor} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1 shrink-0">✗</span>
                      <div>
                        <div className="font-medium text-red-300 capitalize mb-1">
                          {factor.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">{getFactorDescription(factor, value)}</p>
                      </div>
                    </li>
                  ))}
                {Object.entries(score.sustainabilityFactors).filter(([_, value]) => value < 50).length === 0 && (
                  <li className="text-zinc-500 italic">No major concerns</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Sustainability Factors */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            Sustainability Breakdown
          </h3>

          <div className="space-y-4">
            {Object.entries(score.sustainabilityFactors).map(([factor, value]) => (
              <div key={factor}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-zinc-300 capitalize">{factor.replace(/([A-Z])/g, " $1").trim()}</span>
                  <span className={`font-semibold ${getScoreColor(value)}`}>{value}/100</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      value >= 70 ? "bg-emerald-500" : value >= 40 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Badge */}
        <div className="p-6 pt-0">
          <div className="inline-flex items-center gap-2 bg-zinc-800 px-4 py-2 rounded-lg">
            <span className="text-zinc-400 text-sm">Category:</span>
            <span className="text-white font-medium">{score.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
