# ZARA MOBILES — Full-Stack Smartphone E-Commerce Platform

[![Java 21](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> A modern, production-grade full-stack e-commerce platform engineered specifically for smartphones, flagships, and mobile accessories. Features an ultra-responsive React customer storefront, physical store pickup or home delivery checkout, COD & Razorpay payment integration, and a comprehensive admin management console.

---

## 📱 Table of Contents
1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [Prerequisites](#-prerequisites)
4. [Project Structure](#-project-structure)
5. [Quick Start Guide](#-quick-start-guide)
   - [Database Setup](#1-database-setup)
   - [Backend Setup & Launch](#2-backend-setup--launch)
   - [Frontend Setup & Launch](#3-frontend-setup--launch)
6. [Default Demo Credentials](#-default-demo-credentials)
7. [Running Tests](#-running-tests)
8. [API Documentation & Swagger UI](#-api-documentation--swagger-ui)
9. [Physical Retail Stores](#-physical-retail-stores)

---

## 🌟 Key Features

### 🛒 Customer Storefront
- **Dynamic Catalog Browsing**: Filter by brands (Apple, Samsung, Google, OnePlus, Xiaomi), price ranges, specifications, and categories (Flagship 5G, Mid-Range, Budget, Foldables, Accessories).
- **Search & Sort**: Instant live keyword search, sorting by price (low-to-high, high-to-low), newest arrivals, and customer rating.
- **Product Details & Gallery**: High-resolution image galleries, dynamic variant selection (Storage & Color), real-time stock availability, and verified customer reviews.
- **Shopping Cart & Wishlist**: Persistent cart, atomic inventory verification, and one-click wishlist toggling with sync across sessions.
- **Dual Checkout Workflows**:
  - **Home Delivery**: Multi-address management (Home, Work, Other) with PIN code routing.
  - **Store Pickup**: Reserve for same-day in-person pickup at any of the 4 physical retail branches.
- **Payment Options**:
  - **Cash on Delivery (COD)** with server-side validation.
  - **Razorpay Payment Gateway (Test Mode)** with client-side modal and cryptographic HMAC-SHA256 signature verification.
- **Customer Account Portal**: Order history with status tracking badges (`PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`), order cancellation with automated inventory restoration, address book CRUD, and password management.

### 🛡️ Admin Control Center
- **Real-Time Analytics Dashboard**: Live metrics for Total Revenue, Total Orders, Active Customers, Low Stock Alerts, and Orders by Status distribution.
- **Product Management**: Full CRUD operations for products, technical specifications JSON, dynamic variant options, and multi-image galleries.
- **Category Management**: Create, update, toggle active states, and manage smartphone categories.
- **Order Processing**: Transition order states through the fulfillment lifecycle with automated inventory adjustments upon cancellation.
- **Customer Administration**: View customer list and toggle active account status.
- **Warehouse Inventory & Audit Trail**: Real-time stock monitor, manual stock adjustments (Intake, Defect write-off, Correction), and complete immutable audit transaction history.

---

## 💻 Technology Stack

### Backend
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.3.4
- **Security**: Spring Security 6.3 + JJWT (Stateless JWT token authentication, BCrypt password hashing)
- **Data Access**: Spring Data JPA & Hibernate 6.5
- **Database**: MySQL 8.0 on port 3306 with HikariCP Connection Pool
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Min`, etc.)
- **Payment Gateway**: Razorpay Java SDK 1.4.3
- **Documentation**: SpringDoc OpenAPI 2.6.0 & Swagger UI 5.x

### Frontend
- **Framework**: React 18.3 (Single Page Application)
- **Build Tool**: Vite 5.4 with Hot Module Replacement (HMR)
- **Styling**: Tailwind CSS 3.4 with custom glassmorphism and smartphone-optimized layouts
- **Routing**: React Router DOM v6 with role-protected route guards
- **HTTP Client**: Axios 1.7 with automated JWT bearer token interceptors
- **Icons**: Lucide React

---

## 📋 Prerequisites

Before running the project, verify that the following tools are installed:

- **Java**: Java Development Kit (JDK) 21 LTS (`java -version`)
- **Maven**: Maven 3.9+ (`mvn -version`) *(A `mvn.bat` wrapper pointing to Maven 3.9 is included in the project root)*
- **Node.js**: Node.js 18.x or 20.x and npm 9+ (`node -v`, `npm -v`)
- **MySQL Server**: MySQL Community Server 8.0 (`mysql --version`) running on `localhost:3306`

---

## 📁 Project Structure

```text
zara-mobiles/
├── backend/                             # Spring Boot 3.3.4 Application
│   ├── pom.xml                          # Maven build configuration
│   ├── .env.example                     # Environment template
│   └── src/
│       ├── main/
│       │   ├── java/com/zara/mobiles/
│       │   │   ├── config/              # SecurityConfig, OpenApiConfig, DataInitializer
│       │   │   ├── controller/          # 11 REST Controllers
│       │   │   ├── dto/                 # Request & Response Data Transfer Objects
│       │   │   ├── entity/              # 16 JPA Entity classes
│       │   │   ├── exception/           # Global exception handler & custom exceptions
│       │   │   ├── repository/          # 16 Spring Data JPA Repositories
│       │   │   ├── security/            # JWT Token Provider, Auth Filter & UserDetails
│       │   │   └── service/             # Business logic interfaces & implementations
│       │   └── resources/
│       │       └── application.properties # Server, database & security configuration
│       └── test/                        # 13 Automated JUnit 5 & Mockito test cases
├── frontend/                            # React 18 + Vite SPA
│   ├── index.html                       # HTML entry point with Razorpay Checkout script
│   ├── package.json                     # Frontend dependencies
│   ├── tailwind.config.js               # Tailwind design system configuration
│   ├── vite.config.js                   # Vite configuration
│   └── src/
│       ├── components/                  # Navbar, Footer, ProductCard, Loading, ProtectedRoute
│       ├── context/                     # AuthContext, CartContext
│       ├── pages/                       # Storefront pages (Home, Products, Details, Cart, Checkout, etc.)
│       │   └── admin/                   # Admin pages (Dashboard, Products, Orders, Inventory, etc.)
│       └── services/                    # Axios API client modules
├── database/                            # Database Initialization
│   ├── schema.sql                       # 16 relational tables with indexes and constraints
│   └── sample-data.sql                  # Seed data with categories, flagships, and stores
├── documentation/                       # Architecture & API reference
│   ├── API_DOCUMENTATION.md             # Complete REST API specification
│   └── ARCHITECTURE.md                  # System design, state machine, and data flow
├── mvn.bat                              # Maven local wrapper script
└── README.md                            # Main project manual
```

---

## 🚀 Quick Start Guide

### 🐳 1-Command Deployment with Docker Compose
If you have Docker installed, you can launch MySQL 8, Spring Boot Backend, and React Frontend with a single command:
```bash
docker compose up -d --build
```
- Storefront: `http://localhost`
- Backend API & Swagger: `http://localhost:8080/api/swagger-ui/index.html`
- Full deployment instructions: See [DEPLOYMENT_GUIDE.md](file:///d:/files/Desktop/zara%20mobiles/documentation/DEPLOYMENT_GUIDE.md)

---

### Manual Local Setup Guide

### 1. Database Setup

Ensure MySQL Server 8.0 is running on port 3306. Execute the database scripts using the MySQL command line client or MySQL Workbench:

```bash
# Log in to MySQL
mysql -u root -p

# Run schema and seed scripts
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample-data.sql
```

*Note: Default database is configured for `zara_mobiles_db` with user `root` and password `root`.*

### 2. Backend Setup & Launch

1. Open a terminal in the `backend/` directory (or use the root `mvn.bat` wrapper):
   ```powershell
   cd backend
   ```
2. Verify or update `src/main/resources/application.properties` if your MySQL username or password differs:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/zara_mobiles_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
3. Run the Spring Boot application:
   ```powershell
   # Using local wrapper from root:
   ..\mvn.bat spring-boot:run

   # Or using standard maven:
   mvn spring-boot:run
   ```
   The backend will start and bind to `http://localhost:8080/api`.

### 3. Frontend Setup & Launch

1. Open a new terminal in the `frontend/` directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies (already installed during project creation):
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🔑 Default Demo Credentials

For rapid testing and evaluation, both customer and administrator accounts are pre-seeded in the database:

| Role | Email Address | Password | Permissions |
|------|---------------|----------|-------------|
| **Administrator** | `admin@zaramobiles.com` | `Admin@123` | Full access to Admin Dashboard, Analytics, Catalog CRUD, Order Transitions, and Inventory adjustments |
| **Demo Customer** | `customer@zaramobiles.com` | `Customer@123` | Storefront browsing, Cart, Wishlist, Order placement (COD/Razorpay), and Address Book |

> 💡 **Quick Login**: The Login page features 1-click **Demo Customer** and **Demo Admin** fill buttons for instant authentication.

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
The backend contains 13 JUnit 5 & Mockito test cases validating authentication, product catalog operations, cart recalculations, transactional order stock deductions, and Razorpay signature verifications:

```powershell
# Run from repository root
.\mvn.bat -f backend/pom.xml test
```
*Expected Output: `Tests run: 13, Failures: 0, Errors: 0, Skipped: 0 — BUILD SUCCESS`*

### Frontend Production Build
Validate that all React JSX components, styles, and routes compile cleanly:

```powershell
cd frontend
npm run build
```
*Expected Output: `built in ~1.5s (1,659 modules transformed) with 0 errors`.*

---

## 📖 API Documentation & Swagger UI

Interactive OpenAPI 3.0 / Swagger UI documentation is bundled with the backend:

- **Swagger UI Interactive Explorer**: [http://localhost:8080/api/swagger-ui/index.html](http://localhost:8080/api/swagger-ui/index.html)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:8080/api/v3/api-docs](http://localhost:8080/api/v3/api-docs)
- **Markdown Specification**: See [API_DOCUMENTATION.md](file:///d:/files/Desktop/zara%20mobiles/documentation/API_DOCUMENTATION.md)

---

## 🏬 Physical Retail Stores

Customers can select **Physical Store Pickup** at checkout to collect online purchases from any of our flagship branches:

1. **ZARA MOBILES Flagship Store — Indiranagar**  
   *Address*: 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038  
   *Phone*: +91 80 4123 4567 | *Hours*: Mon - Sun: 10:00 AM - 09:30 PM
2. **ZARA MOBILES Experience Store — Bandra West**  
   *Address*: Linking Road, Near Khar Telephone Exchange, Bandra West, Mumbai, Maharashtra 400052  
   *Phone*: +91 22 2640 1234 | *Hours*: Mon - Sun: 10:30 AM - 10:00 PM
3. **ZARA MOBILES Boutique — Connaught Place**  
   *Address*: Block B, Inner Circle, Connaught Place, New Delhi, Delhi 110001  
   *Phone*: +91 11 2341 5678 | *Hours*: Mon - Sun: 10:00 AM - 09:00 PM
4. **ZARA MOBILES Store — T. Nagar**  
   *Address*: Usman Road, Near Panagal Park, T. Nagar, Chennai, Tamil Nadu 600017  
   *Phone*: +91 44 2434 9876 | *Hours*: Mon - Sun: 09:30 AM - 09:30 PM

---

## 🔒 Security & Payment Verification Note
- **Monetary Accuracy**: All monetary calculations in `OrderServiceImpl` recalculate unit prices and discounts server-side directly from the database entity, strictly ignoring any client-provided price inputs.
- **Stock Reservation**: Inventory updates take place inside `@Transactional` database locks, preventing overselling.
- **Signature Integrity**: Razorpay payment verification uses HMAC SHA-256 algorithm: `hmac_sha256(order_id + "|" + payment_id, secret)`.

---

© 2026 ZARA MOBILES Ltd. All rights reserved.
