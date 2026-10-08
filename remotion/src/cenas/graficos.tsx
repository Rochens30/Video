import { interpolate, useCurrentFrame } from "remotion";

/** Constrói um path SVG a partir de valores (0..1, 1 = topo). */
export const caminho = (vals: number[], w: number, h: number) =>
  vals.map((v, i) => `${i ? "L" : "M"}${((i / (vals.length - 1)) * w).toFixed(1)},${((1 - v) * h).toFixed(1)}`).join(" ");

/** Linha que se desenha entre os frames `de` e `ate`, com área preenchida por baixo. */
export const Curva: React.FC<{ vals: number[]; w: number; h: number; de: number; ate: number; cor: string; espessura?: number }> = ({
  vals, w, h, de, ate, cor, espessura = 8,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [de, ate], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = caminho(vals, w, h);
  const id = `g${cor.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={cor} stopOpacity={0.35} />
          <stop offset="100%" stopColor={cor} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <rect x={0} y={-20} width={w * p} height={h + 40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <path d={`${d} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
        <path d={d} fill="none" stroke={cor} strokeWidth={espessura} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Ponto (0..1) na curva para o progresso p. */
export const pontoEm = (vals: number[], p: number) => {
  const x = p * (vals.length - 1);
  const i = Math.min(vals.length - 2, Math.floor(x));
  return { x: p, y: vals[i] + (vals[i + 1] - vals[i]) * (x - i) };
};
