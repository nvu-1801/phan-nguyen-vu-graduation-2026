#!/bin/sh
# Pull-based auto deploy for the VPS. Runs from a systemd timer (see deploy/).
# Deploys only when origin/main moved, refuses tracked local edits, backs up
# SQLite before the rebuild and verifies /api/health afterwards.
set -eu

APP_DIR="${APP_DIR:-$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)}"
BRANCH="${BRANCH:-main}"
COMPOSE="docker compose --env-file .env.production"
LOCK_FILE="${TMPDIR:-/tmp}/graduation-auto-deploy.lock"

cd "$APP_DIR"
mkdir -p backups

if ! command -v flock >/dev/null 2>&1; then
  echo "flock (util-linux) is required for the deploy lock."
  exit 1
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another auto deploy is running; skipping this run."
  exit 0
fi

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

if [ ! -f .env.production ]; then
  log "Missing .env.production in $APP_DIR; nothing to do."
  exit 1
fi

git fetch --prune origin "$BRANCH" || { log "git fetch failed."; exit 1; }
remote="$(git rev-parse "origin/$BRANCH")"
local="$(git rev-parse HEAD)"
if [ "$remote" = "$local" ]; then
  exit 0
fi

if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  log "Tracked files changed on the server; refusing to deploy."
  git status --short >&2
  exit 1
fi

git checkout -q "$BRANCH"

backup="backups/auto-$(date -u +%Y%m%d-%H%M%S)"
container_id="$($COMPOSE ps -aq invitation || true)"
if [ -n "$container_id" ]; then
  mkdir -p "$backup"
  $COMPOSE stop invitation
  $COMPOSE cp invitation:/app/data/. "$backup/"
  trap '$COMPOSE up -d --wait || true' EXIT HUP INT TERM
  log "Database backup: $backup"
fi

git merge --ff-only "origin/$BRANCH"
$COMPOSE up -d --build --wait
curl --fail --silent --show-error --retry 6 --retry-delay 5 http://127.0.0.1:3000/api/health
trap - EXIT HUP INT TERM

log "Deployed $(git rev-parse --short HEAD)."
ls -1dt backups/auto-* 2>/dev/null | tail -n +11 | xargs -r rm -rf || true
