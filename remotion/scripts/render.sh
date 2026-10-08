#!/usr/bin/env bash
# Render + normalização linear do áudio para −14 LUFS (mantém o equilíbrio voz/efeitos).
# Uso: ./scripts/render.sh [Consistencia|Consistencia45]
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="${1:-Consistencia}"
BROWSER_ARGS=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER_ARGS=(--browser-executable="$REMOTION_BROWSER")
npx remotion render "$COMP" "out/render_$COMP.mp4" "${BROWSER_ARGS[@]}" --log=error
I=$(ffmpeg -hide_banner -i "out/render_$COMP.mp4" -af ebur128 -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
GANHO=$(python3 -c "print(round(-14 - float('$I'), 2))")
echo "Loudness medido: $I LUFS -> ganho ${GANHO} dB"
# vídeo comprimido para caber no envio (< 30 MB) sem perda visível
ffmpeg -v error -y -i "out/render_$COMP.mp4" -c:v libx264 -preset slow -crf 21 -maxrate 3M -bufsize 6M -pix_fmt yuv420p \
  -af "volume=${GANHO}dB,alimiter=limit=0.89:level=false" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "out/$COMP.mp4"
echo "Pronto: out/$COMP.mp4"
