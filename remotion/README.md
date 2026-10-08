# Vídeo "Consistência" em Remotion

Vídeo vertical (1080×1920) com o tema visual de forexacademyclub.com (preto quente, dourado, Playfair Display + Manrope), com a estrutura **intro com gancho (2,8 s) → vídeo principal → call to action (6 s)**:
- legendas palavra a palavra (palavras-chave a amarelo), a partir de `src/palavras.json`;
- zoom alternado (100% / 112%) em cada jump cut do vídeo original;
- 10 cenas de motion graphics de trading, sincronizadas com a fala (`src/cenas/`);
- ecrã dividido: o gráfico desce por cima e o orador desce para a metade de baixo;
- poucos efeitos sonoros, só nos momentos-chave (`src/Sons.tsx`);
- intro com gancho (`src/Intro.tsx`) e call to action para homepage.forexacademyclub.com (`src/CTA.tsx`).

## Como usar

```bash
npm install
cp /caminho/para/o/video.mp4 public/original.mp4   # o vídeo não está no git
npm run studio      # pré-visualizar e afinar no browser
./scripts/render.sh  # render + áudio normalizado a −14 LUFS → out/consistencia_final.mp4
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
| Texto do gancho | `src/Intro.tsx` |
| Texto e animação do CTA (browser a carregar até 99%) | `src/CTA.tsx` |
| Duração da intro/CTA | `src/tempo.ts` |

## Efeitos sonoros

- `public/sfx/*.wav` (whoosh, impacto, queda): sintetizados de raiz por `scripts/sintetizar_sfx.py`, sem direitos de terceiros.
- `public/sfx/ui/*.mp3`: pacote [uisfx](https://github.com/romainsimon/uisfx) (licença MIT, ver `public/sfx/ui/LICENSE-uisfx.txt`).

Os números nos gráficos (trades, saldos, percentagens) são **exemplos ilustrativos**, não são dados reais.

> Licença: o Remotion é gratuito para uso individual e empresas até 3 pessoas; empresas maiores precisam de licença (remotion.pro).
