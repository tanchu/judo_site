#!/usr/bin/env bash
# Эталон вычисленных стилей (tests/e2e/computed-styles.spec.ts) в Linux-контейнере Playwright —
# в той же ОС, что CI: ширина текста на macOS чуть другая. Нужен Docker (OrbStack, Docker Desktop).
#
#   pnpm run test:styles           — проверить
#   pnpm run test:styles:update    — обновить эталон
#
# node_modules, .next и кэш pnpm контейнера — в отдельных томах Docker: зависимости под Linux
# не смешиваются с локальными.
set -euo pipefail
cd "$(dirname "$0")/.."

version="$(node -p "require('@playwright/test/package.json').version")"
pnpm_version="$(node -p "require('./package.json').packageManager.split('@')[1]")"

docker run --rm --ipc=host \
  -v "$PWD":/app -w /app \
  -v judo-styles-node-modules:/app/node_modules \
  -v judo-styles-next:/app/.next \
  -v judo-styles-pnpm:/root/.local/share/pnpm/store \
  -e CI=true -e PNPM_VERSION="$pnpm_version" \
  "mcr.microsoft.com/playwright:v${version}-noble" \
  bash -c 'npm install -g --silent "pnpm@$PNPM_VERSION" && pnpm install --frozen-lockfile && pnpm exec playwright test computed-styles "$@"' _ "$@"
