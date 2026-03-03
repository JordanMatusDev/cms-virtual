#!/bin/sh
set -e
ROOT="/usr/share/nginx/html"

# Sustituir placeholders por variables de entorno al arrancar (imagen pública, valores en el servidor)
for file in $(find "$ROOT" -type f \( -name "*.js" -o -name "*.html" \) 2>/dev/null); do
  [ -f "$file" ] || continue
  if [ -n "$VITE_API_BASE_URL" ]; then
    sed -i "s|__VITE_API_BASE_URL__|$VITE_API_BASE_URL|g" "$file"
  fi
  if [ -n "$VITE_SERVICE_TOKEN" ]; then
    sed -i "s|__VITE_SERVICE_TOKEN__|$VITE_SERVICE_TOKEN|g" "$file"
  fi
  if [ -n "$VITE_YOUTUBE_API_KEY" ]; then
    sed -i "s|__VITE_YOUTUBE_API_KEY__|$VITE_YOUTUBE_API_KEY|g" "$file"
  fi
done

exec nginx -g "daemon off;"
