#!/usr/bin/env bash
# Renderiza os Stories (só texto, sem áudio) para out/stories/StoryN.mp4.
set -euo pipefail
cd "$(dirname "$0")/.."
BROWSER_ARGS=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER_ARGS=(--browser-executable="$REMOTION_BROWSER")
mkdir -p out/stories
for i in 1 2 3 4 5; do
  npx remotion render "Story$i" "out/stories/_Story$i.mp4" --codec=h264 --crf=18 --muted "${BROWSER_ARGS[@]}" --log=error
  ffmpeg -v error -y -i "out/stories/_Story$i.mp4" -c:v libx264 -preset slow -crf 19 -maxrate 5M -bufsize 10M -pix_fmt yuv420p -an -movflags +faststart "out/stories/Story$i.mp4"
  rm "out/stories/_Story$i.mp4"
  echo "Story$i pronto"
done
