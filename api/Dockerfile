# syntax=docker/dockerfile:1
FROM node:22-alpine AS base

WORKDIR /app

# Install required libs for Prisma engines and curl for healthchecks
RUN apk add --no-cache curl openssl libc6-compat

COPY package.json tsconfig.json ./
COPY prisma ./prisma
COPY ide-config-seed ./ide-config-seed
COPY server.ts ./server.ts
COPY types.ts ./types.ts

RUN npm install --no-audit --no-fund

# Generate Prisma client and build TypeScript
ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary
RUN npx prisma generate && npm run build

EXPOSE 8080

ENV NODE_ENV=production
CMD ["node", "dist/server.js"]


