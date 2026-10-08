import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, FONTE, SERIFA } from "./estilo";
import { f, INTRO } from "./tempo";
import { Kicker, Ouro, useEntrada } from "./ui";

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
    <AbsoluteFill style={{ background: `radial-gradient(90% 55% at 50% 42%, #24140F 0%, ${COR.fundo} 70%)`, fontFamily: FONTE }}>
      <AbsoluteFill style={{ transform: `scale(${saida}) translateX(${treme}px)`, opacity: opSaida }}>
        <Velas frame={frame} />
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: t1 }}>
          <Kicker cor={COR.positivo}>FOREX ACADEMY CLUB</Kicker>
        </div>
        <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", opacity: t1 }}>
          <span style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 84, color: COR.negativo }}>{Math.round(saldo).toLocaleString("pt-PT")} €</span>
          <span style={{ fontFamily: SERIFA, fontStyle: "italic", fontSize: 50, color: COR.negativo, marginLeft: 18 }}>−{(100 - saldo / 100).toFixed(1)}%</span>
        </div>
        <div style={{ position: "absolute", top: 720, left: 60, right: 60, textAlign: "center" }}>
          <div
            style={{
              color: COR.texto, fontFamily: SERIFA, fontWeight: 900, fontSize: 128, lineHeight: 1.0, transform: `scale(${0.6 + 0.4 * t1})`,
              opacity: frame < FRASE2 ? 1 : interpolate(frame, [FRASE2, FRASE2 + 5], [1, 0.22], { extrapolateRight: "clamp" }),
            }}
          >
            Perdeste<br /><Ouro cor={COR.negativo}>este mês?</Ouro>
          </div>
          <div style={{ marginTop: 56, opacity: t2, transform: `translateY(${(1 - t2) * 60}px)`, fontFamily: SERIFA, fontWeight: 700, fontSize: 70, lineHeight: 1.12, color: COR.texto }}>
            Isso não quer dizer que<br /><Ouro>não és consistente.</Ouro>
          </div>
        </div>
      </AbsoluteFill>
      <Sequence layout="none"><Audio src={staticFile("sfx/impacto.wav")} volume={0.18} /></Sequence>
      <Sequence from={fim - 10} layout="none"><Audio src={staticFile("sfx/whoosh_in.wav")} volume={0.2} /></Sequence>
    </AbsoluteFill>
  );
};

// Velas vermelhas a cair ao fundo
const Velas: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.28 }}>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 40 + i * 88;
      const topo = 560 + i * 70 + Math.sin(i * 1.7) * 40;
      const h = 120 + (i % 3) * 40;
      const s = Math.min(1, Math.max(0, (frame - i * 1.5) / 6));
      return (
        <g key={i} opacity={s}>
          <line x1={x + 25} x2={x + 25} y1={topo - 40} y2={topo + h + 40} stroke={COR.negativo} strokeWidth={5} />
          <rect x={x} y={topo} width={50} height={h * s} rx={6} fill={COR.negativo} />
        </g>
      );
    })}
  </svg>
);
