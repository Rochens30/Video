import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

/** "Isto foi sorte, não foi competência." */
export const Sorte: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const sorte = useEntrada(r(6.72), 10);
  const comp = useEntrada(r(7.36));
  const risco = interpolate(frame, [r(7.76), r(7.76) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Cena kicker="PORQUE CORREU BEM" titulo={<>Foi <Ouro>sorte</Ouro>,<br />não competência</>}>
      <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
        <div
          style={{
            flex: 1, height: 330, borderRadius: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, #1C1810, #100E0B)", border: `3px solid ${COR.destaque}`, transform: `scale(${0.85 + 0.15 * sorte})`,
            opacity: sorte, boxShadow: `0 0 60px rgba(232,200,115,${0.25 * sorte})`,
          }}
        >
          <Dado />
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontStyle: "italic", fontSize: 72, color: COR.destaque, marginTop: 20 }}>Sorte</div>
        </div>
        <div
          style={{
            position: "relative", flex: 1, height: 330, borderRadius: 28, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(180deg, #16130E, #100E0B)", border: "2px solid #2A251A", opacity: comp * (1 - 0.45 * risco),
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 6, color: COR.suave }}>MÉTODO</div>
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 60, color: COR.texto, marginTop: 20 }}>Competência</div>
          <svg width={420} height={330} style={{ position: "absolute", inset: 0, margin: "auto" }}>
            <line x1={30} y1={300} x2={30 + 360 * risco} y2={300 - 270 * risco} stroke={COR.negativo} strokeWidth={14} strokeLinecap="round" opacity={risco > 0 ? 1 : 0} />
          </svg>
        </div>
      </div>
    </Cena>
  );
};

const Dado: React.FC = () => (
  <svg width={110} height={110} viewBox="0 0 110 110">
    <rect x={6} y={6} width={98} height={98} rx={20} fill="none" stroke={COR.destaque} strokeWidth={6} />
    {[[32, 32], [78, 32], [55, 55], [32, 78], [78, 78]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={8} fill={COR.destaque} />)}
  </svg>
);
