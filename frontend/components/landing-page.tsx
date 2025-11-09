"use client";

import React from "react";
import { Leaf, ShoppingCart, TrendingUp, Award, Shield, Zap, ChevronRight, Sparkles, Globe, Heart } from "lucide-react";
import Link from "next/link";
import Footer from "./footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="LeafCart Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              LeafCart
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">
              How It Works
            </a>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/30 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Track Your Sustainable Shopping Journey</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Shop Smarter,
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 bg-clip-text text-transparent">
                Live Greener
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Get personalized sustainability scores for your purchases and make eco-conscious choices.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition-all flex items-center gap-2 group"
              >
                <span>Start Your Journey</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 px-8 py-4">
                <span className="text-sm text-zinc-400">Powered by</span>
                <img src="/powerd-by-logo.svg" alt="Knot" className="h-5 brightness-0 invert" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                {" "}
                Go Green
              </span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Powerful features that help you understand and improve your environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Real-Time Scoring",
                description:
                  "Get instant sustainability scores for every purchase based on environmental impact factors",
                color: "from-emerald-400 to-green-500",
              },
              {
                icon: ShoppingCart,
                title: "Multi-Merchant Support",
                description: "Track purchases across Amazon, Walmart, Target, and dozens of other retailers",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: Award,
                title: "Achievement System",
                description: "Earn badges and rewards as you make more sustainable purchasing decisions",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "Your data is encrypted and secure. We never sell your information",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: Globe,
                title: "Impact Tracking",
                description: "See your cumulative environmental impact and carbon footprint reduction",
                color: "from-teal-400 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Smart Insights",
                description: "AI-powered recommendations for more sustainable alternatives",
                color: "from-yellow-400 to-orange-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-zinc-800/30 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple Process,
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                {" "}
                Powerful Results
              </span>
            </h2>
            <p className="text-xl text-zinc-400">Get started in three easy steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Your Accounts",
                description: "Securely link your shopping accounts from major retailers",
              },
              {
                step: "02",
                title: "Analyze Purchases",
                description: "Our AI analyzes your transaction history for environmental impact",
              },
              {
                step: "03",
                title: "Track & Improve",
                description: "Monitor your sustainability score and get personalized recommendations",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-emerald-500/50 to-transparent -z-10" />
                )}
                <div className="bg-zinc-800/30 border border-zinc-800 rounded-2xl p-8 hover:border-emerald-500/50 transition-all">
                  <div className="text-6xl font-bold bg-gradient-to-br from-emerald-400 to-green-600 bg-clip-text text-transparent mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border border-zinc-700 rounded-3xl p-12 text-center backdrop-blur-xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                Start tracking your sustainability score today
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition-all hover:scale-105 group"
              >
                Get Started Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
