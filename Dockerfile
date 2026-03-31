FROM node:20-bookworm-slim AS deps

WORKDIR /app

COPY tmp_deadline_v10_validation/package.json ./package.json
COPY tmp_deadline_v10_validation/package-lock.json ./package-lock.json
RUN npm ci

FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY tmp_deadline_v10_validation/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]
