# Vídeo 5 — Promo "o evento é amanhã" (23 out 2026)

Mesma gravação do vídeo 4 (`IMG_6479.MOV` + B-rolls `evento_2..5`), mas com outra edição: o utilizador quis
"mais dinâmico, com menos Remotion, com efeitos e chamativo, modo profissional, 45 s", e pediu o **Higgsfield**.
O Higgsfield não estava acessível: `higgsfield.ai`, `platform.higgsfield.ai` e `cloud.higgsfield.ai` dão 403 no proxy
e não há conector no registo MCP. Os efeitos foram feitos em Remotion + ffmpeg; ficaram prompts para ele gerar planos no Higgsfield.

Código: `remotion/src/promo/` (`roteiro.ts` = todos os tempos; `Promo.tsx`; `Efeitos.tsx`; `CapaPromo.tsx`).
Composições: `ReelPromo`, `ReelPromoSemEfeitos`, `CapaPromo`. Montagem da voz: a mesma do vídeo 4 (`montagem_curta.json`).

| Item | Escolha |
|---|---|
| Sem painel de gráficos | o orador fica sempre em ecrã inteiro; a informação passa para títulos cinéticos e B-roll |
| Gancho (0–2,4 s) | plano geral da sala a 2× com aproximação + "AMANHÃ" no frame 0 + boom; whip pans para a sala e o roll-up com "24 OUT · LISBOA · 14H" |
| Enquadramento | 4 enquadramentos em rotação (1 / 1,16 / 1,06 / 1,26 × 1,6) a cada corte e em `REENQUADRAR`, com punch de 4 frames e deriva lenta; âncora 45 % / 42 % |
| B-roll | 11 planos em ecrã inteiro, com entradas whip (desfoque horizontal SVG), punch ou flash |
| Títulos | Montserrat 900 grande; vermelho com glitch RGB na fase "inconsistência / perder dinheiro" (orador a preto e branco com tom vermelho), verde em "profissionais"; lista 01–04 (metodologias, rotinas, Smart Money, ICT) |
| Momentos | relógio conta-quilómetros "14:00" em "amanhã às 14 horas", carimbo ÚLTIMOS LUGARES com tremor, caixa de comentário a escrever EVENTO |
| Look | contraste/saturação, vinheta, grão de filme (`scripts/gerar_grao.py` → `public/fx/`), fugas de luz, flashes, tremores |
| Sons | novos sintetizados: `boom`, `glitch`, `tique`, `subida` (`scripts/sintetizar_sfx.py`); ~25 momentos a volume baixo (×0,6) |
| CTA | o do vídeo 4 (5 s), com flash + fuga de luz à entrada |
| Capa | frame aos 27,17 s (olhar para a câmara), "● É JÁ / AMANHÃ / SÁB 24 OUT · 14H · LISBOA" |
| Música | continua sem fonte licenciada acessível → versão sem efeitos para juntar música na app |
