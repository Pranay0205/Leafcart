import React from "react";
import Link from "next/link";
import { Leaf, Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-xl mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Tagline */}
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="LeafCart Logo" className="w-8 h-8" />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                LeafCart
              </span>
              <p className="text-xs text-zinc-500">Every purchase decision matters</p>
            </div>
          </div>

          {/* Team */}
          <div className="text-center">
            <p className="text-sm text-zinc-400 mb-2">Built by</p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <span className="text-emerald-400 font-medium">Pranay Ghuge</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-medium">Arundhati Das</span>
              <span className="text-zinc-600">•</span>
              <span className="text-emerald-400 font-medium">Shreeya</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-xs text-zinc-500">© {new Date().getFullYear()} LeafCart</p>
            <p className="text-xs text-zinc-600 mt-1">Built with 💚 for sustainability</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
