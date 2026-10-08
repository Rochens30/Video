import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, FONTE, MONO } from "./estilo";
import { f, INTRO } from "./tempo";
import { useEntrada } from "./ui";

// Gancho: dor reconhecível → reviravolta que só o vídeo explica.
const FRASE2 = f(1.25);

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const fim = f(INTRO);
  const t1 = useEntrada(0, 9);
  const t2 = useEntrada(FRASE2, 10);
  const saida = interpolate(frame, [fim - 6, fim], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opSaida = interpolate(frame, [fim - 6, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const treme = frame < 8 ? Math.sin(frame * 3) * (8 - frame) * 2 : 0;
  const saldo = interpolate(frame, [0, FRASE2], [10000, 8740], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 50% 40%, #2a0f12 0%, ${COR.fundo} 70%)`, fontFamily: FONTE }}>
      <AbsoluteFill style={{ transform: `scale(${saida}) translateX(${treme}px)`, opacity: opSaida }}>
        <Velas frame={frame} />
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 64, color: COR.vermelho, opacity: t1 }}>
            {Math.round(saldo).toLocaleString("pt-PT")} € <span style={{ fontSize: 44 }}>▼ {(100 - saldo / 100).toFixed(1)}%</span>
          </div>
        </div>
        <div style={{ position: "absolute", top: 760, left: 60, right: 60, textAlign: "center" }}>
          <div style={{ color: COR.texto, fontWeight: 900, fontSize: 104, lineHeight: 1.05, transform: `scale(${0.6 + 0.4 * t1})`,
            opacity: frame < FRASE2 ? 1 : interpolate(frame, [FRASE2, FRASE2 + 5], [1, 0.25], { extrapolateRight: "clamp" }),
            WebkitTextStroke: "10px #000", paintOrder: "stroke fill" }}>
            PERDESTE<br />ESTE MÊS?
          </div>
          <div style={{ marginTop: 50, opacity: t2, transform: `translateY(${(1 - t2) * 60}px)`, fontWeight: 900, fontSize: 64, lineHeight: 1.15, color: COR.texto }}>
            Isso <span style={{ color: COR.amarelo }}>não</span> quer dizer que<br />não és <span style={{ color: COR.verde }}>consistente</span>.
          </div>
        </div>
      </AbsoluteFill>
      <Sequence layout="none"><Audio src={staticFile("sfx/impacto.wav")} volume={0.18} /></Sequence>
      <Sequence from={FRASE2 - 2} layout="none"><Audio src={staticFile("sfx/whoosh_curto.wav")} volume={0.18} /></Sequence>
      <Sequence from={fim - 10} layout="none"><Audio src={staticFile("sfx/whoosh_in.wav")} volume={0.2} /></Sequence>
    </AbsoluteFill>
  );
};

// Velas vermelhas a cair ao fundo
const Velas: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.35 }}>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 40 + i * 88;
      const topo = 450 + i * 70 + Math.sin(i * 1.7) * 40;
      const h = 120 + (i % 3) * 40;
      const s = Math.min(1, Math.max(0, (frame - i * 1.5) / 6));
      return (
        <g key={i} opacity={s}>
          <line x1={x + 25} x2={x + 25} y1={topo - 40} y2={topo + h + 40} stroke={COR.vermelho} strokeWidth={5} />
          <rect x={x} y={topo} width={50} height={h * s} rx={6} fill={COR.vermelho} />
        </g>
      );
    })}
  </svg>
);
