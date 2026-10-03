#!/bin/sh
set -eu

cert="/etc/letsencrypt/live/svoi.hakolr.dev/fullchain.pem"

pick_config() {
  if [ -f "$cert" ]; then
    cp /etc/nginx/templates-src/https.conf /etc/nginx/conf.d/default.conf
  else
    cp /etc/nginx/templates-src/http.conf /etc/nginx/conf.d/default.conf
  fi
}

pick_config
nginx -g "daemon off;" &
pid="$!"

while kill -0 "$pid" 2>/dev/null; do
  sleep 43200 &
  wait "$!" || true
  pick_config
  nginx -s reload || true
done
