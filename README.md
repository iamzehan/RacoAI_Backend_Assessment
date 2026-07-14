# RacoAI Backend Assessment

> **A production-oriented E-commerce REST API built with Node.js and Express**

<p align="left">

<img src="https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/bcrypt-Password%20Hashing-blue" />
<img src="https://img.shields.io/badge/REST-API-success" />
<img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Architecture-Layered-blueviolet" />
<img src="https://img.shields.io/badge/Pattern-Repository-orange" />
<img src="https://img.shields.io/badge/Pattern-Service-orange" />
<img src="https://img.shields.io/badge/Pattern-Strategy-orange" />
<img src="https://img.shields.io/badge/Cache-Redis-red" />
<img src="https://img.shields.io/badge/License-MIT-green" />

</p>

![Stars](https://img.shields.io/github/stars/iamzehan/RacoAI_Backend_Assessment?style=social) ![Forks](https://img.shields.io/github/forks/iamzehan/RacoAI_Backend_Assessment?style=social) ![Issues](https://img.shields.io/github/issues/iamzehan/RacoAI_Backend_Assessment) ![Last Commit](https://img.shields.io/github/last-commit/iamzehan/RacoAI_Backend_Assessment) ![Repo Size](https://img.shields.io/github/repo-size/iamzehan/RacoAI_Backend_Assessment) ![Top Language](https://img.shields.io/github/languages/top/iamzehan/RacoAI_Backend_Assessment)

Developed as part of the **RacoAI Backend Engineer Assessment**, this
project demonstrates a scalable backend architecture featuring JWT
authentication, role-based authorization, Redis caching, hierarchical
categories, transactional order processing, inventory management, and
Depth-First Search (DFS) based category filtering.

---

# 🚀 Getting Started

Head Over to [Getting_Started.md](./Docs/Getting_Started.md) to learn how to setup this project in your local machine. 

# Table of Contents

| 📘 | 📑 |
|---|---|
| [Overview](#overview) | [API Overview](#api-overview) |
| [Features](#features) | [RBAC](#rbac) |
| [Technology Stack](#technology-stack) | [Webhook Processing](#webhook-processing) |
| [Architecture](#architecture) | [Environment Variables](#environment-variables) |
| [Project Structure](#project-structure) | [Scripts](#scripts) |
| [Category Hierarchy](#category-hierarchy) | [Key Design Decisions](#key-design-decisions) |
| [DFS Category Filtering](#dfs-category-filtering) | [License](#license) |
| [Order Processing](#order-processing) | |
| [Payment Architecture](#payment-architecture) | |
| [Payment Flow](#payment-flow) | |
| [Redis Cache Flow](#redis-cache-flow) | |
---

# Overview

The application follows a layered architecture that separates
responsibilities across Controllers, Services, and Repositories.

Core features include:

- JWT Authentication
- Role-Based Access Control (RBAC)
- Product & Category Management
- Hierarchical Categories
- DFS Category Filtering
- Redis Cache-Aside Strategy
- Transactional Order Processing
- Automatic Inventory Updates
- Pagination, Search & Sorting

---

# Features

## Authentication

- JWT Access & Refresh Tokens
- HTTP-only Cookies
- Password Hashing (bcrypt)
- Role-Based Authorization

## Product Management

- CRUD Products
- SKU Generation
- Search
- Pagination
- Sorting
- Filtering
- Redis Caching

## Category Management

- CRUD Categories
- Unlimited Nested Categories
- Self-referencing Hierarchy
- Category Tree Endpoint

## Order Management

- Create Orders
- Multiple Order Items
- Order Number Generation
- Stock Validation
- Automatic Stock Reduction
- Order Status Updates
- Order Cancellation
- Inventory Restoration
- Prisma Transactions

## Payment Management

- Strategy Pattern-based Payment Architecture
- Factory-based Payment Provider Resolution
- Multiple Payment Provider Support
  - Stripe
  - bKash
- Extensible Payment Gateway Integration
- Payment Initialization
- Secure Webhook Verification
- Idempotent Webhook Processing
- Payment Status Tracking
- Order & Payment Synchronization
- Provider-independent Payment Interface

## Redis Caching

- Product Lists
- Product Details
- Category Tree
- Order Lists
- Order Details

---

# Technology Stack

Technology Purpose

---

Node.js Runtime
Express.js REST API
TypeScript Type Safety
PostgreSQL Database
Prisma ORM ORM
Redis Cache
JWT Authentication
bcrypt Password Hashing

---

# Architecture

```mermaid
flowchart TD
Client --> Router
Router --> Controller
Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> PostgreSQL[(PostgreSQL)]
Service --> Redis[(Redis Cache)]
```

---

# Project Structure

```text
src/
├── config/          # Environment, Prisma & Session Configuration
├── controllers/     # HTTP Request Handlers
├── generated/       # Prisma Generated Client
│   └── prisma/
├── middlewares/     # Authentication & Error Handling
├── payments/        # Payment Strategies & Provider Factory
│   ├── providers/
│   ├── factory.ts
│
├── prisma/          # Schema & Migrations
│   └── migrations/
├── repositories/    # Database Access Layer
├── routes/          # API Routes
│   └── v1/
├── seeding/         # Database Seed Scripts
│   └── data/
├── services/        # Business Logic
├── types/           # TypeScript Definitions
├── utils/           # Helpers & Utilities
├── app.ts           # Express Application
└── server.ts        # Application Entry Point
```

---

# Category Hierarchy

```mermaid
graph TD
Electronics --> Laptop
Electronics --> Phone
Electronics --> Accessories
Laptop --> Gaming
Laptop --> Business
Laptop --> Ultrabook
```

---

# DFS Category Filtering

```mermaid
flowchart LR
A["GET /products?category=laptop"]
--> B["CategoryService.getDescendantIds()"]
--> C["Depth-First Search"]
--> D["Collect Descendant IDs"]
--> E["ProductRepository.findProducts()"]
--> F["SQL: WHERE categoryId IN (...)"]
--> G["Products Returned"]
```

---

# Order Processing

```mermaid
flowchart TD
A["Client Places Order"]
--> B["Validate Products"]
--> C["Check Stock"]
--> D["Begin Prisma Transaction"]
--> E["Create Order"]
--> F["Create Order Items"]
--> G["Decrease Stock"]
--> H["Commit Transaction"]
--> I["Return Order"]
```

Order creation executes inside a single Prisma transaction. If any
validation or inventory update fails, the transaction is rolled back
automatically.

---

# Payment Architecture

```mermaid

classDiagram

class PaymentStrategy{
<<interface>>
+createPayment()
+verifyWebhook()
}

class StripeStrategy
class SSLCommerzStrategy
class BKashStrategy
class NagadStrategy
class CODStrategy

PaymentStrategy <|.. StripeStrategy
PaymentStrategy <|.. SSLCommerzStrategy
PaymentStrategy <|.. BKashStrategy
PaymentStrategy <|.. NagadStrategy
PaymentStrategy <|.. CODStrategy

class PaymentFactory{
+resolve(provider)
}

PaymentFactory --> PaymentStrategy

```

# Payment Flow

```mermaid
flowchart TD

A["Client Places Order"]
--> B["Create Pending Order"]
--> C["Select Payment Provider"]
--> D["Payment Factory"]
--> E["Resolve Strategy"]
--> F["Initialize Payment"]
--> G["Redirect / Payment Gateway"]

G --> H["Gateway Webhook"]

H --> I["Verify Signature"]
I --> J["Validate Transaction"]
J --> K["Idempotency Check"]
K --> L["Update Payment"]
L --> M["Update Order Status"]
M --> N["Return Success"]
```

# Redis Cache Flow

```mermaid
flowchart TD
Request --> Cache{Redis}
Cache -->|Hit| Response
Cache -->|Miss| Database[(PostgreSQL)]
Database --> Store[Store in Redis]
Store --> Response
```

---

# API Overview

## Authentication

- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh

## Products

- GET /products
- GET /products/:id
- POST /products
- PATCH /products/:id
- DELETE /products/:id

## Categories

- GET /categories
- GET /categories/tree
- GET /categories/:id
- POST /categories
- PATCH /categories/:id
- DELETE /categories/:id

## Orders

- GET /orders
- GET /orders/details?id=...
- GET /orders/details?order_number=...
- POST /orders
- PATCH /orders/:id/status
- PATCH /orders/:id/cancel
- DELETE /orders/:id

## Payments

- POST /payments/initiate
- GET /payments/providers
- GET /payments/:paymentId
- POST /payments/webhook/:provider
- GET /payments/callback/:provider

# RBAC

Endpoint User Admin

---

Create Order ✅ ✅
View Own Orders ✅ ✅
View All Orders ❌ ✅
Update Order Status ❌ ✅
Cancel Order ✅ ✅
Delete Order ❌ ✅

---

## Webhook Processing

Every payment provider follows the same verification pipeline:

Verify the webhook signature provided by the payment gateway.
Validate the transaction amount and order information.
Perform an idempotency check to prevent duplicate processing.
Update the payment status.
Update the associated order.
Trigger any post-payment operations (inventory confirmation, notifications, etc.).

# Key Design Decisions

- Layered Architecture
- Repository Pattern
- Service Pattern
- Dependency Injection
- DTO Pattern
- Strategy Pattern for `Payment Providers`
- Factory Pattern for `Payment Resolution`
- Cache-Aside Pattern using `Redis`
- Prisma Transactions for `Order Processing`
- Idempotent Payment Webhook Processing
- DFS Traversal for Hierarchical `Category Filtering`
- Thin Controllers with Centralized Error Handling

---

# Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
# ==========================================
# Server
# ==========================================
PORT=3000
NODE_ENV=development

SERVER_URL=http://localhost:3000
CLIENT_URL=http://localhost:5000

# ==========================================
# Security
# ==========================================
SESSION_SECRET=your_session_secret
PASSWORD_HASH_SALT=12

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# ==========================================
# PostgreSQL
# ==========================================
# If PostgreSQL is running on your host machine (Docker development)
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=ecommerce
DATABASE_URL=postgresql://username:password@host.docker.internal:5433/ecommerce?schema=public

# If PostgreSQL is running in Docker, use:
# DATABASE_URL=postgresql://username:password@postgres:5432/ecommerce?schema=public

# ==========================================
# Redis
# ==========================================
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_URL=redis://redis:6379

# ==========================================
# Stripe
# ==========================================
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ==========================================
# BKash Sandbox
# ==========================================
BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_CALLBACK_URL=http://localhost:3000/api/v1/payments/bkash/callback
```

---

# Scripts

- `npm run dev` - run developement server
- `npm run build` - build
- `npm start` - start server
- `npx prisma db seed` - `seed data`
- `prisma migrate dev` - `prisma migrate`
- `prisma generate` - `generate schema`
- `prisma` - view prisma commands

---

# License

Developed as part of the **RacoAI Backend Engineer Assessment**.
