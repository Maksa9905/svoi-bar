#!/bin/sh
set -eu

echo "Перед этим поднимите стек, чтобы nginx слушал 80 порт."

if [ -z "${CERTBOT_EMAIL:-}" ]; then
  echo "Задайте CERTBOT_EMAIL в .env" >&2
  exit 1
fi

docker compose -f docker-compose.yml -f docker-compose.prod.yml run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  --email "$CERTBOT_EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d svoi.hakolr.dev \
  -d www.svoi.hakolr.dev \
  -d admin.svoi.hakolr.dev

docker compose -f docker-compose.yml -f docker-compose.prod.yml restart nginx
