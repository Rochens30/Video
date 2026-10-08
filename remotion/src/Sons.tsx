import { Audio, Sequence, staticFile } from "remotion";
import { CENAS, f } from "./tempo";

type Som = [segundos: number, ficheiro: string, volume: number];

const ui = (nome: string) => `sfx/ui/${nome}.mp3`;
const sint = (nome: string) => `sfx/${nome}.wav`;
const fr = (n: number) => n / 30; // frames → segundos (para os atrasos das animações)
const serie = (inicio: number, n: number, passoFrames: number, ficheiro: (i: number) => string, volume: number): Som[] =>
  Array.from({ length: n }, (_, i) => [inicio + fr(i * passoFrames), ficheiro(i), volume]);

// Entradas/saídas do painel e trocas de cena dentro dele (ver blocos em Video.tsx).
const transicoes: Som[] = [
  [CENAS.expectativa[0] - 0.36, sint("whoosh_in"), 0.4],
  [CENAS.mensal[1] - 0.25, sint("whoosh_out"), 0.35],
  [CENAS.perdas[0] - 0.36, sint("whoosh_in"), 0.4],
  [CENAS.plano[1] - 0.25, sint("whoosh_out"), 0.35],
  ...(["realidade", "checklist", "diario", "mensal", "risco", "destruir", "saldo", "plano"] as const).map(
    (c): Som => [CENAS[c][0] - 0.1, sint("whoosh_curto"), 0.3],
  ),
];

// Cada som está alinhado com a animação correspondente em src/cenas/.
const SONS: Som[] = [
  ...transicoes,
  // Abertura
  [0.1, ui("snap"), 0.5],
  // Expectativa: barras a crescer, carimbo "NÃO EXISTE"
  ...serie(7.6, 6, 5, () => ui("progress-step"), 0.4),
  [10.8, ui("blocked"), 0.35],
  [11.5, sint("impacto"), 0.2],
  [11.5, ui("error"), 0.3],
  [12.25, ui("press"), 0.3],
  // Realidade
  [15.31, ui("toggle-on"), 0.45],
  [15.83, ui("toggle-off"), 0.45],
  [16.8, ui("success"), 0.5],
  // Checklist: um visto por item
  ...[21.27, 24.19, 26.76].map((t): Som => [t + fr(6), ui("check"), 0.6]),
  // Diário: linhas a entrar + confirmação
  ...serie(28.85, 5, 7, () => ui("press"), 0.35),
  [31.46, ui("reward"), 0.55],
  // Resultado mensal
  ...serie(33.76, 6, 4, () => ui("progress-step"), 0.35),
  [35.65, ui("notification"), 0.45],
  // Perdas: velas a aparecer, troca de estratégia, aviso
  ...serie(43.1, 13, 6, () => ui("typing"), 0.5),
  ...serie(43.12, 3, 14, () => ui("toggle-on"), 0.35),
  [45.36, ui("warning"), 0.55],
  // Risco a subir
  [47.84, sint("riser"), 0.45],
  [49.44, ui("error"), 0.45],
  // Conta a cair
  [53.6, sint("queda"), 0.22],
  [53.6, ui("delete"), 0.35],
  [53.6 + fr(26), ui("blocked"), 0.45],
  // Saldo a oscilar e riscado
  ...serie(56.4, 10, 6, () => ui("typing"), 0.25),
  [58.4, ui("invalid-drop"), 0.5],
  [58.4, sint("whoosh_curto"), 0.3],
  // Plano: 20 trades (2 fora do plano) e 90%
  ...serie(61.1, 20, 3, (i) => ui(i === 6 || i === 14 ? "error" : "progress-step"), 0.2),
  [63.28, ui("achievement"), 0.5],
  // Fecho
  [64.4, ui("achievement-cinematic"), 0.5],
];

export const Sons: React.FC = () => (
  <>
    {SONS.map(([t, ficheiro, volume], i) => (
      <Sequence key={i} from={Math.max(0, f(t))} layout="none">
        <Audio src={staticFile(ficheiro)} volume={volume} />
      </Sequence>
    ))}
  </>
);
