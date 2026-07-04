# Pre-built Next.js standalone — no build inside HF's constrained builder.
# Local build artifacts (.next/standalone, .next/static) are committed.

FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1000 user && \
    adduser --system --uid 1000 --ingroup user user

# Copy the prebuilt standalone server (root = standalone/quiz-generator)
COPY --chown=user:user .next/standalone/quiz-generator ./
# Static assets live outside the standalone folder
COPY --chown=user:user .next/static ./.next/static
COPY --chown=user:user public ./public

USER user
EXPOSE 7860

CMD ["node", "server.js"]
