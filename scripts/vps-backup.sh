#!/bin/sh
# Daily SQLite backup for the VPS. Runs from deploy/graduation-backup.timer.
# Stops the container briefly for a consistent copy, restarts it, checks health
# and keeps the newest DAILY_KEEP snapshots.
set -eu

APP_DIR="${APP_DIR:-$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)}"
COMPOSE="docker compose --env-file .env.production"
LOCK_FILE="${TMPDIR:-/tmp}/graduation-backup.lock"
KEEP="${DAILY_KEEP:-14}"

cd "$APP_DIR"
mkdir -p backups

if ! command -v flock >/dev/null 2>&1; then
  echo "flock (util-linux) is required for the backup lock."
  exit 1
fi

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "Another backup is running; skipping this run."
  exit 0
fi

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

if [ ! -f .env.production ]; then
  log "Missing .env.production in $APP_DIR; nothing to do."
  exit 1
fi

container_id="$($COMPOSE ps -aq invitation || true)"
if [ -z "$container_id" ]; then
  log "Invitation container is not created yet; nothing to back up."
  exit 0
fi

directory="backups/daily-$(date -u +%Y%m%d-%H%M%S)"
stopped=0
finish() {
  code=$?
  trap - EXIT INT TERM
  if [ "$stopped" = "1" ]; then
    $COMPOSE up -d --wait || true
  fi
  if [ "$code" -ne 0 ]; then
    log "Backup failed (exit $code)."
  fi
  exit "$code"
}
trap finish EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

mkdir -p "$directory"
$COMPOSE stop invitation
$COMPOSE cp invitation:/app/data/. "$directory/"
$COMPOSE up -d --wait
stopped=0
curl --fail --silent --show-error --retry 6 --retry-delay 5 http://127.0.0.1:3000/api/health
trap - EXIT INT TERM

log "Backup written: $directory"
if [ -n "${BACKUP_REMOTE:-}" ] && command -v rclone >/dev/null 2>&1; then
  if rclone copy "$directory" "$BACKUP_REMOTE" --quiet; then
    log "Offsite copy sent to $BACKUP_REMOTE."
  else
    log "Offsite copy failed; the local backup is still available."
  fi
fi
ls -1dt backups/daily-* 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -rf || true
