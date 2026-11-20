# ZARA MOBILES — REST API Documentation

**Application Name**: ZARA MOBILES — Smartphone E-Commerce Platform  
**Backend Framework**: Spring Boot 3.3.4 (Java 21 LTS)  
**Base URL**: `http://localhost:8080/api`  
**Interactive API Explorer (Swagger UI)**: `http://localhost:8080/api/swagger-ui/index.html`  
**OpenAPI Specification JSON**: `http://localhost:8080/api/v3/api-docs`  
**Version**: 1.0.0

---

## 1. Authentication & Security Architecture

The ZARA MOBILES API uses **stateless JSON Web Tokens (JWT)** for authentication.

- When a client logs in via `POST /api/auth/login` or registers via `POST /api/auth/register`, the server responds with a signed JWT token valid for 24 hours.
- Clients must attach this token in the HTTP request headers for all protected endpoints:
  ```http
  Authorization: Bearer <jwt-token-string>
  ```
- Passwords are encrypted using **BCrypt** (strength 10).
- Role-based access control enforces two standard roles: `ROLE_CUSTOMER` and `ROLE_ADMIN`.
- Cross-Origin Resource Sharing (CORS) is pre-configured to accept requests from `http://localhost:5173` with credentials, standard headers, and methods (`GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`).

---

## 2. Standard Response Envelope

All API endpoints return responses encapsulated in a standardized `ApiResponse<T>` wrapper:

### Standard Success Response:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "errors": null,
  "timestamp": "2026-11-19T10:15:30.123"
}
```

### Standard Error Response:
```json
{
  "success": false,
  "message": "Resource not found or validation failure",
  "data": null,
  "errors": {
    "field": "Validation error message"
  },
  "timestamp": "2026-11-19T10:15:30.123"
}
```

### Paginated Response (`PagedResponse<T>`):
```json
{
  "content": [ ... ],
  "pageNumber": 0,
  "pageSize": 12,
  "totalElements": 48,
  "totalPages": 4,
  "last": false
}
```

---

## 3. Authentication Endpoints (`/api/auth`)

### 3.1 Register New Customer
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "fullName": "Aarav Sharma",
    "email": "aarav.sharma@example.com",
    "password": "Password@123",
    "phone": "+91 9876543210"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzUxMiJ9...",
      "type": "Bearer",
      "id": 5,
      "email": "aarav.sharma@example.com",
      "fullName": "Aarav Sharma",
      "role": "ROLE_CUSTOMER"
    }
  }
  ```

### 3.2 User Login
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "customer@zaramobiles.com",
    "password": "Customer@123"
  }
  ```
- **Response**: `200 OK` (Returns JWT token and user profile)

### 3.3 Get Current User Profile
- **Endpoint**: `GET /api/auth/profile`
- **Access**: Authenticated (`ROLE_CUSTOMER` or `ROLE_ADMIN`)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "fullName": "Demo Customer",
      "email": "customer@zaramobiles.com",
      "phone": "+91 9876543211",
      "role": "ROLE_CUSTOMER",
      "active": true,
      "createdAt": "2026-11-19T00:00:00"
    }
  }
  ```

### 3.4 Change Password
- **Endpoint**: `POST /api/auth/change-password`
- **Access**: Authenticated
- **Request Body**:
  ```json
  {
    "currentPassword": "Customer@123",
    "newPassword": "NewStrongPassword@123"
  }
  ```
- **Response**: `200 OK`

---

## 4. Product Catalog Endpoints (`/api/products`)

### 4.1 Search & Filter Products (Paginated)
- **Endpoint**: `GET /api/products`
- **Access**: Public
- **Query Parameters**:
  - `page` (optional, default: `0`): Page number (0-indexed)
  - `size` (optional, default: `12`): Items per page
  - `sortBy` (optional, default: `createdAt`): Sorting field (`price`, `createdAt`, `name`, `rating`)
  - `sortDir` (optional, default: `desc`): `asc` or `desc`
  - `search` (optional): Keyword search matching brand, model, title, or description
  - `brand` (optional): Filter by brand name (e.g., `Apple`, `Samsung`, `OnePlus`, `Google`)
  - `categoryId` (optional): Filter by category ID
  - `minPrice` (optional): Minimum selling price filter
  - `maxPrice` (optional): Maximum selling price filter
- **Response**: `200 OK` with `PagedResponse<ProductResponse>`

### 4.2 Get Product by ID
- **Endpoint**: `GET /api/products/{id}`
- **Access**: Public
- **Response**: `200 OK` containing full product details, technical specifications JSON, images list, and variants list.

### 4.3 Get Product by Slug
- **Endpoint**: `GET /api/products/slug/{slug}`
- **Access**: Public
- **Example**: `GET /api/products/slug/apple-iphone-16-pro-max-256gb`
- **Response**: `200 OK`

### 4.4 Get Featured Products
- **Endpoint**: `GET /api/products/featured`
- **Access**: Public
- **Response**: `200 OK` (List of active products marked `is_featured = true`)

### 4.5 Get Latest Products
- **Endpoint**: `GET /api/products/latest?limit=8`
- **Access**: Public
- **Response**: `200 OK`

### 4.6 Get Distinct Product Brands
- **Endpoint**: `GET /api/products/brands`
- **Access**: Public
- **Response**: `200 OK` with list of brand names (`["Apple", "Google", "OnePlus", "Samsung", "Xiaomi"]`)

---

## 5. Category Endpoints (`/api/categories`)

### 5.1 List All Active Categories
- **Endpoint**: `GET /api/categories`
- **Access**: Public
- **Response**: `200 OK` with list of categories (Flagship 5G, Mid-Range, Budget, Foldable, Gaming, Accessories)

### 5.2 Get Category by ID or Slug
- **Endpoint**: `GET /api/categories/{id}` or `GET /api/categories/slug/{slug}`
- **Access**: Public
- **Response**: `200 OK`

---

## 6. Review & Rating Endpoints (`/api/products/{productId}/reviews`)

### 6.1 Get Product Reviews (Paginated)
- **Endpoint**: `GET /api/products/{productId}/reviews?page=0&size=10`
- **Access**: Public
- **Response**: `200 OK` with list of approved reviews, author names, verified purchase badge, and dates.

### 6.2 Get Review Summary & Rating Distribution
- **Endpoint**: `GET /api/products/{productId}/reviews/summary`
- **Access**: Public
- **Response**: `200 OK`
  ```json
  {
    "averageRating": 4.8,
    "totalReviews": 42,
    "ratingDistribution": {
      "5": 35,
      "4": 5,
      "3": 2,
      "2": 0,
      "1": 0
    }
  }
  ```

### 6.3 Submit Product Review
- **Endpoint**: `POST /api/products/{productId}/reviews`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "rating": 5,
    "title": "Incredible camera and battery life!",
    "comment": "The A18 Pro chip is blazing fast and titanium frame feels ultra-light."
  }
  ```
- **Response**: `201 Created`

---

## 7. Shopping Cart Endpoints (`/api/cart`)

Cart operations are bound to the authenticated customer session.

### 7.1 Get Customer Cart
- **Endpoint**: `GET /api/cart`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK` with cart items, unit prices, subtotal, and total quantity.

### 7.2 Add Item to Cart
- **Endpoint**: `POST /api/cart/items`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "productId": 1,
    "variantId": 1,
    "quantity": 1
  }
  ```
- **Response**: `200 OK`

### 7.3 Update Cart Item Quantity
- **Endpoint**: `PUT /api/cart/items/{itemId}`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Response**: `200 OK`

### 7.4 Remove Item from Cart
- **Endpoint**: `DELETE /api/cart/items/{itemId}`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

### 7.5 Clear Entire Cart
- **Endpoint**: `DELETE /api/cart/clear`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

---

## 8. Wishlist Endpoints (`/api/wishlist`)

### 8.1 Get Customer Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

### 8.2 Toggle Wishlist Item (Add/Remove)
- **Endpoint**: `POST /api/wishlist/toggle/{productId}`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK` (Returns updated boolean wishlist state)

### 8.3 Check Product in Wishlist
- **Endpoint**: `GET /api/wishlist/check/{productId}`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK` (`data: true/false`)

---

## 9. Customer Address Book (`/api/addresses`)

### 9.1 List Customer Addresses
- **Endpoint**: `GET /api/addresses`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

### 9.2 Add New Address
- **Endpoint**: `POST /api/addresses`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "fullName": "Demo Customer",
    "phone": "+91 9876543210",
    "street": "100 Feet Road, Indiranagar",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560038",
    "country": "India",
    "addressType": "Home",
    "isDefault": true
  }
  ```
- **Response**: `201 Created`

### 9.3 Set Default Address
- **Endpoint**: `PUT /api/addresses/{id}/default`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

### 9.4 Delete Address
- **Endpoint**: `DELETE /api/addresses/{id}`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

---

## 10. Physical Stores (`/api/stores`)

### 10.1 List Retail Stores for Pickup
- **Endpoint**: `GET /api/stores`
- **Access**: Public
- **Response**: `200 OK` (Returns 4 official retail branches across Bengaluru, Mumbai, Delhi, and Chennai with full addresses, contact phones, and operating hours).

---

## 11. Order Processing Endpoints (`/api/orders`)

All checkout requests are validated on the server. Product prices and discounts are queried directly from the database and stock is deducted atomically inside a transactional boundary.

### 11.1 Create Order
- **Endpoint**: `POST /api/orders`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body (Home Delivery + Cash on Delivery)**:
  ```json
  {
    "deliveryType": "HOME_DELIVERY",
    "shippingAddressId": 1,
    "paymentMethod": "CASH_ON_DELIVERY",
    "customerNotes": "Please ring the bell upon arrival."
  }
  ```
- **Request Body (Store Pickup + Online Payment)**:
  ```json
  {
    "deliveryType": "STORE_PICKUP",
    "pickupStoreId": 1,
    "paymentMethod": "RAZORPAY"
  }
  ```
- **Response**: `201 Created` with full order snapshot, order number (e.g. `ZM-20261119-9821`), item breakdown, tax, and delivery fee.

### 11.2 Get Customer Order History (Paginated)
- **Endpoint**: `GET /api/orders?page=0&size=10`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Response**: `200 OK`

### 11.3 Get Order Details by ID
- **Endpoint**: `GET /api/orders/{id}`
- **Access**: Authenticated (Customer must own order, or Admin)
- **Response**: `200 OK`

### 11.4 Cancel Order
- **Endpoint**: `POST /api/orders/{id}/cancel`
- **Access**: Authenticated (Owner or Admin)
- **Rules**: Orders can be canceled if current status is `PENDING` or `CONFIRMED`. Stock is automatically restored to warehouse inventory upon cancellation.
- **Response**: `200 OK`

---

## 12. Payment Endpoints (`/api/payments`)

### 12.1 Initialize Razorpay Order
- **Endpoint**: `POST /api/payments/razorpay/create-order`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "orderId": 12
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "razorpayOrderId": "order_EK3uIjF812Xz",
      "amount": 14499900,
      "currency": "INR",
      "keyId": "rzp_test_YourKeyId"
    }
  }
  ```

### 12.2 Verify Razorpay Payment Signature
- **Endpoint**: `POST /api/payments/razorpay/verify`
- **Access**: Authenticated (`ROLE_CUSTOMER`)
- **Request Body**:
  ```json
  {
    "orderId": 12,
    "razorpayPaymentId": "pay_EK3uZ17x91Jz",
    "razorpayOrderId": "order_EK3uIjF812Xz",
    "razorpaySignature": "4a7f0580bc..."
  }
  ```
- **Response**: `200 OK` (Validates HMAC SHA-256 signature, sets Payment status to `COMPLETED`, transitions order status to `PAID`).

---

## 13. Admin Management Endpoints (`/api/admin`)

All `/api/admin/**` routes strictly require the `ROLE_ADMIN` authority.

### 13.1 Admin Dashboard Analytics
- **Endpoint**: `GET /api/admin/dashboard`
- **Access**: Admin only
- **Response**: `200 OK`
  ```json
  {
    "totalRevenue": 2845000.00,
    "totalOrders": 124,
    "totalCustomers": 89,
    "totalProducts": 10,
    "lowStockCount": 2,
    "recentOrders": [ ... ],
    "ordersByStatus": {
      "PENDING": 4,
      "CONFIRMED": 12,
      "SHIPPED": 20,
      "DELIVERED": 85,
      "CANCELLED": 3
    }
  }
  ```

### 13.2 Product CRUD
- **Create Product**: `POST /api/admin/products`
- **Update Product**: `PUT /api/admin/products/{id}`
- **Delete Product**: `DELETE /api/admin/products/{id}`

### 13.3 Category CRUD
- **Create Category**: `POST /api/admin/categories`
- **Update Category**: `PUT /api/admin/categories/{id}`
- **Delete Category**: `DELETE /api/admin/categories/{id}`

### 13.4 Order Management
- **List All Orders (Filtered/Paginated)**: `GET /api/admin/orders?page=0&size=20&status=PENDING`
- **Update Order Status**: `PUT /api/admin/orders/{id}/status`
  - Valid transitions: `PENDING` -> `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED` or `CANCELLED`.
  - If transitioned to `CANCELLED`, inventory is restored automatically.

### 13.5 Customer Management
- **List All Customers**: `GET /api/admin/customers?page=0&size=20&search=sharma`
- **Toggle Customer Status**: `PUT /api/admin/customers/{id}/status?active=false`

### 13.6 Inventory Management & Audit Logs
- **Get Inventory Status**: `GET /api/admin/inventory?lowStockOnly=false`
- **Adjust Product Stock**: `POST /api/admin/inventory/adjust`
  ```json
  {
    "productId": 1,
    "quantityChange": 25,
    "transactionType": "PURCHASE",
    "referenceNumber": "PO-2026-11-098",
    "notes": "Direct shipment from Apple authorized distributor"
  }
  ```
- **Get Inventory Audit Log**: `GET /api/admin/inventory/transactions?productId=1`

---

## 14. HTTP Status Codes & Error Mapping

| HTTP Code | Error Name | Description |
|-----------|------------|-------------|
| `200 OK` | OK | Successful operation |
| `201 Created` | Created | Resource successfully created |
| `400 Bad Request` | `BadRequestException` | Validation error, insufficient stock, invalid transition |
| `401 Unauthorized` | `UnauthorizedException` | Missing, malformed, or expired JWT token |
| `403 Forbidden` | Access Denied | User does not possess `ROLE_ADMIN` for admin endpoints |
| `404 Not Found` | `ResourceNotFoundException` | Product, category, order, or user ID does not exist |
| `409 Conflict` | Conflict | Duplicate email registration or unique constraint violation |
| `500 Server Error` | Internal Server Error | Unexpected server-side exception |
