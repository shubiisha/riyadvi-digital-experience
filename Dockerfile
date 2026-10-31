# syntax=docker/dockerfile:1

# ---------- Stage 1: build the frontend ----------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Patch the base image's OS packages (openssl & friends) to the versions
# published for this Alpine release. The node image lags behind the security
# repository, so an explicit upgrade keeps the build toolchain current.
RUN apk upgrade --no-cache

# Install deps first for layer caching (only manifests are copied)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy only the source needed for the build (never node_modules / dist)
COPY frontend/index.html frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js ./
COPY frontend/public ./public
COPY frontend/src ./src

# Build with a same-origin API base so the SPA talks to /api on this host
RUN VITE_API_URL=/api npm run build


# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app/backend

# Same OS package refresh for the image that is actually shipped: the scanner
# reads /lib/apk/db/installed from this stage, and the node base image still
# carries an openssl build with published Alpine CVEs.
RUN apk upgrade --no-cache

# Backend runtime deps only
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Backend source
COPY backend/src ./src
COPY backend/scripts ./scripts
COPY backend/uploads ./uploads

# Pre-built frontend assets (served by Express on the same origin)
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV NODE_ENV=production
ENV PORT=80

EXPOSE 80

CMD ["node", "src/server.js"]
