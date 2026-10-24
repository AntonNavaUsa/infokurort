#!/bin/bash

set -Eeuo pipefail

cd /var/www/infokurort

if [[ ! -f .env || ! -f backend/.env.production ]]; then
  echo "Required production environment files are missing." >&2
  exit 1
fi

docker compose config --quiet
docker compose build backend infokurort admin
docker compose run --rm --no-deps backend npm run prisma:migrate:deploy
docker compose up -d --no-deps backend infokurort admin

for _ in {1..60}; do
  backend_status="$(docker inspect --format '{{.State.Health.Status}}' ski_backend 2>/dev/null || true)"
  if [[ "$backend_status" == "healthy" ]]; then
    break
  fi
  if [[ "$backend_status" == "unhealthy" ]]; then
    echo "Backend failed its health check." >&2
    exit 1
  fi
  sleep 2
done

if [[ "$backend_status" != "healthy" ]]; then
  echo "Backend did not become healthy before the timeout." >&2
  exit 1
fi

backend_port="$(docker compose port backend 3001 | awk -F: '{print $NF}')"
frontend_port="$(docker compose port infokurort 80 | awk -F: '{print $NF}')"
admin_port="$(docker compose port admin 80 | awk -F: '{print $NF}')"

if [[ ! "$backend_port" =~ ^[0-9]+$ || ! "$frontend_port" =~ ^[0-9]+$ || ! "$admin_port" =~ ^[0-9]+$ ]]; then
  echo "Could not determine published application ports." >&2
  exit 1
fi

curl --fail --silent --show-error --max-time 10 "http://127.0.0.1:${backend_port}/health" >/dev/null
curl --fail --silent --show-error --max-time 10 "http://127.0.0.1:${frontend_port}/" >/dev/null
curl --fail --silent --show-error --max-time 10 "http://127.0.0.1:${admin_port}/" >/dev/null

docker compose ps
echo "Deployment completed at $(date -Is)"
