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
  // cortes rápidos para o B-roll da sala no gancho
  [6.06, sint("whoosh_in"), 0.25],
  [6.91, sint("whoosh_in"), 0.25],
  // "+100 traders"
  [11.1, sint("impacto"), 0.15],
  // percurso: perder → profissional
  [20.16, clique(0), 0.5],
  // o que vais aprender: um clique por tema
  ...[22.32, 24.16, 28.0, 30.52, 33.08, 36.28].map((t, i): Som => [t, clique(i), 0.5]),
  // "Comenta 'evento'"
  [42.83, clique(1), 0.5],
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
