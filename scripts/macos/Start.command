#!/bin/zsh
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="$HOME/Library/Application Support/D100 DungeonScribe"
DATABASE_PATH="$DATA_DIR/dungeonscribe.db"
PORT="${DUNGEONSCRIBE_PORT:-3210}"

# Nach dem ausdrücklich bestätigten ersten Öffnen von Start.command kann macOS
# weiterhin mitgelieferte native Module blockieren. Die Quarantäne wird nur für
# dieses entpackte Testpaket entfernt, niemals für Downloads oder andere Ordner.
if ! /usr/bin/xattr -dr com.apple.quarantine "$APP_DIR" 2>/dev/null; then
  print -u2 "Die macOS-Downloadmarkierung konnte nicht vollständig entfernt werden."
  print -u2 "Bitte verschiebe das Paket in einen beschreibbaren Ordner und starte es erneut."
  exit 1
fi

mkdir -p "$DATA_DIR"
export DUNGEONSCRIBE_DB_PATH="$DATABASE_PATH"
export DATABASE_URL="file:$DATABASE_PATH"
export HOSTNAME="127.0.0.1"
export PORT
export NEXT_TELEMETRY_DISABLED="1"

cd "$APP_DIR"
"$APP_DIR/runtime/node" "$APP_DIR/migrate.mjs"

cleanup() {
  if [[ -n "${SERVER_PID:-}" ]]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT INT TERM

"$APP_DIR/runtime/node" "$APP_DIR/server.js" &
SERVER_PID=$!

for attempt in {1..40}; do
  if curl --silent --fail "http://127.0.0.1:$PORT" >/dev/null; then
    if [[ "${DUNGEONSCRIBE_NO_OPEN:-0}" != "1" ]]; then
      open "http://127.0.0.1:$PORT"
    fi
    print "D100 DungeonScribe läuft. Dieses Fenster zum Beenden mit Ctrl+C schließen."
    wait "$SERVER_PID"
    exit 0
  fi

  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    print -u2 "D100 DungeonScribe konnte nicht gestartet werden."
    wait "$SERVER_PID"
    exit 1
  fi

  sleep 0.5
done

print -u2 "D100 DungeonScribe hat nicht rechtzeitig geantwortet."
exit 1
