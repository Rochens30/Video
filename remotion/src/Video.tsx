import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/jetbrains-mono/700.css";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CENAS, CORTES, f } from "./tempo";
import { COR, FONTE } from "./estilo";
import { Legendas } from "./Legendas";
import { Sons } from "./Sons";
import { Chip } from "./ui";
import { Expectativa } from "./cenas/Expectativa";
import { Realidade } from "./cenas/Realidade";
import { Checklist } from "./cenas/Checklist";
import { Diario } from "./cenas/Diario";
import { Mensal } from "./cenas/Mensal";
import { Perdas } from "./cenas/Perdas";
import { Risco } from "./cenas/Risco";
import { Destruir } from "./cenas/Destruir";
import { Saldo } from "./cenas/Saldo";
import { Plano } from "./cenas/Plano";

const PAINEL = 860; // altura do painel de gráficos no modo dividido
const DESCE = 540; // quanto o orador desce no modo dividido
const TRANS = 12; // frames da transição

// Junta cenas seguidas num só bloco para o painel não fechar e reabrir entre elas.
const blocos = (() => {
  const xs = Object.values(CENAS).map(([a, b]) => [a, b]).sort((p, q) => p[0] - q[0]);
  const out: number[][] = [];
  for (const [a, b] of xs) {
    const ult = out[out.length - 1];
    if (ult && a - ult[1] < 0.3) ult[1] = Math.max(ult[1], b);
    else out.push([a, b]);
  }
  return out;
})();

const useDivisao = () => {
  const frame = useCurrentFrame();
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  return Math.max(
    0,
    ...blocos.map(([a, b]) =>
      interpolate(frame, [f(a) - TRANS / 2, f(a) + TRANS / 2, f(b) - TRANS / 2, f(b) + TRANS / 2], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease,
      }),
    ),
  );
};

const Orador: React.FC<{ divisao: number }> = ({ divisao }) => {
  const frame = useCurrentFrame();
  // Zoom alternado (100% / 112%) a cada jump cut, ancorado na cara.
  const segmento = CORTES.filter((c) => frame >= f(c)).length;
  const zoom = interpolate(divisao, [0, 1], [segmento % 2 ? 1.12 : 1, 1]);
  return (
    <AbsoluteFill style={{ transform: `translateY(${divisao * DESCE}px) scale(${zoom})`, transformOrigin: "50% 30%" }}>
      <OffthreadVideo src={staticFile("original.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

const cenas: [keyof typeof CENAS, React.FC<{ a: number }>][] = [
  ["expectativa", Expectativa],
  ["realidade", Realidade],
  ["checklist", Checklist],
  ["diario", Diario],
  ["mensal", Mensal],
  ["perdas", Perdas],
  ["risco", Risco],
  ["destruir", Destruir],
  ["saldo", Saldo],
  ["plano", Plano],
];

export const Video: React.FC = () => {
  const frame = useCurrentFrame();
  const divisao = useDivisao();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo, fontFamily: FONTE }}>
      <Orador divisao={divisao} />

      {/* Painel de gráficos */}
      <AbsoluteFill
        style={{
          height: PAINEL,
          transform: `translateY(${(divisao - 1) * (PAINEL + 60)}px)`,
          background: `radial-gradient(120% 90% at 50% 0%, #172033 0%, ${COR.fundo} 70%)`,
          borderBottomLeftRadius: 56,
          borderBottomRightRadius: 56,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        <Grelha />
        {cenas.map(([nome, Cena]) => {
          const [a, b] = CENAS[nome];
          return (
            <Sequence key={nome} from={f(a)} durationInFrames={f(b) - f(a)} layout="none">
              <Cena a={a} />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Títulos de abertura e fecho, por cima da parede */}
      <Sequence from={f(0.1)} durationInFrames={f(4.8)} layout="none">
        <Chip y={150} cor={COR.amarelo} texto="CONSISTÊNCIA ≠ GANHAR SEMPRE" />
      </Sequence>
      <Sequence from={f(64.4)} layout="none">
        <Chip y={150} cor={COR.verde} texto="CONSISTÊNCIA = SEGUIR O PLANO" />
      </Sequence>

      <Legendas divisao={divisao} />
      <BarraProgresso frame={frame} />
      <Sons />
    </AbsoluteFill>
  );
};

const Grelha: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${COR.linha}55 1px, transparent 1px), linear-gradient(90deg, ${COR.linha}55 1px, transparent 1px)`,
      backgroundSize: "60px 60px",
      maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
    }}
  />
);

const BarraProgresso: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      height: 8,
      width: `${(frame / f(67.25)) * 100}%`,
      background: `linear-gradient(90deg, ${COR.verde}, ${COR.amarelo})`,
    }}
  />
);
