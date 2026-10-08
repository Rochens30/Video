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

/** Gráfico de velas a partir de uma série (0..1): cada passo vira uma vela verde (sobe) ou vermelha (desce).
 * As velas aparecem uma a uma entre os frames `de` e `ate`. */
export const VelasSerie: React.FC<{ vals: number[]; w: number; h: number; de: number; ate: number; verde: string; vermelho: string }> = ({
  vals, w, h, de, ate, verde, vermelho,
}) => {
  const frame = useCurrentFrame();
  const n = vals.length - 1;
  const passo = w / n;
  const larg = passo * 0.58;
  const y = (v: number) => (1 - v) * h;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      {Array.from({ length: n }, (_, i) => {
        const o = vals[i], c = vals[i + 1];
        const sobe = c >= o;
        const cor = sobe ? verde : vermelho;
        const amp = Math.abs(c - o);
        const max = Math.max(o, c) + 0.04 + amp * 0.25, min = Math.min(o, c) - 0.04 - amp * 0.2;
        const ini = de + ((ate - de) * i) / n;
        const s = interpolate(frame, [ini, ini + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const x = i * passo + (passo - larg) / 2;
        const topo = y(Math.max(o, c)), base = y(Math.min(o, c));
        const meio = (topo + base) / 2;
        return (
          <g key={i} opacity={s} transform={`translate(0 ${meio}) scale(1 ${s}) translate(0 ${-meio})`}>
            <line x1={x + larg / 2} x2={x + larg / 2} y1={y(max)} y2={y(min)} stroke={cor} strokeWidth={4} />
            <rect x={x} y={topo} width={larg} height={Math.max(6, base - topo)} rx={5} fill={cor} />
          </g>
        );
      })}
    </svg>
  );
};
