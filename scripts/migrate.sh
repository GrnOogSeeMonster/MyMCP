#!/usr/bin/env sh
set -euo pipefail

echo "Running Prisma migrate and seed..."
cd /app
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
echo "Migration and seed complete."
