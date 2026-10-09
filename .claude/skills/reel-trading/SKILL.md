---
name: reel-trading
description: Transforma um vídeo bruto (pessoa a falar para a câmara) num Reel de Instagram 9:16 da Forex Academy Club — transcrição com tempo de cada palavra, legendas palavra a palavra, motion graphics de trading, gancho, call to action, capa e versões de ~45 s com e sem efeitos sonoros, tudo em Remotion. Usar sempre que o utilizador enviar um vídeo novo para fazer um reel, pedir para "fazer como o último vídeo", ou falar em transcrever/legendar/editar um vídeo de trading.
---

# Reel de trading — Forex Academy Club

Pipeline completo, já testado no 1.º vídeo ("Consistência", ver `remotion/README.md`).
O projeto `remotion/` é a **base**: para um vídeo novo trocam-se os dados e as cenas, o resto mantém-se.

## Quem é o utilizador e como trabalhar com ele

- Escreve em **português de Portugal**. Responder em PT-PT, detalhado mas simples, **sem rodeios**.
- Quer **a verdade e a tua opinião**; desafia-o quando achares que há melhor (ex.: duração, gancho, música).
- Diz sempre as limitações: **não consegues ouvir áudio** — escolhas de som/música são feitas por medição e ele valida.
- Não inventes estatísticas nem promessas. Números nos gráficos são **ilustrativos** e diz-lo.
- Marca: **Forex Academy Club** — site `homepage.forexacademyclub.com` (eventos em `forexacademyclub.com/cursoiniciante/...`).
  O domínio está bloqueado na rede deste ambiente: o tema foi copiado de capturas de ecrã que ele enviou.
- Logótipo: `remotion/public/logo.png` (escudo dourado, fundo transparente).

## O que ele aprovou (decisões finais — respeitar por defeito)

| Tema | Decisão |
|---|---|
| Formato | 9:16, 1080×1920, 30 fps, áudio normalizado a −14 LUFS, ficheiro < 30 MB para envio |
| Versões a entregar | `Reel45` (≈45 s, principal) + `Reel45SemEfeitos` + imagem `Capa`; `ReelCompleto` (vídeo inteiro) só se pedir |
| Gancho | Texto por cima do orador **desde o 1.º frame** (sem ecrã de intro à parte), com **elemento de destaque** (ex.: anel/brilho a pulsar) e **zoom de aproximação suave** nos primeiros ~2,8 s (`ZOOM_GANCHO`) |
| Ritmo | Cortar **todos os silêncios > 0,2 s**, gaguejos e erros (`PAUSA_MAX = 0.20`, `MARGEM = 0.05`); troca de zoom a cada fim de frase; ícones (`ICONES` em `tempo.ts`) a saltar nas palavras-chave quando o orador está em ecrã inteiro; motion blur leve nas transições |
| Legendas | **(atualizado no vídeo 3)** centradas, **máx. 3 palavras** por ecrã, **sem serifa em negrito** (Montserrat 900, maiúsculas, contorno preto); a palavra a ser dita muda de cor (amarelo `#FFD43B`; verde nas palavras de `CHAVE`) |
| Gráficos | Painel escuro desce de cima e o orador desce para baixo (ecrã dividido); **alternar** com o orador em ecrã inteiro (não ficar >70 % do tempo dividido) |
| Cores | Tema do site: preto quente `#0A0908`, dourado só para a **marca** (títulos em itálico, rótulos, botões); **dados de mercado a verde `#2EBD85` / vermelho `#F6465D`** (velas, barras, curvas, vistos) — ele achou "muito dourado" quando tudo era dourado |
| Tipografia | Títulos Playfair Display (ênfase em itálico dourado), texto Manrope, rótulos JetBrains Mono maiúsculo espaçado com traço "— " |
| Efeitos sonoros | **Poucos**, só momentos-chave e **realistas**: whoosh do painel, clique de rato (checklists, trocas, botão), teclado mecânico a escrever (tabelas/diários), impacto num carimbo. Nada de "bips" de interface. Volume global `GANHO = 0.5` |
| Música | **Não** meter no ficheiro. Ele junta na app do Instagram (biblioteca licenciada, volume 10–15 %, instrumental lo-fi/minimal/cinematic, nada de "corporate" alegre). Só misturar se ele enviar um MP3 licenciado |
| CTA final (5 s) | Logótipo → frase curta sobre o tema (ex.: *"Consistência não é sorte. Aprende-se."*) → botão dourado **"QUERO SABER MAIS →"** com cursor a clicar → URL + **"↑ LINK NA BIO"** → faixa ✦ em itálico. Ele **não gostou** de "Entra na academia" nem de "Falta o como" |
| Capa | Frame com olhar para a câmara, aproximada; título serifado curto com ênfase dourada; logótipo por baixo; tudo dentro do recorte 3:4 da grelha (y 240–1680) |
| Zonas seguras Reels | Etiquetas no topo a y ≥ 230; legendas a y 1150 (ecrã inteiro) / 1440 (dividido); nada importante abaixo de y ≈ 1500; CTA entre y 230 e 1450 |

## Pipeline

Ambiente: Chromium em `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
(exportar `REMOTION_BROWSER=` com esse caminho; o Remotion não consegue descarregar o seu). Modelos de voz
vêm das releases do GitHub (`k2-fsa/sherpa-onnx`); HuggingFace está bloqueado.

### 1. Preparar
```bash
cd remotion && npm install
cp VIDEO.mp4 public/original.mp4            # não vai para o git
pip install --break-system-packages sherpa-onnx numpy
```
Guarda o estado do vídeo anterior antes de mexer (ver tabela "Vídeos feitos" em `remotion/README.md`).

### 2. Analisar o vídeo
```bash
python3 ferramentas/analisar_video.py remotion/public/original.mp4 /tmp/analise
```
Vê as `frames_*.png` com o Read. Reporta: resolução (480p é fraco — avisa), jump cuts (vão para `CORTES` em
`src/tempo.ts`), loudness, enquadramento, o que tapa as mãos/cara, onde está o produto vs. zonas tapadas pela UI.

### 2a. Só áudio?
Se as frames forem pretas (vídeo só com voz), usar `MODO = "audio"` em `src/tempo.ts`: gráficos em ecrã inteiro
com cenas seguidas a cobrir o vídeo todo (a 1.ª cena é o gancho, com `entrada={false}`), avatar
(`public/avatar.png`, recorte da cara de uma frame de vídeo antigo) com anel a pulsar com a voz, legendas a y 1320
e onda de som. Voz: `ffmpeg -i public/original.mp4 -vn -af "highpass=f=75,equalizer=f=3500:t=q:w=1.2:g=2" -ar 48000 -ac 1 public/voz.wav`.
Exemplo completo: vídeo 2 (`videos/02-lucro-erro/NOTAS.md`).

### 2c. Enquadramento
Se o plano for largo (cara pequena), definir `ZOOM_BASE` e `ORIGEM_ZOOM` em `tempo.ts` para a cara ficar com
~460 px de altura e o topo da cabeça a y ≈ 350–380 (como no vídeo 1). Medir com uma frame e uma régua.

### 2b. Melhorar a imagem (se o vídeo for < 1080p)
IA de super-resolução (Real-ESRGAN general-x4v3, em ONNX no CPU, sem PyTorch) misturada 60/40 com o original
ampliado — 100 % IA deixa a pele "de plástico". ~7 s por frame em 4 núcleos: processar **só as frames usadas** na
montagem (correr depois do passo 4/`montar_curta.py`) e em background; é retomável.
```bash
python3 ferramentas/melhorar_video.py teste  remotion/public/original.mp4 7.5 /tmp/comparacao.png   # mostrar antes|depois
python3 -c "import json;s=json.load(open('remotion/src/montagem_curta.json'))['segmentos'];json.dump([[a,b] for a,b,_ in s],open('/tmp/iv.json','w'))"
python3 ferramentas/melhorar_video.py frames remotion/public/original.mp4 /tmp/frames_hd /tmp/iv.json
python3 ferramentas/melhorar_video.py montar remotion/public/original.mp4 /tmp/frames_hd remotion/public/original_hd.mp4
```
`VIDEO_BASE` em `src/tempo.ts` escolhe o vídeo de base. Voz: **medir antes** — com lapela a voz já é limpa
(~33 dB acima do ruído); redução de ruído + compressão pioraram-na. Só filtro de graves + presença.
Se o vídeo já for 1080p/4K, saltar este passo e pôr `VIDEO_BASE = "original.mp4"`.

### 3. Transcrever (tempo de cada palavra)
```bash
python3 ferramentas/transcrever.py remotion/public/original.mp4 transcricoes/
```
O texto vem do Whisper e os tempos do Parakeet. **Revê sempre**: termos de trading saem mal
("trades"→"trechos", "saldo"→"sal", "sobe e desce"→"sobe 10"). Em dúvidas, volta a passar só esse trecho
(3–5 s) pelos dois modelos. Corrige à mão em `transcricoes/transcricao_palavras.json` e copia para
`remotion/src/palavras.json` e `remotion/scripts/silencios.txt` (o `silencios.txt` gerado).

### 4. Planear (mostrar ao utilizador antes de construir se houver dúvidas)
- **Gancho** (frase por cima no 1.º frame) e **título da capa** (diferentes um do outro).
- **Mapa fala → gráfico**: para cada ideia, que gráfico mostra o que ele diz, com os tempos das palavras-gatilho.
- **Versão 45 s**: escolher frases inteiras em `scripts/montar_curta.py` (`FRASES`) — cortar ideias repetidas,
  manter mito → realidade → o que fazer → erro → como medir → fecho. Correr o script (encurta também pausas > 0,22 s).
- Janelas das cenas para a versão curta em `src/montagem.ts` (`CURTA.cenas`, tempos do vídeo original).
- Frase do CTA ligada ao tema; palavras-chave das legendas.

### 5. Construir
- Cada gráfico é um ficheiro em `src/cenas/`. Usa `const r = useRel(a)` e escreve os tempos **do vídeo original**
  (`r(21.27)`); a montagem converte sozinha para a versão curta.
- Reutiliza: `Cena` (rótulo + título com `<Ouro>`), `Etiqueta`, `Chip`, `Kicker`, `VelasSerie` (velas verde/vermelho
  a partir de uma série), `Curva` (linha a desenhar-se), `Efeito` (som que respeita a versão sem efeitos).
- Registar a cena no `CATALOGO` de `Video.tsx` e as janelas em `tempo.ts` (`CENAS`). Sons em `Sons.tsx` (`MOMENTOS`).
- Dados por vídeo: `tempo.ts` (modo, cenas, cortes, etiquetas), `Legendas.tsx` (`CHAVE`), `Sons.tsx` (`MOMENTOS`),
  `CTA.tsx` (`LINHA1/LINHA2/SUB`), `Capa.tsx` (`TITULO`), `Gancho.tsx` (modo câmara), `scripts/montar_curta.py` (`FRASES`).
- Menos texto por cena: ninguém lê uma tabela de 5 linhas em 3 s no telemóvel.
- Gancho em `src/Gancho.tsx`, CTA em `src/CTA.tsx`, capa em `src/Capa.tsx` (frame: `ffmpeg -ss T -i public/original.mp4 -frames:v 1 public/capa_frame.png`).

### 6. Verificar antes de renderizar tudo
```bash
npx remotion still Reel45 out/stills/x.png --frame=N --browser-executable=$REMOTION_BROWSER
```
Junta várias stills com `ffmpeg ... hstack` e vê-as. Procura: texto a sair de caixas, cartões a tapar a cara,
legenda em cima do queixo, quebras de linha feias, frame 0 legível (é a capa por defeito).

### 7. Renderizar
```bash
./scripts/render.sh Reel45              # → out/Reel45.mp4 (comprimido, −14 LUFS)
./scripts/render.sh Reel45SemEfeitos
npx remotion still Capa out/capa_reel.png --browser-executable=$REMOTION_BROWSER && ffmpeg -i out/capa_reel.png -q:v 2 out/capa_reel.jpg
```
Renders demoram ~4–5 min: correr em background e não ficar à espera com `sleep`.

### 8. Validar o resultado (obrigatório)
- **Nenhuma palavra cortada**: voltar a transcrever o áudio do `out/Reel45.mp4` e comparar com as frases escolhidas.
- **Sem estalos nos cortes**: nível no ponto de corte ≈ vizinhança (micro-fade de 2 frames já existe).
- **Efeitos no sítio certo**: renderizar só os efeitos
  `npx remotion render Reel45 out/so_efeitos.wav --codec=wav --props='{"versao":"curta","semVoz":true}'`
  e detetar os inícios de som vs. tempos esperados.
- Efeitos não podem tapar a voz (≥ ~6 dB abaixo nas palavras); loudness final −14 LUFS; duração e tamanho.
- Folha de frames do vídeo final (`fps=1/3,tile=8x2`) para revisão visual.

### 9. Entregar
`SendUserFile` com o vídeo (limite ~30 MB — o `render.sh` já comprime), capa em JPG. Commit + push no branch
de trabalho. Na resposta: o que mudou, o que verificaste, limitações, e a tua opinião honesta com próximos passos
(ex.: testar 2 versões com Trial Reels; ver retenção aos 3 s).

## Lições aprendidas
- Gravações podem acabar a meio (vídeo 3): cortar no último ponto limpo e, se faltar a conclusão, completá-la
  num gráfico só com números/ideias que o orador já disse — e dizer-lhe isso, oferecendo regravar a frase.
- O ASR pode pôr as últimas palavras dentro de um silêncio: confirmar com o nível de som e corrigir os tempos.
- Parakeet: tempos bons, texto fraco. Whisper: texto bom, sem tempos fiáveis. Usar os dois.
- Sons sintetizados "de interface" soam artificiais — preferir gravações reais (teclado: `public/sfx/teclado/`, MIT)
  ou síntese que imite o objeto real (clique de rato em `scripts/sintetizar_sfx.py`). Graves < 100 Hz não se ouvem no telemóvel.
- 92 efeitos num minuto foi demais; ele quis "menos". ~10–15 por vídeo chega.
- Música sintetizada por código não agradou — não voltar a tentar.
- Medir sempre em relação à voz e mostrar números (dB, LUFS, ms) quando reportar.
- Fontes vêm do npm (`@fontsource/*`), não do Google Fonts.
