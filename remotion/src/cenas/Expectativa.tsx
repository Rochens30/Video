import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA, VERDE_GRADIENTE } from "../estilo";
import { Cena, useRel, useEntrada, Ouro } from "../ui";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN"];

/** "resultados certos e garantidos todos os meses" → "Mas isso nem existe" */
export const Expectativa: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const quebra = r(10.8);
  const cinza = interpolate(frame, [quebra, quebra + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const carimbo = useEntrada(r(11.36), 9);
  const melhores = useEntrada(r(12.25));
  return (
    <Cena kicker="O QUE A MAIORIA PENSA" titulo={<>Lucro garantido<br /><Ouro>todos os meses</Ouro></>}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 400, filter: `grayscale(${cinza}) brightness(${1 - 0.45 * cinza})` }}>
        {MESES.map((m, i) => (
          <Barra key={m} mes={m} inicio={r(7.6) + i * 5} />
        ))}
      </div>
      <div
        style={{
          position: "absolute", top: 110, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center",
          opacity: Math.min(1, carimbo * 2),
        }}
      >
        <div
          style={{
            transform: `scale(${2.2 - 1.2 * carimbo}) rotate(-8deg)`, color: COR.negativo, border: `10px solid ${COR.negativo}`,
            borderRadius: 20, padding: "6px 40px", fontFamily: SERIFA, fontStyle: "italic", fontWeight: 900, fontSize: 116, background: "rgba(10,9,8,0.85)",
          }}
        >
          NÃO EXISTE
        </div>
        <div style={{ marginTop: 40, opacity: melhores, color: COR.texto, fontWeight: 800, fontSize: 40, background: "rgba(10,9,8,0.85)", padding: "8px 20px", borderRadius: 12 }}>
          …nem para os melhores traders do mundo
        </div>
      </div>
    </Cena>
  );
};

const Barra: React.FC<{ mes: string; inicio: number }> = ({ mes, inicio }) => {
  const s = useEntrada(inicio, 12);
  return (
    <div style={{ width: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ fontFamily: MONO, fontSize: 30, color: COR.ganho, opacity: s }}>+5%</div>
      <div style={{ width: 120, height: 280 * s, background: VERDE_GRADIENTE, borderRadius: 14 }} />
      <div style={{ fontSize: 26, color: COR.suave, fontWeight: 800 }}>{mes}</div>
    </div>
  );
};
