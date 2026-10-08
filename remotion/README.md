# Vídeo "Consistência" em Remotion

Vídeo vertical (1080×1920) com o tema visual de forexacademyclub.com (preto quente, dourado, Playfair Display + Manrope), com a estrutura **intro com gancho (2,8 s) → vídeo principal → call to action (6 s)**:
- legendas palavra a palavra (palavras-chave em itálico dourado), a partir de `src/palavras.json`;
- zoom alternado (100% / 112%) em cada jump cut do vídeo original;
- 10 cenas de motion graphics de trading, sincronizadas com a fala (`src/cenas/`);
- ecrã dividido: o gráfico desce por cima e o orador desce para a metade de baixo;
- poucos efeitos sonoros, só nos momentos-chave (`src/Sons.tsx`);
- intro com gancho (`src/Intro.tsx`) e call to action para homepage.forexacademyclub.com (`src/CTA.tsx`).

## Duas versões

| Composição | Duração | O que muda |
|---|---|---|
| `Consistencia` | ~75 s | intro em ecrã próprio, vídeo inteiro |
| `Consistencia45` | ~45 s | gancho por cima do orador desde o 1.º frame, frases repetidas cortadas, pausas longas encurtadas |
| `Consistencia45SemEfeitos` | ~45 s | igual, sem nenhum efeito sonoro (só a voz) |
| `Capa` (imagem) | — | capa do Reel 1080×1920; título e logótipo dentro do recorte 3:4 da grelha |

Os cortes da versão curta são gerados por `scripts/montar_curta.py` (→ `src/montagem_curta.json`); legendas, gráficos e sons são convertidos automaticamente para a nova linha temporal (`src/montagem.ts`).

## Como usar

```bash
npm install
cp /caminho/para/o/video.mp4 public/original.mp4   # o vídeo não está no git
ffmpeg -ss 7.5 -i public/original.mp4 -frames:v 1 public/capa_frame.png   # frame usada na capa
npm run studio      # pré-visualizar e afinar no browser
./scripts/render.sh Consistencia45   # render + áudio a −14 LUFS → out/Consistencia45.mp4
npx remotion still Capa out/capa_reel.png
```

## Onde mexer

| O quê | Ficheiro |
|---|---|
| Início/fim de cada cena gráfica | `src/tempo.ts` (`CENAS`) |
| Tempos dos jump cuts (zoom) | `src/tempo.ts` (`CORTES`) |
| Cores e fontes (tema do site) | `src/estilo.ts` |
| Palavras destacadas a amarelo | `src/Legendas.tsx` (`CHAVE`) |
| Cada gráfico | `src/cenas/*.tsx` |
| Efeitos sonoros (momento, som, volume) | `src/Sons.tsx` (`GANHO` = volume global) |
| Texto do gancho | `src/Intro.tsx` (versão longa), `src/Gancho.tsx` (versão curta) |
| Texto e animação do CTA | `src/CTA.tsx` |
| Duração da intro/CTA | `src/tempo.ts`, `src/Final.tsx` (`CONFIG`) |
| Frases que entram na versão curta | `scripts/montar_curta.py` (`FRASES`) |

## Efeitos sonoros

- `public/sfx/*.wav` (whoosh, impacto, queda, clique de rato): sintetizados de raiz por `scripts/sintetizar_sfx.py`, sem direitos de terceiros.
- `public/sfx/teclado/*.mp3`: gravações reais de teclado mecânico (Holy Panda) do projeto [kbsim](https://github.com/tplai/kbsim), licença MIT (ver `public/sfx/teclado/`).
- `public/sfx/ui/*.mp3`: pacote [uisfx](https://github.com/romainsimon/uisfx) (licença MIT, ver `public/sfx/ui/LICENSE-uisfx.txt`).

Os números nos gráficos (trades, saldos, percentagens) são **exemplos ilustrativos**, não são dados reais.

> Licença: o Remotion é gratuito para uso individual e empresas até 3 pessoas; empresas maiores precisam de licença (remotion.pro).
