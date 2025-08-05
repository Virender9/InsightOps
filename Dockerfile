# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --no-audit --no-fund

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:1.25-alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy environment configuration script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S insightops -u 1001

# Set ownership of nginx directories
RUN chown -R insightops:nodejs /var/cache/nginx && \
    chown -R insightops:nodejs /var/log/nginx && \
    chown -R insightops:nodejs /etc/nginx/conf.d && \
    chown -R insightops:nodejs /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R insightops:nodejs /var/run/nginx.pid

# Switch to non-root user
USER insightops

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start application
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
