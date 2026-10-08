import { COR, MONO } from "../estilo";
import { Cena, Etiqueta, useRel, useEntrada, Ouro } from "../ui";

const LINHAS: [string, string, number][] = [
  ["#041", "EUR/USD", 2.0],
  ["#042", "NAS100", -1.0],
  ["#043", "XAU/USD", -1.0],
  ["#044", "EUR/USD", 3.1],
  ["#045", "GER40", -1.0],
];

/** "…sem exceção, as boas e as más. E isso sim é consistência." */
export const Diario: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const banner = useEntrada(r(31.46), 12);
  return (
    <Cena kicker="DIÁRIO DE TRADING" titulo={<>Sem exceção:<br /><Ouro>as boas e as más</Ouro></>}>
      <div style={{ fontFamily: MONO, fontSize: 34, color: COR.texto }}>
        <div style={{ display: "flex", color: COR.suave, fontSize: 24, padding: "0 20px 12px" }}>
          <span style={{ width: 150 }}>TRADE</span><span style={{ flex: 1 }}>ATIVO</span><span style={{ width: 200, textAlign: "right" }}>RESULTADO</span><span style={{ width: 120, textAlign: "right" }}>PLANO</span>
        </div>
        {LINHAS.map(([id, ativo, resultado], i) => (
          <Linha key={id} inicio={r(28.85) + i * 7} id={id} ativo={ativo} r={resultado} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -30, display: "flex", justifyContent: "center", transform: `scale(${banner})` }}>
        <Etiqueta cor={COR.positivo} style={{ fontSize: 40, background: "#0A0908" }}>✓ ISSO SIM É CONSISTÊNCIA</Etiqueta>
      </div>
    </Cena>
  );
};

const Linha: React.FC<{ inicio: number; id: string; ativo: string; r: number }> = ({ inicio, id, ativo, r }) => {
  const s = useEntrada(inicio);
  const cor = r > 0 ? COR.ganho : COR.negativo;
  return (
    <div
      style={{
        display: "flex", alignItems: "center", padding: "12px 20px", marginBottom: 8, borderRadius: 14, background: "#15120D",
        borderLeft: `8px solid ${cor}`, opacity: s, transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <span style={{ width: 150, color: COR.suave }}>{id}</span>
      <span style={{ flex: 1 }}>{ativo}</span>
      <span style={{ width: 200, textAlign: "right", color: cor }}>{r > 0 ? "+" : "−"}{Math.abs(r).toFixed(1)}R</span>
      <span style={{ width: 120, textAlign: "right", color: COR.ganho }}>✓</span>
    </div>
  );
};
