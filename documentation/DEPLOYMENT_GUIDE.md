# ZARA MOBILES — Production Deployment Guide

This guide provides complete instructions for deploying the **ZARA MOBILES** full-stack smartphone e-commerce platform across three standard deployment environments:

1. [Option 1: 1-Click Containerized Deployment (Docker & Docker Compose)](#option-1-docker--docker-compose)
2. [Option 2: Cloud PaaS Deployment (Vercel + Render/Railway + Managed MySQL)](#option-2-cloud-paas-deployment)
3. [Option 3: Traditional Linux VPS (Ubuntu 22.04 / 24.04 LTS + Nginx + SSL)](#option-3-linux-vps-deployment)
4. [Production Environment Variables Checklist](#production-environment-variables-checklist)
5. [SSL & Domain Setup](#ssl--domain-configuration)

---

## Architecture Components

Before deploying, ensure you understand the three decoupled tiers:

| Tier | Technology | Production Artifact | Port / Route |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 18 + Vite + Tailwind CSS | Static assets in `frontend/dist/` | `80` / `443` (Nginx/CDN) |
| **Backend** | Java 21 LTS + Spring Boot 3.3.4 | Executable JAR `backend/target/backend-1.0.0.jar` | `8080` (mounted at `/api`) |
| **Database** | MySQL 8.0 Server | Database schema `zara_mobiles_db` | `3306` |

---

## Option 1: Docker & Docker Compose

The easiest, most reliable way to deploy the entire platform on any server with Docker installed.

### Prerequisites
- Docker Engine 24+ and Docker Compose v2 (`docker --version`, `docker compose version`).

### Steps to Run

1. **Clone or transfer the project** to your server:
   ```bash
   cd "zara-mobiles"
   ```

2. **Launch all services**:
   ```bash
   docker compose up -d --build
   ```
   *Docker Compose will automatically:*
   - Boot MySQL 8.0 and initialize `schema.sql` and `sample-data.sql`.
   - Wait for MySQL to become healthy.
   - Build and start the Spring Boot 3.3.4 backend.
   - Build the React SPA and serve it via Nginx on port 80 with reverse proxy for `/api/`.

3. **Verify running containers**:
   ```bash
   docker compose ps
   ```

4. **Access the application**:
   - Storefront: `http://<your-server-ip>`
   - Swagger API Explorer: `http://<your-server-ip>/api/swagger-ui/index.html`

5. **Stop or Restart**:
   ```bash
   # Stop all services
   docker compose down

   # View live logs
   docker compose logs -f backend
   ```

---

## Option 2: Cloud PaaS Deployment

Ideal for cloud hosting with minimal server administration:

### Step 1: Deploy Database (Cloud MySQL)
Create a managed MySQL 8.0 instance on **Aiven**, **PlanetScale**, **Railway**, or **AWS RDS**:
1. Create a database named `zara_mobiles_db`.
2. Connect using MySQL Workbench or CLI and execute:
   - `database/schema.sql`
   - `database/sample-data.sql`
   - `database/seed-reference-products.sql`
3. Note your connection details: `HOST`, `PORT`, `USER`, `PASSWORD`.

### Step 2: Deploy Backend (Render / Railway / AWS Elastic Beanstalk)
Deploy `backend/` as a Java or Docker service:

- **Build Command**: `./mvnw clean package -DskipTests` (or use the included `backend/Dockerfile`)
- **Start Command**: `java -jar target/backend-1.0.0.jar`
- **Environment Variables**:
  ```env
  MYSQL_HOST=<your-cloud-db-host>
  MYSQL_PORT=3306
  MYSQL_DATABASE=zara_mobiles_db
  MYSQL_USER=<your-db-user>
  MYSQL_PASSWORD=<your-db-password>
  JWT_SECRET=<generate-strong-64-char-secret>
  CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
  RAZORPAY_KEY_ID=<your-razorpay-key>
  RAZORPAY_KEY_SECRET=<your-razorpay-secret>
  ```
- **Backend URL**: e.g. `https://zara-backend.onrender.com`

### Step 3: Deploy Frontend (Vercel / Netlify / Cloudflare Pages)
Deploy `frontend/` as a static Vite Single Page Application:

1. Connect your repository to **Vercel** or **Netlify**.
2. Set Root Directory: `frontend`
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`
5. Configure Environment Variable:
   ```env
   VITE_API_BASE_URL=https://zara-backend.onrender.com/api
   ```
6. Deploy! Your storefront will be live on a global CDN with SSL enabled automatically.

---

## Option 3: Linux VPS Deployment (Ubuntu 22.04 / 24.04 LTS)

For full control on a dedicated cloud VPS (DigitalOcean Droplet, AWS EC2, Linode, Hostinger VPS).

### Step 1: Server Preparation
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-21-jdk mysql-server nginx git curl
```

### Step 2: Configure MySQL
```bash
sudo mysql_secure_installation

sudo mysql -u root -p
```
Inside MySQL prompt:
```sql
CREATE DATABASE zara_mobiles_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'zara_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON zara_mobiles_db.* TO 'zara_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
Import schema and seed data:
```bash
mysql -u zara_user -p zara_mobiles_db < database/schema.sql
mysql -u zara_user -p zara_mobiles_db < database/sample-data.sql
mysql -u zara_user -p zara_mobiles_db < database/seed-reference-products.sql
```

### Step 3: Build & Run Spring Boot as a System Service
1. Package the backend on the server:
   ```bash
   cd backend
   mvn clean package -DskipTests
   sudo mkdir -p /opt/zara-backend
   sudo cp target/backend-1.0.0.jar /opt/zara-backend/app.jar
   ```

2. Create a systemd service file:
   ```bash
   sudo nano /etc/systemd/system/zara-backend.service
   ```
   Paste the following:
   ```ini
   [Unit]
   Description=ZARA MOBILES Backend API
   After=network.target mysql.service

   [Service]
   User=www-data
   WorkingDirectory=/opt/zara-backend
   ExecStart=/usr/bin/java -jar app.jar
   Environment="MYSQL_HOST=localhost"
   Environment="MYSQL_PORT=3306"
   Environment="MYSQL_DATABASE=zara_mobiles_db"
   Environment="MYSQL_USER=zara_user"
   Environment="MYSQL_PASSWORD=StrongPassword123!"
   Environment="JWT_SECRET=zaraMobilesSuperSecretKey2026SecureJwtTokenGeneratorAuthenticationKeyWithHighEntropy512BitsLong!"
   Environment="CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://localhost"
   SuccessExitStatus=143
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start backend:
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable zara-backend
   sudo systemctl start zara-backend
   sudo systemctl status zara-backend
   ```

### Step 4: Build & Deploy Frontend with Nginx
1. Build frontend assets:
   ```bash
   cd frontend
   # Set API Base URL for production
   echo "VITE_API_BASE_URL=/api" > .env.production
   npm install
   npm run build
   sudo cp -r dist/* /var/www/zara-frontend/
   ```

2. Configure Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/zaramobiles
   ```
   Paste:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       root /var/www/zara-frontend;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api/ {
           proxy_pass http://localhost:8080/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable configuration & test:
   ```bash
   sudo ln -s /etc/nginx/sites-available/zaramobiles /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Step 5: Install Free SSL Certificate (HTTPS)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot will automatically configure HTTPS encryption and set up automatic renewal.

---

## Production Environment Variables Checklist

| Variable | Description | Recommended Production Value |
| :--- | :--- | :--- |
| `MYSQL_HOST` | Database host | e.g. `db` (Docker) or `localhost` (VPS) |
| `MYSQL_PORT` | Database port | `3306` |
| `MYSQL_DATABASE` | Database name | `zara_mobiles_db` |
| `MYSQL_USER` | MySQL Username | Dedicated non-root user (e.g. `zara_user`) |
| `MYSQL_PASSWORD` | MySQL Password | High-entropy random password |
| `JWT_SECRET` | Secret for HMAC-SHA512 | At least 64 characters random string |
| `JWT_EXPIRATION_MS`| Token lifetime | `86400000` (24 Hours) |
| `CORS_ALLOWED_ORIGINS`| Allowed origins | `https://yourdomain.com` |
| `RAZORPAY_KEY_ID` | Razorpay API Key | `rzp_live_...` (or test key) |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Secret from Razorpay Dashboard |
| `VITE_API_BASE_URL` | Frontend API Base | `/api` (Nginx proxy) or `https://api.yourdomain.com/api` |

---

## Default Production Admin & Customer Accounts

Once the database seed runs, default accounts are created:
- **Admin**: `admin@zaramobiles.com` / `Admin@123`
- **Customer**: `customer@zaramobiles.com` / `Customer@123`

*Important*: Immediately log in and change the administrator password in production via `/profile`.
