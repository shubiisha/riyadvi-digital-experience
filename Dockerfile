# syntax=docker/dockerfile:1

# ---------- Stage 1: build the frontend ----------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Install deps first for layer caching
COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install --no-audit --no-fund

# Build with a same-origin API base so the SPA talks to /api on this host
COPY frontend/ ./frontend/
RUN cd frontend && VITE_API_URL=/api npm run build


# ---------- Stage 2: runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app

# Backend runtime deps only
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --omit=dev --no-audit --no-fund

# Backend source
COPY backend/ ./backend/

# Pre-built frontend assets (served by Express on the same origin)
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV NODE_ENV=production
ENV PORT=80
ENV MONGODB_URI=${MONGODB_URI}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV ADMIN_SECRET_KEY=${ADMIN_SECRET_KEY}

EXPOSE 80

WORKDIR /app/backend
CMD ["node", "src/server.js"]
