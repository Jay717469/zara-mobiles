# ZARA MOBILES — System Architecture & Design Specification

**Application**: ZARA MOBILES — Full-Stack Smartphone E-Commerce Platform  
**Architecture Pattern**: Multi-Tier Client-Server Architecture with Stateless RESTful Services  
**Version**: 1.0.0  
**Date**: 19 November 2026

---

## 1. Architectural Overview

ZARA MOBILES is built as an enterprise-grade, decoupled web application. The frontend is a responsive Single Page Application (SPA) powered by React.js and Vite, while the backend is an enterprise Java Spring Boot 3.3.4 micro-monolith providing secure, transactional REST APIs backed by MySQL 8.

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Tier (Browser)                    │
│   React 18 SPA + Vite + Tailwind CSS + Lucide Icons + Axios  │
│      - Customer Storefront (Catalog, Cart, Checkout)        │
│      - Admin Control Center (Analytics, Inventory, Orders)   │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / HTTPS (REST + JSON)
                               │ CORS Preflight & JWT Bearer
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Tier (Spring Boot 3.3.4)     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                Security & Filter Chain                │  │
│  │     JwtAuthenticationFilter | CorsFilter | SecurityConfig│
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │                   REST Controllers                    │  │
│  │  AuthController | ProductController | OrderController  │  │
│  │  CartController | PaymentController | AdminController  │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │           Service Layer (@Transactional)              │  │
│  │  - OrderServiceImpl (Atomic Stock Reservation)        │  │
│  │  - PaymentServiceImpl (HMAC-SHA256 Verification)      │  │
│  │  - InventoryServiceImpl (Audit Transaction Logging)   │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────▼───────────────────────────┐  │
│  │               Spring Data JPA Repositories            │  │
│  │       ProductRepository | OrderRepository | etc.       │  │
│  └───────────────────────────┬───────────────────────────┘  │
└──────────────────────────────┼──────────────────────────────┘
                               │ JDBC (HikariCP Connection Pool)
┌──────────────────────────────▼──────────────────────────────┐
│                    Persistence Tier (MySQL 8.0)             │
│            Database: zara_mobiles_db (16 Tables)            │
│  InnoDB Engine | Strict Foreign Keys | DECIMAL Currency     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack & Component Specifications

| Tier | Component | Technology & Version | Purpose |
|------|-----------|----------------------|---------|
| **Frontend** | Build Tool | Vite 5.x | Ultra-fast HMR and optimized asset bundling |
| | Framework | React 18.3 | Component-driven UI rendering |
| | Styling | Tailwind CSS 3.4 | Utility-first responsive design system |
| | Icons | Lucide React | Modern, consistent iconography |
| | Routing | React Router DOM v6 | Declarative client-side routing & route guards |
| | HTTP Client | Axios 1.7 | REST API communication with interceptors |
| **Backend** | Runtime | Java 21 LTS | High-performance modern Java runtime |
| | Framework | Spring Boot 3.3.4 | Micro-framework with auto-configuration |
| | Security | Spring Security 6.3 + JJWT | Stateless JWT authentication & authorization |
| | Data Access | Spring Data JPA / Hibernate 6.5 | Object-Relational Mapping & transactional semantics |
| | Validation | Hibernate Validator 8.0 | Jakarta Bean Validation for request payloads |
| | API Docs | SpringDoc OpenAPI 2.6 / Swagger UI | Interactive API exploration and testing |
| | Payments | Razorpay Java SDK 1.4.3 | Payment order generation and cryptographic verification |
| **Database** | RDBMS | MySQL 8.0 Community Server | ACID-compliant relational data storage on port 3306 |
| | Connection Pool | HikariCP | Low-latency high-throughput connection pooling |

---

## 3. Database Architecture & Schema Design

The persistence model comprises 16 normalized tables designed for high data integrity, strict referential constraints, and zero floating-point rounding errors on financial values.

### 3.1 Financial Calculation Standards
All prices, discounts, sub-totals, delivery charges, tax amounts, and grand totals are stored using:
```sql
DECIMAL(10, 2) NOT NULL DEFAULT 0.00
```
This guarantees exact precision for Indian Rupee (INR) transactions without floating-point inaccuracies.

### 3.2 Entity Relationship Map
```
               ┌───────────┐
               │   users   │◄──────────────┐
               └─────┬─────┘               │
                     │ 1                   │ 1
       ┌─────────────┼─────────────┐       │
       │ 1           │ 1           │ 1     │
 ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ │
 │ addresses │ │   carts   │ │ wishlists │ │
 └───────────┘ └─────┬─────┘ └─────┬─────┘ │
                     │ 1           │ 1     │
               ┌─────▼─────┐ ┌─────▼─────┐ │
               │cart_items │ │wishlist_  │ │
               └─────┬─────┘ │  items    │ │
                     │ *     └─────┬─────┘ │
                     │             │ *     │
               ┌─────▼─────────────▼─────┐ │
               │        products         │ │
               └───┬─────────┬─────────┬─┘ │
                 1 │       1 │       1 │   │
       ┌───────────┘         │         └──────────┐
       │ 1                   │ 1                  │ 1
 ┌─────▼──────────┐   ┌──────▼─────────┐   ┌──────▼─────────┐
 │ product_images │   │product_variants│   │    reviews     │
 └────────────────┘   └────────────────┘   └──────┬─────────┘
                                                  │ *
                                                  │
 ┌────────────────────────────────────────────────┼───────────┐
 │                                                │           │
 │ ┌───────────┐ 1       * ┌─────────────┐ *    1 │           │
 │ │  orders   ├──────────►│ order_items ├────────┘           │
 │ └─────┬─────┘           └─────────────┘                    │
 │       │ 1                                                  │
 │       ├─────────────────────────┐ 1                        │
 │       ▼ 1                       ▼                          │
 │ ┌───────────┐             ┌───────────┐                    │
 │ │ payments  │             │  stores   │ (Store Pickup)     │
 │ └───────────┘             └───────────┘                    │
 └────────────────────────────────────────────────────────────┘
```

---

## 4. Security & Authentication Architecture

### 4.1 Stateless JWT Filter Lifecycle
```
Client Request with "Authorization: Bearer <token>"
                        │
                        ▼
           [JwtAuthenticationFilter]
                        │
     Is Authorization header valid Bearer token?
           ├── No ──► Passes through anonymously (Public endpoints permitted)
           │
           └── Yes ─► Validate HMAC-SHA512 Signature & Expiration
                        │
                  Extract username / email
                        │
                  Load UserDetails via UserDetailsService
                        │
                  Set UsernamePasswordAuthenticationToken in SecurityContextHolder
                        │
                        ▼
             [Controller Handler Execution]
```

### 4.2 Role-Based Access Control (RBAC) Matrix

| Endpoint Path | Method | Allowed Roles | Description |
|---------------|--------|---------------|-------------|
| `/api/auth/login` | POST | Public | User authentication |
| `/api/auth/register` | POST | Public | New user sign-up |
| `/api/products/**` | GET | Public | Product browsing and search |
| `/api/categories/**` | GET | Public | Category listings |
| `/api/stores/**` | GET | Public | Retail store locations |
| `/api/cart/**` | ANY | `ROLE_CUSTOMER` | Customer cart modifications |
| `/api/wishlist/**` | ANY | `ROLE_CUSTOMER` | Customer wishlist operations |
| `/api/addresses/**` | ANY | `ROLE_CUSTOMER` | Customer address management |
| `/api/orders/**` | GET, POST | `ROLE_CUSTOMER`, `ROLE_ADMIN` | Order creation & viewing |
| `/api/payments/**` | POST | `ROLE_CUSTOMER` | Payment initialization & verification |
| `/api/admin/**` | ANY | `ROLE_ADMIN` | Full administrative control |

---

## 5. Order Creation & Inventory State Machine

### 5.1 Atomic Stock Deduction Principle
To prevent overselling when multiple concurrent users attempt to purchase low-stock inventory:
1. When `POST /api/orders` is invoked, Spring Boot opens a `@Transactional(isolation = Isolation.READ_COMMITTED)` boundary.
2. For every item in the cart:
   - The product record is locked and checked for `stockQuantity >= cartItem.quantity`.
   - If stock is insufficient, a `BadRequestException` is immediately thrown, triggering a rollback of all database modifications.
   - If stock is available, `product.stockQuantity` is decremented in memory.
   - An `InventoryTransaction` record of type `SALE` is inserted to preserve an immutable audit trail.
3. The cart is cleared, and the `Order` status is initialized to:
   - `PENDING` (for Cash on Delivery).
   - `PENDING` (for Razorpay payment, waiting for signature verification).

### 5.2 Order Lifecycle State Diagram
```
                     ┌──────────────────┐
                     │     PENDING      │
                     └────────┬─────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │ (Payment Conf.) │                 │ (Admin / Customer Cancel)
            ▼                 ▼                 ▼
     ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
     │    PAID     │   │  CONFIRMED  │   │  CANCELLED  │
     └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
            │                 │                 │
            └────────┬────────┘                 ▼
                     ▼                   [Stock Restored &
              ┌─────────────┐             Audit Logged]
              │ PROCESSING  │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │   SHIPPED   │
              └──────┬──────┘
                     │
                     ▼
              ┌─────────────┐
              │  DELIVERED  │
              └─────────────┘
```

---

## 6. Payment Gateway Integration Architecture

### 6.1 Cash on Delivery (COD) Flow
1. Customer selects **Cash on Delivery** on the checkout page.
2. The server verifies order eligibility, reserves stock, creates the order with `paymentMethod = CASH_ON_DELIVERY` and `paymentStatus = PENDING`.
3. Customer receives immediate order confirmation with the tracking number.

### 6.2 Razorpay Payment Flow (Test Mode)
```
  Customer UI                  Spring Boot Backend              Razorpay Gateway
       │                                │                              │
       ├─ Click "Pay with Razorpay" ───►│                              │
       │                                ├─ Create Order Request ──────►│
       │                                │◄── Returns order_id ─────────┤
       │◄── Returns rzp_order_id, key ──┤                              │
       │                                                               │
       ├─ Displays Razorpay Checkout Modal                             │
       ├─ Customer enters test card/UPI/Netbanking                     │
       ├─ Payment Processed Successfully                               │
       │                                                               │
       ├─ Sends paymentId, orderId, signature ────────────────────────►│
       │                                │                              │
       │                                ├─ Validates HMAC-SHA256:      │
       │                                │  sig == HmacSHA256(          │
       │                                │    rzp_order_id + "|" +      │
       │                                │    paymentId, secret)        │
       │                                │                              │
       │                                ├─ If Match:                   │
       │                                │  Update Payment: COMPLETED   │
       │                                │  Update Order: PAID          │
       │◄── Order Confirmed (200 OK) ───┤                              │
```

---

## 7. Frontend SPA Architecture & UI Modules

### 7.1 Component Structure
- **Global Contexts**:
  - `AuthContext`: Manages current user state, JWT tokens in `localStorage`, role detection (`isAdmin`, `isCustomer`), login, and logout.
  - `CartContext`: Manages client-side cart totals, badge counts, real-time sync with backend `/api/cart`, and wishlist toggling.
- **Interceptors (`src/services/api.js`)**:
  - Automatically attaches `Authorization: Bearer <token>` to outgoing requests.
  - Intercepts 401 Unauthorized responses to clear expired credentials and prompt re-login.
- **Responsive Layouts**:
  - `Navbar`: Sticky header with real-time live search input, category quick links, wishlist badge, cart item counter, user dropdown menu, and Admin link.
  - `Footer`: Official brand statement, direct links, physical store locations, customer service info, and payment trust badges.
  - `AdminLayout`: Sidebar navigation with route matching, real-time stock alert counters, and clean header breadcrumbs.

### 7.2 Routing Security
- `ProtectedRoute.jsx`: Verifies user authentication.
- Role Guard: If non-admin accesses `/admin/*`, they are redirected with an unauthorized warning.
