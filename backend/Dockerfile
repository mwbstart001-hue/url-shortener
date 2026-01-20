# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven configuration files
COPY pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src/ ./src/
RUN mvn package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre
WORKDIR /app

# Create SQLite database directory
RUN mkdir -p /app/db

# Copy the JAR file from the build stage
COPY --from=build /app/target/url-shortener-*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Set environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV DATABASE_PATH=/app/db/url_shortener.db
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]