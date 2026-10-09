import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

/** "Olhe para estes números. 10 trades. 6 são lucrativas, só que fechas a meio caminho… 4 são perdas… ganhámos 3R." */
export const Numeros: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const t10 = r(53.55), tGanhos = r(55.07), tMeio = r(57.76), tPerdas = r(62.82), tSoma = r(69.85);
  const meio = interpolate(frame, [tMeio, r(59.68)], [1, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const soma = useEntrada(tSoma, 11);
  return (
    <Cena kicker="10 TRADES · 60% DE ACERTO" titulo={<>Olha para <Ouro>estes números</Ouro></>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <Trade key={i} i={i} aparece={t10 + i * 2} ganho={i < 6} tCor={i < 6 ? tGanhos + i * 3 : tPerdas + (i - 6) * 3} meio={meio} frame={frame} />
        ))}
      </div>
      <div style={{ marginTop: 34, display: "flex", justifyContent: "center", opacity: soma, transform: `scale(${0.7 + 0.3 * soma})` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 22, padding: "14px 34px", borderRadius: 22, border: `3px solid ${COR.ganho}`, background: `${COR.ganho}18` }}>
          <span style={{ fontFamily: MONO, fontSize: 28, color: COR.suave, letterSpacing: 2 }}>6 × 0,5R =</span>
          <span style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 72, color: COR.ganho }}>+3R</span>
        </div>
      </div>
    </Cena>
  );
};

const Trade: React.FC<{ i: number; aparece: number; ganho: boolean; tCor: number; meio: number; frame: number }> = ({ i, aparece, ganho, tCor, meio, frame }) => {
  const s = useEntrada(aparece, 12);
  const pintada = frame >= tCor;
  const cor = !pintada ? COR.suave : ganho ? COR.ganho : COR.negativo;
  const valor = !pintada ? "?" : ganho ? (meio < 0.99 ? `+${meio.toFixed(1).replace(".", ",")}R` : "+1R") : "−1R";
  return (
    <div style={{ height: 160, borderRadius: 20, border: `3px solid ${pintada ? cor : "#2A251A"}`, background: pintada ? `${cor}1c` : "#13110D",
      opacity: s, transform: `scale(${0.7 + 0.3 * s})`, padding: "14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div style={{ fontFamily: MONO, fontSize: 20, color: COR.suave }}>#{i + 1}</div>
      <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 40, color: cor, textAlign: "center" }}>{valor}</div>
      {ganho ? (
        <div style={{ height: 8, borderRadius: 4, background: "#2A251A", overflow: "hidden", opacity: pintada ? 1 : 0 }}>
          <div style={{ height: "100%", width: `${meio * 100}%`, background: COR.ganho }} />
        </div>
      ) : <div style={{ height: 8 }} />}
    </div>
  );
};
