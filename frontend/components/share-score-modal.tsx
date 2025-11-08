"use client";

import { Share2, X } from "lucide-react";
import { useState } from "react";
import { FaXTwitter, FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa6";

interface ShareScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  totalTransactions: number;
  totalSpent: number;
}

export default function ShareScoreModal({
  isOpen,
  onClose,
  score,
  totalTransactions,
  totalSpent,
}: ShareScoreModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🌟";
    if (score >= 65) return "🌱";
    if (score >= 45) return "🌿";
    return "🌍";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Eco Champion";
    if (score >= 65) return "Green Shopper";
    if (score >= 45) return "Conscious Consumer";
    return "Getting Started";
  };

  const shareText = `${getScoreEmoji(score)} My LeafCart Sustainability Score: ${score}/100!\n\nI'm a ${getScoreLabel(
    score
  )} with ${totalTransactions} eco-conscious purchases tracked.\n\nJoin me in making sustainable shopping choices! 🌱\n\n#LeafCart #SustainableShopping #EcoFriendly`;

  const shareUrl = "https://leafcart.app"; // Update with actual URL

  const handleShare = (platform: string) => {
    let url = "";

    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(
          shareUrl
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(
          shareText
        )}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case "instagram":
        // Instagram doesn't support direct web sharing, copy to clipboard instead
        copyToClipboard();
        return;
    }

    window.open(url, "_blank", "width=600,height=400");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            Share Your Score
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Preview */}
        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-b border-zinc-800">
          <div className="text-center">
            <div className="text-6xl mb-2">{getScoreEmoji(score)}</div>
            <div className="text-5xl font-bold text-white mb-2">{score}/100</div>
            <div className="text-emerald-400 font-semibold text-lg mb-4">{getScoreLabel(score)}</div>
            <div className="flex items-center justify-center gap-6 text-sm text-zinc-400">
              <div>
                <div className="font-semibold text-white">{totalTransactions}</div>
                <div>Purchases</div>
              </div>
              <div className="w-px h-8 bg-zinc-700" />
              <div>
                <div className="font-semibold text-white">${totalSpent.toLocaleString()}</div>
                <div>Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-6">
          <p className="text-zinc-400 text-sm mb-4 text-center">
            Share your sustainability journey with friends and inspire them to shop greener!
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => handleShare("twitter")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group"
            >
              <FaXTwitter className="w-5 h-5" />
              <span className="font-medium">X (Twitter)</span>
            </button>

            <button
              onClick={() => handleShare("facebook")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group"
            >
              <FaFacebook className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Facebook</span>
            </button>

            <button
              onClick={() => handleShare("linkedin")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group"
            >
              <FaLinkedin className="w-5 h-5 text-blue-400" />
              <span className="font-medium">LinkedIn</span>
            </button>

            <button
              onClick={() => handleShare("instagram")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-all group relative"
            >
              <FaInstagram className="w-5 h-5 text-pink-500" />
              <span className="font-medium">Instagram</span>
              {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap">
                  Copied to clipboard!
                </div>
              )}
            </button>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-emerald-400 font-medium transition-all"
          >
            {copied ? "✓ Copied to Clipboard!" : "Copy Share Text"}
          </button>
        </div>
      </div>
    </div>
  );
}
