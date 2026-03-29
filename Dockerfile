# ---- Base Stage ----
FROM node:22-slim AS base
WORKDIR /app

# Chromium-Abhängigkeiten für Remotion (Server-seitige Renders)
RUN apt-get update && apt-get install -y \
  chromium \
  ffmpeg \
  libnspr4 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Remotion: System-Chromium statt Download
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV REMOTION_SKIP_CHROMIUM_DOWNLOAD=1
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium

# ---- Dependencies Stage ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# ---- Builder Stage ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---- Runner Stage (Standalone) ----
FROM node:22-slim AS runner
WORKDIR /app

# Nur Runtime-Abhängigkeiten für Chromium/FFmpeg
RUN apt-get update && apt-get install -y \
  chromium \
  ffmpeg \
  libnspr4 \
  libnss3 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcups2 \
  libdrm2 \
  libxkbcommon0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV REMOTION_SKIP_CHROMIUM_DOWNLOAD=1
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium

# Non-root User
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Standalone-Output kopieren
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Output- und Datenbank-Verzeichnis
RUN mkdir -p /app/out /app/data && chown nextjs:nodejs /app/out /app/data

ENV DB_PATH=/app/data/chartdb.sqlite

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
