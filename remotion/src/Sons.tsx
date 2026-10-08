import { Audio, Sequence, staticFile } from "remotion";
import { f } from "./tempo";
import { useBlocos, useMontagem } from "./montagem";

type Som = [segundos: number, ficheiro: string, volume: number];

// Ganho global dos efeitos (0.5 ≈ −6 dB).
const GANHO = 0.5;

const ui = (nome: string) => `sfx/ui/${nome}.mp3`;
const sint = (nome: string) => `sfx/${nome}.wav`;
const fr = (n: number) => n / 30; // frames → segundos (para os atrasos das animações)

// Só os momentos-chave, em tempo do vídeo original (os que caem em trechos cortados não tocam).
const MOMENTOS: Som[] = [
  // Carimbo "NÃO EXISTE"
  [11.5, sint("impacto"), 0.2],
  // Checklist: um visto por item (6 frames depois de o item aparecer)
  ...[21.27, 24.19, 26.76].map((t): Som => [t, ui("check"), 0.6]),
  // "6 PERDAS SEGUIDAS"
  [45.36, ui("warning"), 0.55],
  // Conta a cair
  [53.6, sint("queda"), 0.22],
  // Saldo riscado
  [58.4, ui("invalid-drop"), 0.5],
  // 90% no plano
  [63.28, ui("achievement"), 0.5],
];
const ATRASO: Record<string, number> = { [ui("check")]: fr(6) };

export const Sons: React.FC = () => {
  const { dentro, mapa } = useMontagem();
  const blocos = useBlocos();
  const sons: Som[] = [
    // o painel de gráficos a entrar e a sair
    ...blocos.flatMap(([a, b]): Som[] => [[a - 0.36, sint("whoosh_in"), 0.4], [b - 0.25, sint("whoosh_out"), 0.35]]),
    ...MOMENTOS.filter(([t]) => dentro(t)).map(([t, ficheiro, v]): Som => [mapa(t) + (ATRASO[ficheiro] ?? 0), ficheiro, v]),
  ];
  return (
    <>
      {sons.map(([t, ficheiro, volume], i) => (
        <Sequence key={i} from={Math.max(0, f(t))} layout="none">
          <Audio src={staticFile(ficheiro)} volume={volume * GANHO} />
        </Sequence>
      ))}
    </>
  );
};
