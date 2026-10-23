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

## Versão 2 (feedback: "cortes sem dinâmica e fora do timing", "centrado, atenção às margens", "um som baixo e natural")

| Problema | Correção |
|---|---|
| Cortes em tempos arbitrários (ex.: regresso ao orador a meio de "todo o país") | todos os cortes/títulos são inícios de palavra, afinados ao ataque da sílaba com librosa (`scripts/afinar_palavras.py` → `src/promo/inicios.json`, desvio médio do ASR 55 ms) e 2 frames antes da palavra |
| Whip só deslizava o plano novo sobre preto; punch de 4 % | transições reais entre os dois planos (6 frames): whip pan com os dois a moverem-se juntos + desfoque de movimento, zoom-through, flash de exposição; speed ramp (2,4× nos primeiros 10 frames) em cada B-roll |
| Orador descentrado (cara a ~43 % da largura → ~100 px à esquerda com o zoom) | seguimento da cara com OpenCV (`scripts/seguir_cara.py` → `src/promo/cara.json`): cara sempre em x = 540, y = 640, tamanho constante; jump cut = troca seca com punch, palavra forte = push-in suave de 8 frames |
| Texto perto das bordas / botões do Instagram | coluna de texto de 840 px (120 px de cada lado), legendas encolhem se a palavra não couber, comentário a 300 px do topo, CTA 60 px mais abaixo, capa centrada |
| Muitos sons diferentes (boom, glitch, relógio, teclado) | um só som: `sopro_1..3` (ar, estéreo, sintetizado), só nos whip pans, flashes e momentos especiais (~14), ~12 dB abaixo da voz |
