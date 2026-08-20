#!/usr/bin/env bash
# Serve a graphic locally and open it in the default browser.
# Usage: preview.sh <file.html> [port]
set -euo pipefail

file="${1:?usage: preview.sh <file.html> [port]}"
port="${2:-4173}"
directory="$(cd "$(dirname "$file")" && pwd)"
name="$(basename "$file")"

python3 -m http.server "$port" --directory "$directory" >/dev/null 2>&1 &
server=$!
trap 'kill $server 2>/dev/null' EXIT

sleep 0.3
open "http://localhost:$port/$name" 2>/dev/null || echo "open http://localhost:$port/$name"
echo "serving $directory on :$port (ctrl-c to stop)"
wait $server
