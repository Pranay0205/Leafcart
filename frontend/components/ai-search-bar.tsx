"use client";

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Send, Loader2, Sparkles, X, Maximize2, Minimize2, TrendingUp } from "lucide-react";
import { chatWithAI, getBetterProductSuggestion } from "@/lib/geminiAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AISearchBarProps {
  userScore?: number;
}

export interface AISearchBarRef {
  triggerSuggestion: (productName: string, score: number) => void;
}

const AISearchBar = forwardRef<AISearchBarRef, AISearchBarProps>(({ userScore }, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
    }
  }, [isExpanded]);

  // Expose triggerSuggestion via ref
  useImperativeHandle(ref, () => ({
    triggerSuggestion: async (productName: string, score: number) => {
      setIsExpanded(true);
      setIsLoading(true);

      try {
        const suggestion = await getBetterProductSuggestion(productName, score, "General");

        const userMessage: Message = {
          id: Date.now().toString(),
          role: "user",
          content: `Can you suggest better alternatives for "${productName}" (score: ${score})?`,
          timestamp: new Date(),
        };

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: suggestion,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
      } catch (error) {
        console.error("Error getting suggestion:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm having trouble getting suggestions right now. Please try again. 🌱",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
  }));

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

    try {
      const response = await chatWithAI(userMessage.content, {
        userScore,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error chatting with AI:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment. 🌱",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        {/* Expanded Chat Window */}
        {isExpanded && messages.length > 0 && (
          <div
            ref={chatContainerRef}
            className="mb-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl max-h-[500px] overflow-hidden flex flex-col"
          >
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 to-green-600/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sustainability AI</h3>
                  {userScore !== undefined && (
                    <div className="flex items-center gap-2 text-xs">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Your Score: {userScore}/100</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  title="Clear chat"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[380px]">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === "user" ? "text-emerald-100" : "text-zinc-500"}`}>
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
                  <div className="bg-zinc-800 rounded-xl p-4">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-full shadow-2xl">
          <div className="flex items-center gap-3 p-3">
            {/* AI Icon */}
            <div className="flex-shrink-0 ml-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsExpanded(true)}
              placeholder="Ask about your transactions, sustainability tips, or product recommendations..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-400 text-sm"
            />

            {/* Expand/Collapse Button */}
            {messages.length > 0 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-shrink-0 p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                title={isExpanded ? "Minimize" : "Expand chat"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mr-1"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {/* Quick Suggestions (shown when not expanded and no messages) */}
          {!isExpanded && messages.length === 0 && (
            <div className="px-6 pb-4 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-zinc-500">Try asking:</span>
                {[
                  "How sustainable are my purchases?",
                  "Show me eco-friendly alternatives",
                  "Tips to improve my score",
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(suggestion)}
                    className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AISearchBar.displayName = "AISearchBar";

export default AISearchBar;
