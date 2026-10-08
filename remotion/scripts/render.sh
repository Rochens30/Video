#!/usr/bin/env bash
# Render completo + normalização linear do áudio para −14 LUFS (mantém o equilíbrio voz/música/efeitos).
set -euo pipefail
cd "$(dirname "$0")/.."
BROWSER_ARGS=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER_ARGS=(--browser-executable="$REMOTION_BROWSER")
npx remotion render Consistencia out/render.mp4 "${BROWSER_ARGS[@]}" --log=error
I=$(ffmpeg -hide_banner -i out/render.mp4 -af ebur128 -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
GANHO=$(python3 -c "print(round(-14 - float('$I'), 2))")
echo "Loudness medido: $I LUFS -> ganho ${GANHO} dB"
ffmpeg -v error -y -i out/render.mp4 -c:v copy -af "volume=${GANHO}dB,alimiter=limit=0.89:level=false" \
  -ar 48000 -c:a aac -b:a 192k -movflags +faststart out/consistencia_final.mp4
echo "Pronto: out/consistencia_final.mp4"
