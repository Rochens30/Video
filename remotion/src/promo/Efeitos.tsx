import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// pseudo-aleatório determinístico (o render é feito em paralelo, frame a frame)
export const ruido = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Grão de filme: 4 texturas em rotação, com deslocamento aleatório por frame. */
export const Grao: React.FC<{ opacidade?: number }> = ({ opacidade = 0.08 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile(`fx/grao_${frame % 4}.png`)})`,
        backgroundSize: "540px 960px",
        backgroundPosition: `${Math.round(ruido(frame) * 540)}px ${Math.round(ruido(frame + 99) * 960)}px`,
        opacity: opacidade,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

export const Vinheta: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
);

/** Flash branco a partir de cada frame da lista. */
export const Flashes: React.FC<{ em: number[] }> = ({ em }) => {
  const frame = useCurrentFrame();
  const op = Math.max(0, ...em.map((a) => interpolate(frame - a, [0, 1, 7], [0.9, 0.75, 0], clamp) * (frame >= a ? 1 : 0)));
  if (op <= 0) return null;
  return <AbsoluteFill style={{ background: "#FFF8EC", opacity: op }} />;
};

/** Fuga de luz quente (light leak) a atravessar o ecrã, em modo "screen". */
export const Fugas: React.FC<{ em: number[] }> = ({ em }) => {
  const frame = useCurrentFrame();
  const DUR = 26;
  const a = em.find((x) => frame >= x && frame < x + DUR);
  if (a === undefined) return null;
  const p = (frame - a) / DUR;
  const op = Math.sin(p * Math.PI) * 0.75;
  const x = interpolate(p, [0, 1], [-20, 110]);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: op,
        background: `radial-gradient(40% 55% at ${x}% 30%, rgba(255,170,70,0.95) 0%, rgba(255,120,40,0.35) 45%, rgba(0,0,0,0) 75%),
          radial-gradient(30% 40% at ${x + 25}% 75%, rgba(255,214,140,0.7) 0%, rgba(0,0,0,0) 70%)`,
      }}
    />
  );
};

/** Tremor de câmara depois de cada impacto (frames). Devolve o transform a aplicar. */
export const useTremor = (em: number[]) => {
  const frame = useCurrentFrame();
  let dx = 0;
  let dy = 0;
  let amp = 0;
  for (const a of em) {
    const d = frame - a;
    if (d < 0 || d >= 12) continue;
    const k = 22 * (1 - d / 12) ** 2;
    dx += k * Math.sin(d * 2.7 + a);
    dy += k * Math.cos(d * 3.3 + a * 0.7);
    amp = Math.max(amp, k);
  }
  return amp > 0 ? `translate(${dx}px, ${dy}px) scale(${1 + amp / 400})` : undefined;
};

/** Filtro SVG de separação RGB (glitch). Usar com filter: url(#rgb). */
export const FiltroRGB: React.FC<{ d: number }> = ({ d }) => (
  <svg width={0} height={0} style={{ position: "absolute" }}>
    <defs>
      <filter id="rgb" x="-5%" y="0%" width="110%" height="100%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
        <feOffset in="r" dx={d} dy={0} result="r2" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
        <feOffset in="b" dx={-d} dy={0} result="b2" />
        <feBlend in="r2" in2="g" mode="screen" result="rg" />
        <feBlend in="rg" in2="b2" mode="screen" />
      </filter>
    </defs>
  </svg>
);
