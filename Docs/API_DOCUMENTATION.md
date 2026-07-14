# API Documentation

> **Note:** This documentation was generated from the provided project structure, Prisma schema, and source archive. It is intended as a professional developer-facing API reference.

## Overview

This is a Node.js + Express + TypeScript REST API using Prisma ORM and PostgreSQL.

### Features

- JWT Authentication with refresh tokens
- Role-based authorization
- Product management
- Hierarchical categories
- Inventory management
- Order management
- Payment abstraction (Strategy pattern)
- Redis caching
- Transactional stock updates

## Authentication

Protected endpoints require:

```
Authorization: Bearer <access_token>
```

Refresh tokens are exchanged through the refresh endpoint.

## Standard Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Resources

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout

### Products
- POST /api/v1/products
- GET /api/v1/products
- GET /api/v1/products/{id}
- PATCH /api/v1/products/{id}
- DELETE /api/v1/products/{id}

Supports:
- Pagination
- Search
- Sorting
- Category hierarchy filtering
- Redis caching

### Categories
CRUD operations with recursive parent-child hierarchy.

### Orders
Order creation is transactional.
Stock reduction is performed atomically.

Order lifecycle:

PENDING → PAID → PROCESSING → SHIPPED → DELIVERED

Possible terminal states:

- CANCELLED
- REFUNDED

### Payments

Designed around the Strategy Pattern allowing providers such as:

- Stripe
- SSLCommerz
- bKash
- Nagad
- Cash on Delivery

Webhook processing should:

- Verify provider signature
- Validate payment amount
- Ensure idempotency
- Update payment
- Update order

## Caching

Products and product details are cached in Redis.

Cache invalidation should occur after mutations.

## Status Codes

|Code|Meaning|
|---|---|
|200|Success|
|201|Created|
|204|Deleted|
|400|Validation Error|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|500|Internal Server Error|

## Enums

### Roles

- USER
- ADMIN
- SUPER_ADMIN

### Product Status

- ACTIVE
- DRAFT
- OUT_OF_STOCK
- ARCHIVED

### Order Status

- PENDING
- PAID
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
- REFUNDED

### Payment Status

- PENDING
- PAID
- FAILED
- REFUNDED

## Architecture

Repository → Service → Controller

Database access uses Prisma.

Redis is used for read optimization.

Payments use Strategy Pattern.

Category traversal uses DFS.

Stock updates occur inside database transactions.

---

This document serves as the base API reference. It can be expanded into a complete OpenAPI/Swagger specification.
