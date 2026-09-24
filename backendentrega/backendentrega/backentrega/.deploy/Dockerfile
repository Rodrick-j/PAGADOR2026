# ====== Build ======
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copiamos el resto y construimos
COPY . .
RUN npm run build

# ====== Runtime ======
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Dependencias para Puppeteer/Chromium
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Variables de entorno
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
ENV PORT=80

# (Opcional) build-args que te advierte CapRover
ARG CAPROVER_GIT_COMMIT_SHA
# ARG JWT_SECRET
# Puedes dejarlos como label/env si los necesitas:
LABEL org.opencontainers.image.revision=$CAPROVER_GIT_COMMIT_SHA

# Instalar solo deps de producción
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

# Copiar artefactos compilados
COPY --from=builder /usr/src/app/build ./build

EXPOSE 80
CMD ["npm", "start"]
