#!/bin/sh
set -eu

pnpm exec prisma migrate deploy
pnpm exec prisma db seed
exec node dist/main.js
