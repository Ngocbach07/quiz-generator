# syntax=docker/dockerfile:1.7
# HuggingFace Spaces Docker image for Next.js (standalone output)

FROM node:20-slim AS deps
WORKDIR /app
# Install build tools needed by some native deps (sharp, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ libc6 \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --omit=optional

FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Allow Next.js build to use more heap on constrained builders
ENV NODE_OPTIONS=--max-old-space-size=4096
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# HF Spaces runs as non-root user 'user' (uid 1000)
RUN addgroup --system --gid 1000 user && \
    adduser --system --uid 1000 --ingroup user user

# Copy standalone server + static assets
COPY --from=builder --chown=user:user /app/.next/standalone ./
COPY --from=builder --chown=user:user /app/.next/static ./.next/static
COPY --from=builder --chown=user:user /app/public ./public

USER user
EXPOSE 7860

# Lightweight healthcheck using node instead of wget
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://localhost:7860/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
