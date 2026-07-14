## API Documentation

> **Note:** This documentation was generated from the project architecture, Prisma schema, and implemented modules. It is intended as a professional developer-facing API reference.

---

# Overview

This is a Node.js + Express + TypeScript REST API using Prisma ORM and PostgreSQL.

## Features

* JWT Authentication with refresh tokens
* Role-based authorization
* Product management
* Hierarchical categories
* Inventory management
* Order management
* Payment abstraction using Strategy Pattern
* Redis caching
* Transactional stock updates

---

# Authentication

## Authorization Header

Protected routes require:

```
Authorization: Bearer <access_token>
```

Example:

```http
GET /api/v1/products
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

# Standard Response

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

---

# Authentication Module

Base URL:

```
/api/auth
```

---

# Register User

## POST `/api/auth/register`

Creates a new user account.

### Authentication

Public

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

# Login User

## POST `/api/auth/login`

Authenticates a user and returns tokens.

### Authentication

Public

### Request

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Response

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1Ni...",
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

Refresh token is stored securely as an HTTP-only cookie.

---

# Refresh Token

## POST `/api/auth/refresh`

Generates a new access token.

### Authentication

Refresh token cookie required.

### Request

No body.

### Response

```json
{
  "success": true,
  "message": "Token refreshed successfully.",
  "data": {
    "accessToken": "new_access_token"
  }
}
```

---

# Logout

## POST `/api/auth/logout`

Invalidates refresh token.

### Authentication

Required

### Headers

```
Authorization: Bearer <access_token>
```

### Response

```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

# Products Module

Base URL:

```
/api/v1/products
```

---

# Create Product

## POST `/api/v1/products`

Creates a new product.

### Authentication

Required

### Role

ADMIN / SUPER_ADMIN

### Request

```json
{
  "name": "Wireless Headphone",
  "description": "Noise cancelling headphone",
  "price": 120,
  "stock": 50,
  "categoryId": "cat_123"
}
```

### Response

```json
{
  "success": true,
  "message": "Product created successfully.",
  "data": {
    "id": "prod_123",
    "name": "Wireless Headphone",
    "price": 120,
    "stock": 50,
    "status": "ACTIVE"
  }
}
```

---

# Get Products

## GET `/api/v1/products`

Returns paginated products.

### Authentication

Public

### Query Parameters

| Parameter  | Type   | Example   |
| ---------- | ------ | --------- |
| page       | number | 1         |
| limit      | number | 20        |
| search     | string | headphone |
| sort       | string | price     |
| order      | string | asc       |
| categoryId | string | cat_123   |

### Example

```
GET /api/v1/products?page=1&limit=10&search=headphone
```

### Response

```json
{
  "success": true,
  "message": "Products retrieved successfully.",
  "data": {
    "items": [
      {
        "id": "prod_123",
        "name": "Wireless Headphone",
        "price": 120,
        "stock": 50
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100
    }
  }
}
```

Features:

* Pagination
* Search
* Sorting
* Redis caching
* Category filtering

---

# Get Product

## GET `/api/v1/products/{id}`

Retrieves a single product.

### Authentication

Public

### Example

```
GET /api/v1/products/prod_123
```

### Response

```json
{
  "success": true,
  "message": "Product retrieved successfully.",
  "data": {
    "id": "prod_123",
    "name": "Wireless Headphone",
    "price": 120,
    "stock": 50,
    "category": {
      "id": "cat_123",
      "name": "Electronics"
    }
  }
}
```

---

# Update Product

## PATCH `/api/v1/products/{id}`

Updates product information.

### Authentication

Required

### Role

ADMIN / SUPER_ADMIN

### Request

```json
{
  "price": 100,
  "stock": 80
}
```

### Response

```json
{
  "success": true,
  "message": "Product updated successfully.",
  "data": {
    "id": "prod_123",
    "price": 100,
    "stock": 80
  }
}
```

---

# Delete Product

## DELETE `/api/v1/products/{id}`

Deletes a product.

### Authentication

Required

### Role

ADMIN / SUPER_ADMIN

### Response

```json
{
  "success": true,
  "message": "Product deleted successfully."
}
```

---

# Categories Module

Base URL:

```
/api/v1/categories
```

---

# Create Category

## POST `/api/v1/categories`

Creates a category.

### Authentication

Required

### Role

ADMIN

### Request

```json
{
  "name": "Laptops",
  "parentId": "electronics_id"
}
```

### Response

```json
{
  "success": true,
  "message": "Category created successfully.",
  "data": {
    "id": "cat_123",
    "name": "Laptops"
  }
}
```

---

# Get Categories

## GET `/api/v1/categories`

Returns categories.

### Authentication

Public

### Response

```json
{
  "success": true,
  "message": "Categories retrieved successfully.",
  "data": [
    {
      "id": "cat_1",
      "name": "Electronics"
    },
    {
      "id": "cat_2",
      "name": "Fashion"
    }
  ]
}
```

---

# Get Category Tree

## GET `/api/v1/categories/tree`

Returns hierarchical category structure.

### Authentication

Public

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "electronics",
      "name": "Electronics",
      "children": [
        {
          "id": "laptops",
          "name": "Laptops",
          "children": []
        }
      ]
    }
  ]
}
```

Uses:

* Recursive hierarchy traversal
* DFS category tree generation

---

# Get Category

## GET `/api/v1/categories/{id}`

### Example

```
GET /api/v1/categories/cat_123
```

### Response

```json
{
  "success": true,
  "data": {
    "id": "cat_123",
    "name": "Electronics"
  }
}
```

---

# Update Category

## PATCH `/api/v1/categories/{id}`

### Authentication

ADMIN

### Request

```json
{
  "name": "Consumer Electronics"
}
```

### Response

```json
{
  "success": true,
  "message": "Category updated successfully."
}
```

---

# Delete Category

## DELETE `/api/v1/categories/{id}`

### Authentication

ADMIN

### Response

```json
{
  "success": true,
  "message": "Category deleted successfully."
}
```

---


# Orders Module

Base URL

```text
/api/v1/orders
```

---

## Create Order

### POST `/api/v1/orders`

Creates a new order.

### Authentication

Required

### Request

```json
{
  "items": [
    {
      "productId": "prod_001",
      "quantity": 2
    },
    {
      "productId": "prod_015",
      "quantity": 1
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Order created successfully.",
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-10001",
    "status": "PENDING",
    "total": 360,
    "items": [
      {
        "productId": "prod_001",
        "quantity": 2,
        "price": 120
      },
      {
        "productId": "prod_015",
        "quantity": 1,
        "price": 120
      }
    ]
  }
}
```

---

## Get Orders

### GET `/api/v1/orders`

Returns paginated orders.

### Authentication

Required

### Query Parameters

| Parameter | Example |
| --------- | ------- |
| page      | 1       |
| limit     | 10      |
| status    | PAID    |

### Example

```http
GET /api/v1/orders?page=1&limit=10
```

### Response

```json
{
  "success": true,
  "message": "Orders retrieved successfully.",
  "data": {
    "items": [
      {
        "id": "order_123",
        "orderNumber": "ORD-10001",
        "status": "PAID",
        "total": 360
      }
    ]
  }
}
```

---

## Get Order

### GET `/api/v1/orders/{orderId}`

### Authentication

Required

### Example

```http
GET /api/v1/orders/order_123
```

### Response

```json
{
  "success": true,
  "message": "Order retrieved successfully.",
  "data": {
    "id": "order_123",
    "orderNumber": "ORD-10001",
    "status": "PROCESSING",
    "total": 360,
    "items": [
      {
        "product": {
          "id": "prod_001",
          "name": "Wireless Headphone"
        },
        "quantity": 2,
        "price": 120
      }
    ]
  }
}
```

---

## Update Order Status

### PATCH `/api/v1/orders/{orderId}/status`

Updates an order status.

### Authentication

Required

### Role

ADMIN / SUPER_ADMIN

### Request

```json
{
  "status": "SHIPPED"
}
```

### Response

```json
{
  "success": true,
  "message": "Order status updated successfully."
}
```

---

## Cancel Order

### PATCH `/api/v1/orders/{orderId}/cancel`

Cancels an order.

### Authentication

Required

### Response

```json
{
  "success": true,
  "message": "Order cancelled successfully."
}
```

---

## Delete Order

### DELETE `/api/v1/orders/{orderId}`

### Authentication

ADMIN / SUPER_ADMIN

### Response

```json
{
  "success": true,
  "message": "Order deleted successfully."
}
```

---

# Payments Module ![bKash](https://img.shields.io/badge/bKash-E2136E?logoColor=white) ![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

Base URL

```text
/api/v1/payments
```

---

## Initiate Payment

### POST `/api/v1/payments`

Initiates payment for an order.

### Authentication

Required

### Request

```json
{
  "orderId": "order_123",
  "provider": "STRIPE",
  "amount": 360
}
```

### Response

```json
{
  "success": true,
  "message": "Payment initiated successfully.",
  "data": {
    "paymentUrl": "https://checkout.stripe.com/...",
    "transactionId": "pi_123456789"
  }
}
```

Supported providers include:

* Stripe
* SSLCommerz
* bKash
* Nagad
* Cash on Delivery

---

## Verify Payment

### POST `/api/v1/payments/verify`

Verifies a payment.

### Authentication

Required

### Request

```json
{
  "paymentId": "payment_123",
  "transactionId": "pi_123456789"
}
```

### Response

```json
{
  "success": true,
  "message": "Payment verified successfully."
}
```

---

## Refund Payment

### POST `/api/v1/payments/{paymentId}/refund`

Issues a refund.

### Authentication

Required

### Response

```json
{
  "success": true,
  "message": "Payment refunded successfully."
}
```

---

## Get Payment

### GET `/api/v1/payments/{paymentId}`

Returns payment information.

### Authentication

Required

### Response

```json
{
  "success": true,
  "message": "Payment retrieved successfully.",
  "data": {
    "id": "payment_123",
    "provider": "STRIPE",
    "status": "PAID",
    "amount": 360,
    "transactionId": "pi_123456789"
  }
}
```

---

## Update Payment Status

### PATCH `/api/v1/payments/{paymentId}/status`

Updates the payment status.

### Authentication

Required (Admin only recommended)

### Request

```json
{
  "status": "REFUNDED"
}
```

### Response

```json
{
  "success": true,
  "message": "Payment status updated successfully."
}
```

---

## Stripe Webhook ![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

### POST `/api/v1/payments/webhook/stripe`

Receives Stripe webhook events.

### Authentication

Not required.

Stripe request signature is verified.

### Example Event

```json
{
  "type": "checkout.session.completed"
}
```

### Response

```http
200 OK
```

---

## bKash Callback ![bKash](https://img.shields.io/badge/bKash-E2136E?logoColor=white)

### POST `/api/v1/payments/callback/bkash`

Processes the bKash payment callback.

### Authentication

Not required.

Provider verification is performed before processing.

### Request

```json
{
  "paymentID": "BK123456789",
  "status": "success"
}
```

### Response

```json
{
  "success": true,
  "message": "bKash callback processed successfully."
}
```

---

# Notes

### Caching

The following endpoints are optimized with Redis caching:

* `GET /products`
* `GET /products/{id}`
* `GET /categories`
* `GET /orders/{id}` *(if enabled)*

Cache entries are invalidated after create, update, or delete operations.

### Payments

The payment module follows the **Strategy Pattern**, allowing providers to be swapped without changing application logic.

Webhook and callback processing:

* Verifies provider signatures
* Validates transaction details
* Ensures idempotent processing
* Marks payment status
* Completes the associated order
* Triggers transactional stock reduction

### Order Processing

Order completion is performed inside a database transaction to guarantee atomic stock updates and maintain inventory consistency under concurrent requests.

This completes the API reference for all implemented modules in your assessment project.
