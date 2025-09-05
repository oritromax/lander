# =========================
# Builder Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including dev) for build
RUN npm ci && \
    npm cache clean --force

COPY . .

RUN npm run build

# =========================
# Runtime Stage  
# =========================
FROM node:20-alpine AS runner

LABEL org.opencontainers.image.title="Lander"
LABEL org.opencontainers.image.description="A beautiful, customizable dashboard for self-hosted services"
LABEL org.opencontainers.image.authors="Oritro Ahmed <le@ioritro.com>"

WORKDIR /app

RUN npm install -g serve && \
    apk add --no-cache su-exec

COPY --from=builder --chown=node:node /app/dist ./dist

COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/

# Create directories for config templates and theme styles
RUN mkdir -p /app/default-config /app/dist/styles/themes

# Copy config templates from src (these will be used for first-run initialization)
COPY --chown=node:node src/config/* /app/default-config/

# Copy theme styles to be served statically
COPY --chown=node:node src/styles/themes/* /app/dist/styles/themes/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["serve", "-s", "dist", "-l", "3000"]