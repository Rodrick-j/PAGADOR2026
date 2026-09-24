# ====== BUILD ======
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# deps para paquetes nativos (si los hubiera)
RUN apk add --no-cache python3 make g++

# fija npm primero (evita el 254)
RUN npm i -g npm@10.8.1

# instala deps con cache de capas
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --progress=false

# copia el resto y compila
COPY . .
RUN npm run build

# ====== RUNTIME (NGINX SPA) ======
FROM socialengine/nginx-spa:latest

# copia artefactos estáticos
COPY --from=builder /usr/src/app/build /app

# (opcional) borrar sourcemaps
RUN find /app -name '*.map' -type f -delete
