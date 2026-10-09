import { Efeito } from "./ui";
import { f } from "./tempo";
import { useBlocos, useMontagem } from "./montagem";
import { MODO } from "./tempo";
import { HABITO_TRADES } from "./cenas/Habito";

type Som = [segundos: number, ficheiro: string, volume: number];

// Ganho global dos efeitos (0.5 ≈ −6 dB).
const GANHO = 0.5;

const ui = (nome: string) => `sfx/ui/${nome}.mp3`;
const sint = (nome: string) => `sfx/${nome}.wav`;
const fr = (n: number) => n / 30; // frames → segundos (para os atrasos das animações)

const clique = (i: number) => sint(`clique_rato_${(i % 2) + 1}`);
const tecla = (i: number) => `sfx/teclado/tecla_${(i * 3) % 5}.mp3`; // varia a tecla para não soar a loop (diários/tabelas)

// Momentos-chave do vídeo atual, em tempo do ficheiro original (os que caem em trechos cortados não tocam).
// Vídeos anteriores: ver o histórico do git (videos/NN-*/NOTAS.md).
const MOMENTOS: Som[] = [
  // Anatomia da trade: um clique por linha (entrada, stop, take profit)
  [8.72, clique(0), 0.55],
  [12.48, clique(1), 0.55],
  [13.92, clique(0), 0.55],
  // "no papel" ✓ / "na prática" ✕
  [29.44, clique(1), 0.5],
  [32.08, ui("invalid-drop"), 0.45],
  // "sem se aperceber"
  [43.36, ui("warning"), 0.45],
  // 10 trades a entrar na grelha: teclado
  ...Array.from({ length: 10 }, (_, i): Som => [53.55 + fr(i * 2), tecla(i), 0.4]),
  // "4 são perdas"
  [62.82, ui("warning"), 0.5],
  // "+3R"
  [69.85, clique(0), 0.55],
];


export const Sons: React.FC = () => {
  const { dentro, mapa } = useMontagem();
  const blocos = useBlocos();
  const sons: Som[] = [
    // o painel de gráficos a entrar e a sair (só no modo câmara; no modo áudio está sempre no ecrã)
    ...(MODO === "audio" ? [] : blocos).flatMap(([a, b]): Som[] => [[a - 0.36, sint("whoosh_in"), 0.4], [b - 0.25, sint("whoosh_out"), 0.35]]),
    ...MOMENTOS.filter(([t]) => dentro(t)).map(([t, ficheiro, v]): Som => [mapa(t), ficheiro, v]),
  ];
  return (
    <>
      {sons.map(([t, ficheiro, volume], i) => (
        <Efeito key={i} src={ficheiro} volume={volume * GANHO} de={Math.max(0, f(t))} />
      ))}
    </>
  );
};
