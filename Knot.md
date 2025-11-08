{
"server": {
"name": "Docs",
"version": "1.0.0",
"transport": "http"
},
"capabilities": {
"tools": {
"SearchDocs": {
"name": "SearchDocs",
"description": "Search across the Docs knowledge base to find relevant information, code examples, API references, and guides. Use this tool when you need to answer questions about Docs, find specific documentation, understand how features work, or locate implementation details. The search returns contextual content with titles and direct links to the documentation pages.",
"method": "",
"pathTemplate": "",
"parameters": [],
"inputSchema": {
"type": "object",
"properties": {
"query": {
"type": "string",
"description": "A query to search the content with."
}
},
"required": [
"query"
]
},
"executionParameters": [],
"securityRequirements": [],
"operationId": "MintlifyDefaultSearch"
},
"transaction_sync": {
"name": "transaction_sync",
"description": "Sync a user's transactions for a merchant account using cursor-based pagination.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"merchant_id": {
"type": "number",
"description": "Unique identifier for the merchant."
},
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"cursor": {
"type": "string",
"description": "Cursor token pointing to the last transaction retrieved. The `/transactions/sync` endpoint uses **cursor-based** pagination to track which transactions have already been seen, minimizing data redundancy. \n\nOn the first call, the endpoint returns all transactions **paginated**. In subsequent calls, only new transactions are provided using the **next cursor**."
},
"limit": {
"type": "number",
"description": "Maximum number of transactions to retrieve (min: 1, max: 100).",
"default": 5
}
},
"required": [
"merchant_id",
"external_user_id"
],
"description": "The input parameters required for syncing transactions."
}
}
},
"method": "post",
"pathTemplate": "/transactions/sync",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "transaction_sync",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"transaction_get_by_id": {
"name": "transaction_get_by_id",
"description": "Get a specific transaction by ID.",
"inputSchema": {
"type": "object",
"properties": {
"id": {
"type": "string",
"description": "UUID for a transaction provided in the UPDATED_TRANSACTIONS_AVAILABLE webhook."
}
},
"required": [
"id"
]
},
"method": "get",
"pathTemplate": "/transactions/{id}",
"parameters": [
{
"name": "id",
"in": "path",
"required": true,
"schema": {
"type": "string",
"example": "13da3c28-a068-4642-9ce2-b730cfda5f5f",
"description": "UUID for a transaction provided in the UPDATED_TRANSACTIONS_AVAILABLE webhook."
},
"description": "UUID for a transaction provided in the UPDATED_TRANSACTIONS_AVAILABLE webhook."
}
],
"executionParameters": [
{
"name": "id",
"in": "path"
}
],
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "transaction_get_by_id",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"cart_sync": {
"name": "cart_sync",
"description": "Add one or more products to a user's merchant cart.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"merchant_id": {
"type": "number",
"description": "Unique identifier for the merchant."
},
"products": {
"type": "array",
"description": "List of products to add to the cart.",
"items": {
"type": "object",
"properties": {
"external_id": {
"type": "string",
"description": "Merchant's identifier for the product. Format varies by merchant."
},
"fulfillment": {
"type": "object",
"description": "",
"properties": {
"id": {
"type": "string",
"description": "Unique identifier for the fulfillment option sent in [`SYNC_CART_SUCCEEDED`](https://docs.knotapi.com/shopping/webhook-events#sync-cart-succeeded)."
}
},
"required": [
"id"
]
}
},
"required": [
"external_id"
]
}
},
"delivery_location": {
"type": "object",
"description": "",
"properties": {
"address": {
"type": "object",
"description": "",
"properties": {
"line1": {
"type": "string",
"description": "First line of the delivery address.",
"maxLength": 46
},
"line2": {
"type": "string",
"description": "Second line of the delivery address.",
"maxLength": 46
},
"city": {
"type": "string",
"description": "City portion of the delivery address."
},
"region": {
"type": "string",
"description": "Region portion of the delivery address, usually a state abbreviation. Must be an ISO 3166-2 sub-division code."
},
"postal_code": {
"type": "string",
"description": "Postal code of the delivery address.",
"minLength": 5,
"maxLength": 10
},
"country": {
"type": "string",
"description": "Country portion of the delivery address. Must be an ISO 3166-1 alpha-2 code."
}
},
"required": [
"line1",
"city",
"region",
"postal_code",
"country"
]
},
"first_name": {
"type": "string",
"maxLength": 255,
"description": "First name for the delivery address."
},
"last_name": {
"type": "string",
"maxLength": 255,
"description": "Last name for the delivery address."
},
"phone_number": {
"type": "string",
"description": "Phone number for the delivery address in E.164 format."
},
"set_as_default": {
"type": "boolean",
"description": "Whether the delivery address should be saved as the user's default in the merchant account.",
"default": false
}
},
"required": [
"address",
"first_name",
"last_name",
"phone_number",
"set_as_default"
]
},
"simulate": {
"description": "Simulate a failure in the development environment.",
"oneOf": [
{
"type": "string",
"enum": [
"failed"
],
"description": "The sync cart attempt fails.",
"example": "failed"
}
]
}
},
"required": [
"external_user_id",
"merchant_id",
"products"
],
"description": "The input parameters required for adding products to a user's merchant cart."
}
}
},
"method": "post",
"pathTemplate": "/cart",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "cart_sync",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"checkout": {
"name": "checkout",
"description": "Checkout a user's merchant cart.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"merchant_id": {
"type": "number",
"description": "Unique identifier for the merchant."
},
"payment_method": {
"type": "object",
"properties": {
"id": {
"type": "string",
"description": "Your unique identifier for the payment method."
},
"jwe": {
"type": "string",
"description": "JWE value of the `user` and `card` objects. Created using the public key retrieved from [Retrieve JWK](https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk)"
},
"user": {
"type": "string",
"description": "User object encrypted in a JWE. Created using the public key retrieved from [Retrieve JWK](https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk)"
},
"card": {
"type": "string",
"description": "Card object encrypted in a JWE. Created using the public key retrieved from [Retrieve JWK](https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk)"
},
"is_single_use": {
"type": "boolean",
"description": "Whether the payment method is single-use only.",
"default": false
}
},
"required": [
"id",
"is_single_use"
]
},
"simulate": {
"description": "Simulate a failure in the development environment.",
"oneOf": [
{
"type": "string",
"enum": [
"failed"
],
"description": "The checkout attempt fails.",
"example": "failed"
}
]
}
},
"required": [
"external_user_id",
"merchant_id"
],
"description": "The input parameters required to checkout a cart."
}
}
},
"method": "post",
"pathTemplate": "/cart/checkout",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "checkout",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"session_create": {
"name": "session_create",
"description": "Create a session and use it to initialize the SDK.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"type": {
"type": "string",
"enum": [
"card_switcher",
"transaction_link",
"link",
"vault"
],
"description": "Product to associate the session with."
},
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"card_id": {
"type": [
"string",
"null"
],
"description": "Your unique identifier for a specific card. **Required if type = card_switcher.**",
"default": null
},
"phone_number": {
"type": [
"string",
"null"
],
"description": "User's phone number in E.164 format.",
"default": null
},
"email": {
"type": [
"string",
"null"
],
"description": "User's email address.",
"default": null
},
"processor_token": {
"type": [
"string",
"null"
],
"description": "Plaid processor_token if using transaction data from Plaid to detect merchants.",
"default": null
}
},
"required": [
"type",
"external_user_id"
],
"description": "The input parameters required for creating a session."
}
}
},
"method": "post",
"pathTemplate": "/session/create",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "session_create",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"session_extend": {
"name": "session_extend",
"description": "Extend a session.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"session_id": {
"type": "string",
"description": "Specific session."
}
},
"required": [
"session_id"
],
"description": "The input parameters required for extending a session."
}
}
},
"method": "post",
"pathTemplate": "/session/extend",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "session_extend",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"jwe_get_public_key": {
"name": "jwe_get_public_key",
"description": "Retrieve a public key in JWK format.",
"inputSchema": {
"type": "object",
"properties": {}
},
"method": "get",
"pathTemplate": "/jwe/key",
"parameters": [],
"executionParameters": [],
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "jwe_get_public_key",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"card_switch": {
"name": "card_switch",
"description": "Switch a card in a user's merchant account.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"task_id": {
"type": "string",
"description": "`task_id` value provided in the `AUTHENTICATED` webhook."
},
"jwe": {
"type": "string",
"description": "JWE value."
},
"user": {
"type": "string",
"description": "User object encrypted in a JWE. Created using the public key retrieved from [Retrieve JWK](https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk)"
},
"card": {
"type": "string",
"description": "Card object encrypted in a JWE. Created using the public key retrieved from [Retrieve JWK](https://docs.knotapi.com/api-reference/products/card-switcher/retrieve-jwk)"
}
},
"required": [
"task_id",
"jwe"
],
"description": "The input parameters required for switching a card."
}
}
},
"method": "post",
"pathTemplate": "/card",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "card_switch",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"merchant_list": {
"name": "merchant_list",
"description": "Retrieve a list of available merchants.",
"inputSchema": {
"type": "object",
"properties": {
"requestBody": {
"type": "object",
"properties": {
"type": {
"type": "string",
"enum": [
"card_switcher",
"transaction_link",
"shopping",
"vault"
],
"description": "Product for which the merchants are available."
},
"platform": {
"type": "string",
"enum": [
"ios",
"android",
"web"
],
"description": "Platform for which the merchants are available. Providing this parameter in the request will return the `min_sdk_version` parameter in the response."
},
"search": {
"type": "string",
"description": "Name of a specific merchant."
},
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user. The values of the `status` parameter returned in the response when sending `external_user_id` can be found [here](https://docs.knotapi.com/api-reference/merchants/list-merchants-status)."
}
},
"required": [
"type"
],
"description": "The input parameters required for retrieving merchants."
}
}
},
"method": "post",
"pathTemplate": "/merchant/list",
"parameters": [],
"executionParameters": [],
"requestBodyContentType": "application/json",
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "merchant_list",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"accounts_get": {
"name": "accounts_get",
"description": "Get a user's merchant accounts linked to Knot.",
"inputSchema": {
"type": "object",
"properties": {
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"merchant_id": {
"type": "number",
"description": "Unique identifier for a merchant. Used to return a single merchant account object."
},
"type": {
"type": "string",
"enum": [
"card_switcher",
"transaction_link",
"vault"
],
"description": "Product type for which you want to get the status of the most recent login attempt in `lifecycle.status`."
}
},
"required": [
"external_user_id"
]
},
"method": "get",
"pathTemplate": "/accounts/get",
"parameters": [
{
"name": "external_user_id",
"in": "query",
"required": true,
"schema": {
"type": "string",
"description": "Your unique identifier for the user."
},
"description": "Your unique identifier for the user."
},
{
"name": "merchant_id",
"in": "query",
"required": false,
"schema": {
"type": "integer",
"example": 19,
"description": "Unique identifier for a merchant. Used to return a single merchant account object."
},
"description": "Unique identifier for a merchant. Used to return a single merchant account object."
},
{
"name": "type",
"in": "query",
"required": false,
"schema": {
"type": "string",
"enum": [
"card_switcher",
"transaction_link",
"vault"
],
"example": "card_switcher",
"description": "Product type for which you want to get the status of the most recent login attempt in `lifecycle.status`."
},
"description": "Product type for which you want to get the status of the most recent login attempt in `lifecycle.status`."
}
],
"executionParameters": [
{
"name": "external_user_id",
"in": "query"
},
{
"name": "merchant_id",
"in": "query"
},
{
"name": "type",
"in": "query"
}
],
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "accounts_get",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
},
"detected_accounts_get": {
"name": "detected_accounts_get",
"description": "Retrieve detected accounts for a given user.",
"inputSchema": {
"type": "object",
"properties": {
"external_user_id": {
"type": "string",
"description": "Your unique identifier for the user."
},
"merchant_id": {
"type": "number",
"description": "Unique identifier for the merchant. If provided, only a detected account for this merchant will be returned."
}
},
"required": [
"external_user_id"
]
},
"method": "get",
"pathTemplate": "/detected_accounts/get",
"parameters": [
{
"name": "external_user_id",
"in": "query",
"required": true,
"schema": {
"type": "string",
"description": "Your unique identifier for the user."
},
"description": "Your unique identifier for the user."
},
{
"name": "merchant_id",
"in": "query",
"required": false,
"schema": {
"type": "integer",
"description": "Unique identifier for the merchant. If provided, only a detected account for this merchant will be returned."
},
"description": "Unique identifier for the merchant. If provided, only a detected account for this merchant will be returned."
}
],
"executionParameters": [
{
"name": "external_user_id",
"in": "query"
},
{
"name": "merchant_id",
"in": "query"
}
],
"securityRequirements": [
{
"basicAuth": []
}
],
"operationId": "detected_accounts_get",
"baseUrl": "https://development.knotapi.com",
"securitySchemes": {
"basicAuth": {
"type": "http",
"scheme": "basic",
"description": "Basic authentication header of the form `Basic <encoded-value>`, where `<encoded-value>` is the base64-encoded string `username:password`. Use your `client_id` as the `username` and your `secret` as the `password` value."
}
}
}
},
"resources": [],
"prompts": []
}
}
