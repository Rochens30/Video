import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/900-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { CENAS, CORTES, f } from "./tempo";
import { COR, DOURADO_GRADIENTE, FONTE } from "./estilo";
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
          background: `radial-gradient(120% 90% at 50% 0%, #221C10 0%, ${COR.fundo} 70%)`,
          borderBottomLeftRadius: 48,
          borderBottomRightRadius: 48,
          borderBottom: "2px solid rgba(217,180,90,0.45)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 10px 60px rgba(217,180,90,0.12)",
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
        <Chip y={230} cor={COR.positivo} texto="CONSISTÊNCIA ≠ GANHAR SEMPRE" />
      </Sequence>
      <Sequence from={f(64.4)} layout="none">
        <Chip y={230} cor={COR.positivo} texto="CONSISTÊNCIA = SEGUIR O PLANO" />
      </Sequence>

      <Legendas divisao={divisao} />
      <BarraProgresso frame={frame} />
      <Sons />
    </AbsoluteFill>
  );
};

// Velas douradas muito ténues ao fundo, como no hero do site.
const Grelha: React.FC = () => (
  <svg width={1080} height={860} style={{ position: "absolute", opacity: 0.08 }}>
    {Array.from({ length: 34 }, (_, i) => {
      const x = 10 + i * 32;
      const meio = 560 + Math.sin(i * 0.55) * 60 + Math.sin(i * 1.9) * 25;
      const h = 14 + ((i * 37) % 30);
      return (
        <g key={i}>
          <line x1={x + 7} x2={x + 7} y1={meio - h - 14} y2={meio + h + 14} stroke="#D9B45A" strokeWidth={2} />
          <rect x={x} y={meio - h} width={14} height={h * 2} fill="#D9B45A" />
        </g>
      );
    })}
  </svg>
);

const BarraProgresso: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      height: 8,
      width: `${(frame / f(67.25)) * 100}%`,
      background: DOURADO_GRADIENTE,
    }}
  />
);
