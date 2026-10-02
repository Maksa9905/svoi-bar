FROM node:22-alpine AS build

RUN apk add --no-cache openssl \
  && corepack enable \
  && corepack prepare pnpm@10.15.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN rm -f tsconfig.build.tsbuildinfo tsconfig.tsbuildinfo \
  && pnpm prisma:generate \
  && pnpm build \
  && test -f dist/main.js

FROM node:22-alpine

RUN apk add --no-cache openssl \
  && corepack enable \
  && corepack prepare pnpm@10.15.1 --activate

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3001

CMD ["sh", "docker-entrypoint.sh"]
