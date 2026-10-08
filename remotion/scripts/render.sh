#!/usr/bin/env bash
# Render + normalização linear do áudio para −14 LUFS (mantém o equilíbrio voz/efeitos).
# Uso: ./scripts/render.sh [Reel45|Reel45SemEfeitos|ReelCompleto]
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="${1:-Reel45}"
BROWSER_ARGS=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER_ARGS=(--browser-executable="$REMOTION_BROWSER")
npx remotion render "$COMP" "out/render_$COMP.mp4" --codec=h264 --crf=18 "${BROWSER_ARGS[@]}" --log=error
I=$(ffmpeg -hide_banner -i "out/render_$COMP.mp4" -af ebur128 -f null - 2>&1 | awk '/^ +I:/{print $2}' | tail -1)
GANHO=$(python3 -c "print(round(-14 - float('$I'), 2))")
echo "Loudness medido: $I LUFS -> ganho ${GANHO} dB"
# vídeo comprimido para caber no envio (< 30 MB em ~45 s) com o máximo de qualidade
ffmpeg -v error -y -i "out/render_$COMP.mp4" -c:v libx264 -preset slow -crf 19 -maxrate 4.5M -bufsize 9M -pix_fmt yuv420p \
  -af "volume=${GANHO}dB,alimiter=limit=0.89:level=false" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "out/$COMP.mp4"
echo "Pronto: out/$COMP.mp4"
