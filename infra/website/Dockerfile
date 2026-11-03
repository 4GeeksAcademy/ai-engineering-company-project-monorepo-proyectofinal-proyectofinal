# ===================================================================
# Dockerfile — TrackFlow Website
# Servidor Nginx Alpine optimizado para contenido estático
# ===================================================================
# Build context = raíz del monorepo (definido en docker-compose.yml)
FROM nginx:stable-alpine

LABEL maintainer="TrackFlow Tech"
LABEL description="TrackFlow Public Website — Nginx static server"
LABEL project="trackflow-website"

# Eliminar config por defecto
RUN rm -f /etc/nginx/conf.d/default.conf

# Copiar configuración Nginx personalizada
COPY infra/website/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos estáticos del sitio web
COPY uis/website/index.html uis/website/application.html \
    uis/website/styles.css uis/website/validation.js \
    /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]