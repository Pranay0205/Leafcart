"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { ChatMessage, TransactionData } from "@/lib/types"

interface ChatInterfaceProps {
  transactions?: TransactionData[]
}

export function ChatInterface({ transactions = [] }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your sustainability advisor. I can help you understand your purchases across all merchants, suggest more sustainable alternatives, and answer questions about sustainable living. What would you like to know?",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "chat",
          userMessage: userMessage.content,
          transactions,
        }),
      })

      const data = await response.json()
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.recommendation,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, I'm having trouble processing your request. Please try again. You can ask me about sustainable alternatives, environmental impact, or tips to improve your sustainability score.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-white border border-emerald-200 rounded-lg">
      <div className="border-b border-emerald-100 p-4">
        <CardTitle className="text-lg">Sustainability Advisor</CardTitle>
        <CardDescription>Get personalized recommendations</CardDescription>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs rounded-lg p-3 text-sm ${
                  message.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-emerald-100 text-emerald-900 rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-emerald-100 text-emerald-900 rounded-lg p-3 rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-emerald-100 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sustainability..."
            disabled={loading}
            className="border-emerald-200"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  )
}
