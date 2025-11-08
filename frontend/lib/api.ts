// API Configuration for Knot API
// Base URL: https://development.knotapi.com

export const API_CONFIG = {
  baseUrl: "https://development.knotapi.com",
  auth: {
    // Replace with your actual credentials
    username: process.env.NEXT_PUBLIC_KNOT_CLIENT_ID || "your_client_id",
    password: process.env.NEXT_PUBLIC_KNOT_SECRET || "your_secret",
  },
  endpoints: {
    // Transaction endpoints
    transactionSync: "/transactions/sync",
    transactionGetById: "/transactions/{id}",

    // Merchant endpoints
    merchantList: "/merchant/list",
    accountsGet: "/accounts",

    // Shopping endpoints
    cartSync: "/cart",
    checkout: "/checkout",

    // Session endpoints
    sessionCreate: "/session/create",
    sessionExtend: "/session/extend",
  },
};

// Helper function to create auth header
export function getAuthHeader(): string {
  const credentials = btoa(`${API_CONFIG.auth.username}:${API_CONFIG.auth.password}`);
  return `Basic ${credentials}`;
}

// API Types
export interface TransactionSyncRequest {
  merchant_id: number;
  external_user_id: string;
  cursor?: string;
  limit?: number;
}

export interface MerchantListRequest {
  type: "card_switcher" | "transaction_link" | "shopping" | "vault";
  platform?: "ios" | "android" | "web";
  search?: string;
  external_user_id?: string;
}

export interface AccountsGetRequest {
  external_user_id: string;
  merchant_id?: number;
  type?: "card_switcher" | "transaction_link" | "vault";
}

// API Service Functions
export async function fetchMerchantList(request: MerchantListRequest) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.merchantList}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch merchant list: ${response.statusText}`);
  }

  return response.json();
}

export async function syncTransactions(request: TransactionSyncRequest) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactionSync}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Failed to sync transactions: ${response.statusText}`);
  }

  return response.json();
}

export async function getAccounts(request: AccountsGetRequest) {
  const params = new URLSearchParams();
  params.append("external_user_id", request.external_user_id);
  if (request.merchant_id) params.append("merchant_id", request.merchant_id.toString());
  if (request.type) params.append("type", request.type);

  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.accountsGet}?${params}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get accounts: ${response.statusText}`);
  }

  return response.json();
}
