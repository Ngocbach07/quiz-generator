# Pre-built Next.js standalone — no build inside HF's constrained builder.
# Local build artifacts (.next/standalone, .next/static) are committed.

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# The node:20-alpine image already provides a non-root `node` user (UID 1000).
# Reuse it instead of trying to create a group with GID 1000 (which collides with alpine's `users`).

# Copy the prebuilt standalone server (root = standalone/quiz-generator)
COPY --chown=node:node .next/standalone/quiz-generator ./
# Static assets live outside the standalone folder
COPY --chown=node:node .next/static ./.next/static
COPY --chown=node:node public ./public

USER node
EXPOSE 7860

CMD ["node", "server.js"]
