# Reels — Forex Academy Club

Base para transformar vídeos gravados (pessoa a falar para a câmara) em Reels de Instagram 9:16
com legendas palavra a palavra, motion graphics de trading, gancho, call to action e capa.

| Pasta / ficheiro | O que é |
|---|---|
| `PROMPT_NOVO_REEL.md` | Prompt para colar quando tens um vídeo novo |
| `.claude/skills/reel-trading/SKILL.md` | A skill: processo completo, decisões de estilo aprovadas e lições aprendidas |
| `remotion/` | Projeto de vídeo (Remotion/React): cenas, legendas, sons, gancho, CTA, capa |
| `ferramentas/transcrever.py` | Transcrição com tempo de cada palavra (Whisper + Parakeet, locais) |
| `ferramentas/analisar_video.py` | Formato, jump cuts, pausas, loudness e folhas de frames |
| `ferramentas/legendas_ass.py` | Legendas .ass em 3 estilos (alternativa sem Remotion) |
| `videos/` | Arquivo de cada vídeo feito (transcrição, notas, escolhas) |

Os vídeos (`*.mp4`) não vão para o git.
