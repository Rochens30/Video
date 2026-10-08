import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_TEXTO, FONTE, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";

/** Mola de entrada a começar no frame `inicio` (relativo à Sequence). */
export const useEntrada = (inicio: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - inicio, fps, config: { damping, mass: 0.6 } });
};

/** Converte um tempo absoluto (s) num frame relativo ao início da cena `a`. */
export const rel = (a: number, s: number) => f(s) - f(a);

/** Ênfase no estilo do site: itálico com gradiente dourado (ou outra cor). */
export const Ouro: React.FC<{ children: React.ReactNode; cor?: string }> = ({ children, cor }) => (
  <span style={{ fontStyle: "italic", ...(cor ? { color: cor } : DOURADO_TEXTO) }}>{children}</span>
);

/** Rótulo pequeno do site: monoespaçado, maiúsculas, espaçado, com traço antes. */
export const Kicker: React.FC<{ cor?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ cor = COR.positivo, children, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, color: cor, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 7, ...style }}>
    <div style={{ width: 44, height: 2, background: cor, opacity: 0.8 }} />
    {children}
  </div>
);

/** Envolve uma cena: fade/slide de entrada e saída + cabeçalho. */
export const Cena: React.FC<{ kicker: string; titulo: React.ReactNode; cor?: string; children: React.ReactNode }> = ({
  kicker,
  titulo,
  cor = COR.positivo,
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
    <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translateY(${y}px)`, padding: "90px 70px 60px", fontFamily: FONTE }}>
      <Kicker cor={cor}>{kicker}</Kicker>
      <div style={{ color: COR.texto, fontFamily: SERIFA, fontWeight: 700, fontSize: 66, lineHeight: 1.08, marginTop: 18 }}>{titulo}</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, bottom: 70 }}>{children}</div>
    </div>
  );
};

/** Etiqueta em pílula com ponto, como "• À VENDA AGORA" no site; entra com mola. */
export const Chip: React.FC<{ y: number; cor: string; texto: string }> = ({ y, cor, texto }) => {
  const s = useEntrada(0, 12);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${s})`, display: "flex", alignItems: "center", gap: 16,
          background: "rgba(10,9,8,0.9)", border: `2px solid ${cor}88`, color: cor,
          fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4,
          padding: "18px 32px", borderRadius: 999, boxShadow: `0 12px 40px rgba(0,0,0,0.45), 0 0 30px ${cor}22`,
        }}
      >
        <div style={{ width: 12, height: 12, borderRadius: 6, background: cor }} />
        {texto}
      </div>
    </div>
  );
};

/** Etiqueta pequena em pílula (monoespaçada, maiúsculas). */
export const Etiqueta: React.FC<{ cor: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ cor, children, style }) => (
  <span
    style={{
      display: "inline-block",
      background: `${cor}1f`,
      color: cor,
      border: `2px solid ${cor}99`,
      borderRadius: 999,
      padding: "8px 22px",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: 3,
      ...style,
    }}
  >
    {children}
  </span>
);
