import { createContext, useContext } from "react";
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_TEXTO, FONTE, MONO, SERIFA } from "./estilo";
import { f, MODO } from "./tempo";
import { useMontagem } from "./montagem";

/** Mola de entrada a começar no frame `inicio` (relativo à Sequence). */
export const useEntrada = (inicio: number, damping = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - inicio, fps, config: { damping, mass: 0.6 } });
};

/** Devolve uma função que converte um tempo do vídeo original (s) num frame relativo ao início da cena `a`,
 * já com os cortes da montagem aplicados. */
export const useRel = (a: number) => {
  const { mapa } = useMontagem();
  return (s: number) => f(mapa(s)) - f(mapa(a));
};

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
export const Cena: React.FC<{ kicker: string; titulo: React.ReactNode; cor?: string; entrada?: boolean; children: React.ReactNode }> = ({
  kicker,
  titulo,
  cor = COR.positivo,
  entrada = true, // false: já visível no frame 0 (gancho/capa)
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const op = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [entrada ? 0 : 1, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = entrada ? interpolate(frame, [0, 10], [40, 0], { extrapolateRight: "clamp" }) : 0;
  // motion blur leve na entrada e na saída da cena
  const desfoque = Math.max(
    entrada ? interpolate(frame, [0, 7], [8, 0], { extrapolateRight: "clamp" }) : 0,
    interpolate(frame, [durationInFrames - 7, durationInFrames], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <div style={{ position: "absolute", inset: 0, opacity: op, transform: `translateY(${y}px)`, filter: desfoque > 0.2 ? `blur(${desfoque}px)` : undefined, padding: "90px 70px 60px", fontFamily: FONTE }}>
      <Kicker cor={cor}>{kicker}</Kicker>
      <div style={{ color: COR.texto, fontFamily: SERIFA, fontWeight: 700, fontSize: 66, lineHeight: 1.08, marginTop: 18 }}>{titulo}</div>
      {/* no modo áudio o painel é mais alto: o conteúdo fica centrado na vertical */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, bottom: 70, ...(MODO === "audio" ? { display: "flex", flexDirection: "column", justifyContent: "center" } : {}) }}>
        <div>{children}</div>
      </div>
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

/** Liga/desliga todos os efeitos sonoros (a versão "sem efeitos" põe false). */
export const EfeitosContext = createContext(true);

/** Efeito sonoro a tocar a partir do frame `de` (relativo à Sequence onde está); não toca se os efeitos estiverem desligados. */
export const Efeito: React.FC<{ src: string; volume: number; de?: number }> = ({ src, volume, de = 0 }) => {
  if (!useContext(EfeitosContext)) return null;
  return (
    <Sequence from={de} layout="none">
      <Audio src={staticFile(src)} volume={volume} />
    </Sequence>
  );
};
