# RacoAI Backend Assessment

> **A production-oriented E-commerce REST API built with Node.js,
> Express.js, TypeScript, Prisma ORM, PostgreSQL, and Redis.**

Developed as part of the **RacoAI Backend Engineer Assessment**, this
project demonstrates a scalable backend architecture featuring JWT
authentication, role-based authorization, Redis caching, hierarchical
categories, transactional order processing, inventory management, and
Depth-First Search (DFS) based category filtering.

------------------------------------------------------------------------

# Table of Contents

-   Overview
-   Features
-   Technology Stack
-   Architecture
-   Project Structure
-   Category Hierarchy
-   DFS Category Filtering
-   Order Processing
-   Redis Cache Flow
-   API Overview
-   RBAC
-   Getting Started
-   Environment Variables
-   Scripts
-   Design Patterns
-   Key Design Decisions
-   Future Improvements

------------------------------------------------------------------------

# Overview

The application follows a layered architecture that separates
responsibilities across Controllers, Services, and Repositories.

Core features include:

-   JWT Authentication
-   Role-Based Access Control (RBAC)
-   Product & Category Management
-   Hierarchical Categories
-   DFS Category Filtering
-   Redis Cache-Aside Strategy
-   Transactional Order Processing
-   Automatic Inventory Updates
-   Pagination, Search & Sorting

------------------------------------------------------------------------

# Features

## Authentication

-   JWT Access & Refresh Tokens
-   HTTP-only Cookies
-   Password Hashing (bcrypt)
-   Role-Based Authorization

## Product Management

-   CRUD Products
-   SKU Generation
-   Search
-   Pagination
-   Sorting
-   Filtering
-   Redis Caching

## Category Management

-   CRUD Categories
-   Unlimited Nested Categories
-   Self-referencing Hierarchy
-   Category Tree Endpoint

## Order Management

-   Create Orders
-   Multiple Order Items
-   Order Number Generation
-   Stock Validation
-   Automatic Stock Reduction
-   Order Status Updates
-   Order Cancellation
-   Inventory Restoration
-   Prisma Transactions

## Redis Caching

-   Product Lists
-   Product Details
-   Category Tree
-   Order Lists
-   Order Details

------------------------------------------------------------------------

# Technology Stack

  Technology   Purpose
  ------------ ------------------
  Node.js      Runtime
  Express.js   REST API
  TypeScript   Type Safety
  PostgreSQL   Database
  Prisma ORM   ORM
  Redis        Cache
  JWT          Authentication
  bcrypt       Password Hashing

------------------------------------------------------------------------

# Architecture

``` mermaid
flowchart TD
Client --> Router
Router --> Controller
Controller --> Service
Service --> Repository
Repository --> Prisma
Prisma --> PostgreSQL[(PostgreSQL)]
Service --> Redis[(Redis Cache)]
```

------------------------------------------------------------------------

# Project Structure

``` text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── prisma/
├── generated/
├── types/
├── utils/
└── server.ts
```

------------------------------------------------------------------------

# Category Hierarchy

``` mermaid
graph TD
Electronics --> Laptop
Electronics --> Phone
Electronics --> Accessories
Laptop --> Gaming
Laptop --> Business
Laptop --> Ultrabook
```

------------------------------------------------------------------------

# DFS Category Filtering

``` mermaid
flowchart LR
A["GET /products?category=laptop"]
--> B["CategoryService.getDescendantIds()"]
--> C["Depth-First Search"]
--> D["Collect Descendant IDs"]
--> E["ProductRepository.findProducts()"]
--> F["SQL: WHERE categoryId IN (...)"]
--> G["Products Returned"]
```

------------------------------------------------------------------------

# Order Processing

``` mermaid
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

------------------------------------------------------------------------

# Redis Cache Flow

``` mermaid
flowchart TD
Request --> Cache{Redis}
Cache -->|Hit| Response
Cache -->|Miss| Database[(PostgreSQL)]
Database --> Store[Store in Redis]
Store --> Response
```

------------------------------------------------------------------------

# API Overview

## Authentication

-   POST /auth/register
-   POST /auth/login
-   POST /auth/logout
-   POST /auth/refresh

## Products

-   GET /products
-   GET /products/:id
-   POST /products
-   PATCH /products/:id
-   DELETE /products/:id

## Categories

-   GET /categories
-   GET /categories/tree
-   GET /categories/:id
-   POST /categories
-   PATCH /categories/:id
-   DELETE /categories/:id

## Orders

-   GET /orders
-   GET /orders/details?id=...
-   GET /orders/details?order_number=...
-   POST /orders
-   PATCH /orders/:id/status
-   PATCH /orders/:id/cancel
-   DELETE /orders/:id

------------------------------------------------------------------------

# RBAC

  Endpoint               User   Admin
  --------------------- ------ -------
  Create Order            ✅     ✅
  View Own Orders         ✅     ✅
  View All Orders         ❌     ✅
  Update Order Status     ❌     ✅
  Cancel Order            ✅     ✅
  Delete Order            ❌     ✅

------------------------------------------------------------------------

# Key Design Decisions

-   Layered Architecture
-   Repository Pattern
-   Service Pattern
-   Dependency Injection
-   DTO Pattern
-   Cache-Aside Pattern
-   Prisma Transactions for Order Processing
-   DFS traversal for hierarchical category filtering
-   Thin Controllers with centralized error handling

------------------------------------------------------------------------

# Environment Variables

``` env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
PORT=5000
NODE_ENV=development
```

------------------------------------------------------------------------

# Scripts

-   npm run dev
-   npm run build
-   npm start
-   npm run seed
-   prisma migrate dev
-   prisma generate

------------------------------------------------------------------------

# Future Improvements

-   Docker
-   CI/CD
-   Swagger/OpenAPI
-   Unit Testing
-   Integration Testing
-   Rate Limiting
-   Background Workers
-   Event-driven Architecture
-   Elasticsearch

------------------------------------------------------------------------

# License

Developed as part of the **RacoAI Backend Engineer Assessment**.
