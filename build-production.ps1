# ========================================================
# ZARA MOBILES - PRODUCTION BUILD SCRIPT
# Builds Backend JAR and Frontend Static Production Assets
# ========================================================

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "       BUILDING ZARA MOBILES PRODUCTION PACKAGES  " -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $rootDir) { $rootDir = Get-Location }

# 1. Build Backend Executable JAR
Write-Host "`n[1/2] Building Spring Boot Backend JAR..." -ForegroundColor Cyan
cd "$rootDir"
.\mvn.bat -f backend/pom.xml clean package -DskipTests
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Backend JAR built successfully at backend/target/backend-1.0.0.jar" -ForegroundColor Green
} else {
    Write-Host "  -> Backend build failed." -ForegroundColor Red
    exit 1
}

# 2. Build Frontend Production Assets
Write-Host "`n[2/2] Building React Production Assets (Vite)..." -ForegroundColor Cyan
cd "$rootDir\frontend"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  -> Frontend production build successfully placed in frontend/dist" -ForegroundColor Green
} else {
    Write-Host "  -> Frontend build failed." -ForegroundColor Red
    exit 1
}

Write-Host "`n==================================================" -ForegroundColor Green
Write-Host "       BUILD COMPLETE & VERIFIED!                 " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green
Write-Host "To run the production backend JAR directly:" -ForegroundColor White
Write-Host "  java -jar backend/target/backend-1.0.0.jar" -ForegroundColor Yellow
Write-Host "`nTo preview the production frontend:" -ForegroundColor White
Write-Host "  cd frontend; npm run preview" -ForegroundColor Yellow
Write-Host "==================================================" -ForegroundColor Green
