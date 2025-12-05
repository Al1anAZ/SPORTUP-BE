# ---- Build stage ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    ARG DATABASE_URL
    ENV DATABASE_URL=$DATABASE_URL
    
    COPY package*.json ./
    ENV HUSKY_SKIP_INSTALL=1
    RUN npm ci
    
    COPY . .
    
    RUN npx prisma generate --schema=prisma/schema.prisma
    
    RUN npm run build
    
    # ---- Production stage ----
    FROM node:20-alpine AS production
    
    WORKDIR /app
    
    COPY package*.json ./
    ENV HUSKY_SKIP_INSTALL=1
    RUN npm ci --omit=dev --ignore-scripts
    
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/prisma ./prisma
    COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 4000
    
    CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
    