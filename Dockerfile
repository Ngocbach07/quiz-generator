# syntax=docker/dockerfile:1.7
# HuggingFace Spaces Docker template for Next.js (standalone output)
# Adapted from https://huggingface.co/docs/hub/spaces-sdks-docker

FROM node:20-alpine AS deps
WORKDIR /app
# HF Spaces runs as user 'user' (uid 1000) — install deps as root first, then switch.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# Create non-root user (HF Spaces requirement: uid 1000, user name 'user')
RUN addgroup --system --gid 1000 user && \
    adduser --system --uid 1000 --ingroup user user

# Copy standalone build + static assets
COPY --from=builder --chown=user:user /app/.next/standalone ./
COPY --from=builder --chown=user:user /app/.next/static ./.next/static
COPY --from=builder --chown=user:user /app/public ./public

USER user
EXPOSE 7860

# Healthcheck on the Next.js port
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:7860/ || exit 1

CMD ["node", "server.js"]
