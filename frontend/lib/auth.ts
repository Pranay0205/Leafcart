// Simple session-based authentication for single-user testing
// In production, use NextAuth.js or similar

interface UserSession {
  userId: string
  email: string
  connectedMerchants: string[]
  createdAt: Date
}

// In-memory store for testing (replace with database in production)
let currentSession: UserSession | null = null

export function getCurrentSession(): UserSession | null {
  return currentSession
}

export function createTestSession(): UserSession {
  const testSession: UserSession = {
    userId: "test-user-001",
    email: "user@example.com",
    connectedMerchants: ["amazon", "doordash", "uber_eats"],
    createdAt: new Date(),
  }
  currentSession = testSession
  return testSession
}

export function getOrCreateSession(): UserSession {
  if (!currentSession) {
    return createTestSession()
  }
  return currentSession
}

export function logout(): void {
  currentSession = null
}

export function addMerchantConnection(merchantId: string): void {
  if (currentSession && !currentSession.connectedMerchants.includes(merchantId)) {
    currentSession.connectedMerchants.push(merchantId)
  }
}

export function removeMerchantConnection(merchantId: string): void {
  if (currentSession) {
    currentSession.connectedMerchants = currentSession.connectedMerchants.filter((m) => m !== merchantId)
  }
}
