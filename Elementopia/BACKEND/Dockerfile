# Use a Java 17 image
FROM eclipse-temurin:17-jdk

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Grant mvnw execution permissions
RUN chmod +x ./mvnw

# Build the project (skipping tests for speed)
RUN ./mvnw clean package -DskipTests

# Run the jar file
CMD ["java", "-jar", "target/Gamified-0.0.1-SNAPSHOT.jar"]
