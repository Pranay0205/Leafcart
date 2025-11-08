"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SUPPORTED_MERCHANTS } from "@/lib/multi-merchant-api"
import type { MerchantInfo } from "@/lib/types"

export function MerchantConnections() {
  const [connectedMerchants, setConnectedMerchants] = useState<Set<string>>(
    new Set(["amazon", "doordash", "instacart", "uber_eats"]),
  )

  const toggleMerchant = (merchantId: string) => {
    const newConnected = new Set(connectedMerchants)
    if (newConnected.has(merchantId)) {
      newConnected.delete(merchantId)
    } else {
      newConnected.add(merchantId)
    }
    setConnectedMerchants(newConnected)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Merchants</CardTitle>
        <CardDescription>Manage your account connections for transaction tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {Object.values(SUPPORTED_MERCHANTS).map((merchant: MerchantInfo) => {
            const isConnected = connectedMerchants.has(merchant.id)
            return (
              <div
                key={merchant.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{merchant.icon}</span>
                  <div>
                    <p className="font-medium">{merchant.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {merchant.category}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant={isConnected ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleMerchant(merchant.id)}
                >
                  {isConnected ? "Connected" : "Connect"}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
