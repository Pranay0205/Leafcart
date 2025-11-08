"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Minimize2, Maximize2, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your sustainability assistant. Ask me anything about eco-friendly shopping, product sustainability, or your purchase history!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // TODO: Replace with actual API call to your AI service
    // For now, using a mock response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getMockResponse(userMessage.content),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getMockResponse = (userInput: string): string => {
    const lower = userInput.toLowerCase();

    if (lower.includes("sustainable") || lower.includes("eco")) {
      return "Great question! Sustainable products typically have certifications like GOTS, FSC, or Rainforest Alliance. Look for items made from organic materials, recycled content, or biodegradable components. Would you like specific recommendations?";
    } else if (lower.includes("score") || lower.includes("rating")) {
      return "Your sustainability score is calculated based on the products you buy. Items with eco-friendly certifications, recycled materials, and sustainable sourcing earn higher scores. Check your merchant transactions to see detailed breakdowns!";
    } else if (lower.includes("improve") || lower.includes("better")) {
      return "To improve your sustainability score, try: 1) Choose products with recognized eco-certifications, 2) Opt for items made from recycled or biodegradable materials, 3) Support brands with strong sustainability commitments, 4) Reduce single-use plastics. Want more specific tips?";
    } else {
      return "I'm here to help you make more sustainable choices! You can ask me about product sustainability, eco-friendly alternatives, or how to improve your environmental impact. What would you like to know?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transition-all ${
        isMinimized ? "w-80" : "w-96 h-[600px]"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-green-600/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Sustainability AI</h3>
            <p className="text-xs text-emerald-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-zinc-400" />
            ) : (
              <Minimize2 className="w-4 h-4 text-zinc-400" />
            )}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[440px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                      : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-emerald-100" : "text-zinc-500"}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 rounded-xl p-3">
                  <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about sustainability..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none max-h-24"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
