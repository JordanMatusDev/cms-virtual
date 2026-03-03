# Stage 1: Build (con placeholders; los valores reales se inyectan al arrancar en el servidor)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Placeholders que se reemplazarán en runtime por el entrypoint (imagen pública sin secretos)
ARG VITE_API_BASE_URL=__VITE_API_BASE_URL__
ARG VITE_SERVICE_TOKEN=__VITE_SERVICE_TOKEN__
ARG VITE_YOUTUBE_API_KEY=__VITE_YOUTUBE_API_KEY__
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SERVICE_TOKEN=$VITE_SERVICE_TOKEN
ENV VITE_YOUTUBE_API_KEY=$VITE_YOUTUBE_API_KEY

RUN npm run build

# Stage 2: Serve con nginx + entrypoint que inyecta env al arrancar
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
  echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
