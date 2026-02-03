# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema FIRST (needed for postinstall script)
COPY prisma ./prisma

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy rest of source code
COPY . .

# Generate Prisma client (if not already done by postinstall)
RUN pnpm exec prisma generate

# Build frontend
RUN pnpm run build:client

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files FIRST
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema BEFORE installing (needed for postinstall script)
COPY prisma ./prisma

# Install production dependencies only (this triggers postinstall -> prisma generate)
RUN pnpm install --frozen-lockfile --prod

# Copy built frontend and source code from builder
COPY --from=builder /app/dist/spa ./dist/spa
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "--import", "tsx/esm", "server/dev.ts"]
