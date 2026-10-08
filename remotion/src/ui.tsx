import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, FONTE } from "./estilo";
import { f } from "./tempo";

/** Mola de entrada a começar no frame `inicio` (relativo à Sequence). */
export const useEntrada = (inicio: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - inicio, fps, config: { damping, mass: 0.6 } });
};

/** Converte um tempo absoluto (s) num frame relativo ao início da cena `a`. */
export const rel = (a: number, s: number) => f(s) - f(a);

/** Envolve uma cena: fade/slide de entrada e saída + cabeçalho. */
export const Cena: React.FC<{ kicker: string; titulo: React.ReactNode; cor?: string; children: React.ReactNode }> = ({
  kicker,
  titulo,
  cor = COR.amarelo,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const op = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(frame, [0, 10], [40, 0], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translateY(${y}px)`, padding: "90px 70px 60px" }}>
      <div style={{ color: cor, fontWeight: 800, fontSize: 30, letterSpacing: 6 }}>{kicker}</div>
      <div style={{ color: COR.texto, fontWeight: 900, fontSize: 58, lineHeight: 1.1, marginTop: 14 }}>{titulo}</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, bottom: 70 }}>{children}</div>
    </div>
  );
};

/** Etiqueta com fundo escuro que entra com mola. */
export const Chip: React.FC<{ y: number; cor: string; texto: string }> = ({ y, cor, texto }) => {
  const s = useEntrada(0, 12);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${s})`,
          background: "rgba(11,15,23,0.92)",
          border: `3px solid ${cor}`,
          color: COR.texto,
          fontFamily: FONTE,
          fontWeight: 900,
          fontSize: 44,
          padding: "18px 34px",
          borderRadius: 22,
          boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

export const Etiqueta: React.FC<{ cor: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ cor, children, style }) => (
  <span
    style={{
      display: "inline-block",
      background: `${cor}22`,
      color: cor,
      border: `2px solid ${cor}`,
      borderRadius: 14,
      padding: "8px 18px",
      fontWeight: 800,
      fontSize: 30,
      ...style,
    }}
  >
    {children}
  </span>
);
