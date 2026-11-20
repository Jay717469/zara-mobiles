# ========================================================
# ZARA MOBILES - 1-CLICK POWERSHELL LAUNCHER
# Starts Backend API & Frontend Development Servers
# ========================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "       STARTING ZARA MOBILES PLATFORM             " -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $rootDir) { $rootDir = Get-Location }

# 1. Verify MySQL Port 3306
Write-Host "`n[1/3] Checking MySQL database on port 3306..." -ForegroundColor Cyan
$mysqlCheck = Get-NetTCPConnection -LocalPort 3306 -ErrorAction SilentlyContinue
if ($mysqlCheck) {
    Write-Host "  -> MySQL Server is active on port 3306." -ForegroundColor Green
} else {
    Write-Host "  -> Warning: MySQL is not detected on port 3306." -ForegroundColor Yellow
    Write-Host "     Ensure MySQL service is started with 'zara_mobiles_db'." -ForegroundColor Yellow
}

# 2. Start Spring Boot Backend in a New Window
Write-Host "`n[2/3] Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir'; Write-Host 'Starting ZARA MOBILES Backend...' -ForegroundColor Green; .\mvn.bat -f backend/pom.xml spring-boot:run"
Write-Host "  -> Backend process initiated in separate window." -ForegroundColor Green

# Wait a brief moment
Start-Sleep -Seconds 3

# 3. Start React Frontend in a New Window
Write-Host "`n[3/3] Starting React Frontend (Port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; Write-Host 'Starting ZARA MOBILES Frontend...' -ForegroundColor Cyan; npm run dev"
Write-Host "  -> Frontend process initiated in separate window." -ForegroundColor Green

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "       ZARA MOBILES IS LAUNCHING!                 " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "Frontend Storefront : http://localhost:5173" -ForegroundColor White
Write-Host "Backend REST API    : http://localhost:8080/api" -ForegroundColor White
Write-Host "Interactive Swagger : http://localhost:8080/api/swagger-ui/index.html" -ForegroundColor White
Write-Host "`nDefault Demo Credentials:" -ForegroundColor Yellow
Write-Host "  - Customer : customer@zaramobiles.com / Customer@123" -ForegroundColor Gray
Write-Host "  - Admin    : admin@zaramobiles.com / Admin@123" -ForegroundColor Gray
Write-Host "==================================================" -ForegroundColor Green

# 4. Open in Default Browser
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
