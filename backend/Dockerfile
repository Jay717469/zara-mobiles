# ========================================================
# ZARA MOBILES BACKEND - PRODUCTION DOCKERFILE
# Multi-stage build using Eclipse Temurin Java 21 LTS
# ========================================================

# Stage 1: Build JAR
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper & pom.xml
COPY pom.xml .
COPY src ./src

# Install Maven & Package
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

# Stage 2: Minimal Runtime Image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-privileged user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built JAR from builder stage
COPY --from=builder /app/target/backend-1.0.0.jar app.jar

# Expose backend port
EXPOSE 8080

# Environment defaults (override in docker-compose or cloud runtime)
ENV MYSQL_HOST=localhost \
    MYSQL_PORT=3306 \
    MYSQL_DATABASE=zara_mobiles_db \
    MYSQL_USER=root \
    MYSQL_PASSWORD=root \
    JWT_SECRET=zaraMobilesSuperSecretKey2026SecureJwtTokenGeneratorAuthenticationKeyWithHighEntropy512BitsLong! \
    CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
