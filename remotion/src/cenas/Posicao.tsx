import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";
import { VelasSerie } from "./graficos";

const VALS = [0.3, 0.38, 0.33, 0.44, 0.4, 0.5, 0.47, 0.52];

/** "Quando entramos numa trade, temos sempre o nosso risco, que é o R, temos o Stop Loss e temos o Take Profit." */
export const Posicao: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const entrada = useEntrada(r(8.72));
  const risco = useEntrada(r(10.32));
  const sl = interpolate(frame, [r(12.48), r(12.48) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tp = interpolate(frame, [r(13.92), r(13.92) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const X0 = 430, Y_ENT = 240, ALT = 175; // caixa da posição (1R para cada lado)
  return (
    <Cena kicker="ANATOMIA DE UMA TRADE" titulo={<>Risco, Stop e <Ouro>Take Profit</Ouro></>}>
      <div style={{ position: "relative", height: 480 }}>
        <div style={{ position: "absolute", left: 0, top: 120 }}>
          <VelasSerie vals={VALS} w={400} h={260} de={0} ate={12} verde={COR.ganho} vermelho={COR.negativo} />
        </div>
        <svg width={940} height={480} style={{ position: "absolute", inset: 0 }}>
          {/* Take Profit (+1R) */}
          <rect x={X0} y={Y_ENT - ALT * tp} width={480} height={ALT * tp} fill={`${COR.ganho}33`} stroke={COR.ganho} strokeWidth={tp > 0 ? 3 : 0} />
          {/* Stop Loss (−1R) */}
          <rect x={X0} y={Y_ENT} width={480} height={ALT * sl} fill={`${COR.negativo}33`} stroke={COR.negativo} strokeWidth={sl > 0 ? 3 : 0} />
          {/* entrada */}
          <line x1={X0 - 20} x2={X0 - 20 + 520 * entrada} y1={Y_ENT} y2={Y_ENT} stroke={COR.destaque} strokeWidth={5} strokeDasharray="14 10" />
        </svg>
        <Rotulo x={X0 + 20} y={Y_ENT - 52} s={entrada} cor={COR.destaque} texto="ENTRADA" />
        <Rotulo x={X0 + 20} y={Y_ENT + 30} s={risco} cor={COR.negativo} texto="RISCO = 1R" grande />
        <Rotulo x={X0 + 20} y={Y_ENT + ALT + 14} s={sl} cor={COR.negativo} texto="STOP LOSS  −1R" />
        <Rotulo x={X0 + 20} y={Y_ENT - ALT - 52} s={tp} cor={COR.ganho} texto="TAKE PROFIT  +1R" />
      </div>
    </Cena>
  );
};

const Rotulo: React.FC<{ x: number; y: number; s: number; cor: string; texto: string; grande?: boolean }> = ({ x, y, s, cor, texto, grande }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: s, transform: `translateX(${(1 - s) * 30}px)`, fontFamily: MONO, fontWeight: 700,
    fontSize: grande ? 34 : 26, letterSpacing: 3, color: cor, background: "rgba(10,9,8,0.75)", padding: "4px 12px", borderRadius: 10 }}>
    {texto}
  </div>
);
