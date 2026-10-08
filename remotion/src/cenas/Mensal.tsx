import { COR, MONO } from "../estilo";
import { Cena, Etiqueta, rel, useEntrada, Ouro } from "../ui";

const MESES: [string, number][] = [["JAN", 4.2], ["FEV", -1.8], ["MAR", 6.1], ["ABR", -2.9], ["MAI", 1.3], ["JUN", 3.4]];
const ESCALA = 28; // px por 1%

/** "O resultado de cada mês, esse, tu não controlas." */
export const Mensal: React.FC<{ a: number }> = ({ a }) => {
  const tag = useEntrada(rel(a, 35.65), 10);
  return (
    <Cena kicker="RESULTADO MENSAL" titulo={<>Isto tu <Ouro cor={COR.negativo}>não controlas</Ouro></>} cor={COR.suave}>
      <div style={{ position: "relative", height: 440 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, height: 3, background: COR.suave }} />
        <div style={{ display: "flex", justifyContent: "space-between", height: "100%" }}>
          {MESES.map(([m, v], i) => (
            <Barra key={m} mes={m} v={v} inicio={rel(a, 33.76) + i * 4} />
          ))}
        </div>
        <div style={{ position: "absolute", right: 0, top: -30, transform: `scale(${tag}) rotate(4deg)` }}>
          <Etiqueta cor={COR.destaque}>ALEATÓRIO</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};

const Barra: React.FC<{ mes: string; v: number; inicio: number }> = ({ mes, v, inicio }) => {
  const s = useEntrada(inicio, 12);
  const h = Math.abs(v) * ESCALA * s;
  const cor = v > 0 ? COR.positivo : COR.negativo;
  return (
    <div style={{ position: "relative", width: 110 }}>
      <div style={{ position: "absolute", left: 0, width: 110, borderRadius: 12, background: cor, height: h, top: v > 0 ? 200 - h : 203 }} />
      <div style={{ position: "absolute", width: 110, textAlign: "center", fontFamily: MONO, fontSize: 28, color: cor, opacity: s,
        top: v > 0 ? 200 - h - 44 : 213 + h }}>
        {v > 0 ? "+" : "−"}{Math.abs(v).toFixed(1)}%
      </div>
      <div style={{ position: "absolute", width: 110, textAlign: "center", top: 400, color: COR.suave, fontWeight: 800, fontSize: 26 }}>{mes}</div>
    </div>
  );
};
