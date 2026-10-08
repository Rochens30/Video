import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, rel, useEntrada } from "../ui";

const MESES = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN"];

/** "resultados certos e garantidos todos os meses" → "Mas isso nem existe" */
export const Expectativa: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const quebra = rel(a, 10.8);
  const cinza = interpolate(frame, [quebra, quebra + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const carimbo = useEntrada(rel(a, 11.36), 9);
  const melhores = useEntrada(rel(a, 12.25));
  return (
    <Cena kicker="O QUE A MAIORIA PENSA" titulo={<>Lucro garantido<br />todos os meses</>}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 400, filter: `grayscale(${cinza}) brightness(${1 - 0.45 * cinza})` }}>
        {MESES.map((m, i) => (
          <Barra key={m} mes={m} inicio={rel(a, 7.6) + i * 5} />
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
            transform: `scale(${2.2 - 1.2 * carimbo}) rotate(-8deg)`, color: COR.vermelho, border: `10px solid ${COR.vermelho}`,
            borderRadius: 20, padding: "10px 40px", fontWeight: 900, fontSize: 110, background: "rgba(11,15,23,0.85)",
          }}
        >
          NÃO EXISTE
        </div>
        <div style={{ marginTop: 40, opacity: melhores, color: COR.texto, fontWeight: 800, fontSize: 40, background: "rgba(11,15,23,0.85)", padding: "8px 20px", borderRadius: 12 }}>
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
      <div style={{ fontFamily: MONO, fontSize: 30, color: COR.verde, opacity: s }}>+5%</div>
      <div style={{ width: 120, height: 280 * s, background: `linear-gradient(${COR.verde}, #15803D)`, borderRadius: 14 }} />
      <div style={{ fontSize: 26, color: COR.suave, fontWeight: 800 }}>{mes}</div>
    </div>
  );
};
