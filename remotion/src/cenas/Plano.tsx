import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, Etiqueta, rel, useEntrada } from "../ui";

const FORA = new Set([6, 14]); // as 2 trades que não seguiram o plano

/** "Olha para quantas trades seguiram mesmo o teu plano." */
export const Plano: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const t0 = rel(a, 61.1), passo = 3;
  const feitos = Math.max(0, Math.min(20, Math.floor((frame - t0) / passo) + 1));
  const noPlano = Array.from({ length: feitos }, (_, i) => i).filter((i) => !FORA.has(i)).length;
  const pct = useEntrada(rel(a, 63.28), 10);
  const anel = interpolate(noPlano, [0, 20], [0, 1]);
  return (
    <Cena kicker="OLHA PARA ISTO" titulo={<>Trades que seguiram<br />o teu plano</>} cor={COR.verde}>
      <div style={{ display: "flex", alignItems: "center", gap: 50 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 76px)", gap: 18 }}>
          {Array.from({ length: 20 }, (_, i) => (
            <Ponto key={i} visivel={i < feitos} fora={FORA.has(i)} inicio={t0 + i * passo} />
          ))}
        </div>
        <div style={{ position: "relative", width: 330, height: 330 }}>
          <svg width={330} height={330} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={165} cy={165} r={140} fill="none" stroke="#ffffff14" strokeWidth={26} />
            <circle cx={165} cy={165} r={140} fill="none" stroke={COR.verde} strokeWidth={26} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 140} strokeDashoffset={2 * Math.PI * 140 * (1 - anel)} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: 84, color: COR.texto }}>{noPlano}<span style={{ color: COR.suave, fontSize: 48 }}>/20</span></div>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", transform: `scale(${pct})` }}>
            <Etiqueta cor={COR.verde}>90% NO PLANO</Etiqueta>
          </div>
        </div>
      </div>
    </Cena>
  );
};

const Ponto: React.FC<{ visivel: boolean; fora: boolean; inicio: number }> = ({ visivel, fora, inicio }) => {
  const s = useEntrada(inicio, 10);
  const cor = fora ? COR.vermelho : COR.verde;
  return (
    <div style={{ width: 76, height: 76, borderRadius: 20, border: `3px solid ${visivel ? cor : COR.linha}`, background: visivel ? `${cor}33` : "transparent",
      display: "flex", alignItems: "center", justifyContent: "center", color: cor, fontWeight: 900, fontSize: 40 }}>
      <span style={{ transform: `scale(${visivel ? s : 0})` }}>{fora ? "✕" : "✓"}</span>
    </div>
  );
};
