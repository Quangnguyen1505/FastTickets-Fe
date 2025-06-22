FROM node:20-alpine AS base
LABEL author="ntquang"

WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache git \
    && npm ci

FROM node:20-alpine AS build
LABEL author="ntquang"

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && npm run build \
    && cd .next/standalone \
    && npm prune --production

FROM node:20-alpine AS production
LABEL author="ntquang"

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
