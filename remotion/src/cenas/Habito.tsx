import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

// Momentos em que entra mais uma trade sem plano (palavras: entrar, mais fácil, outra, vez, virar)
export const HABITO_TRADES = [18.0, 19.68, 21.04, 21.36, 22.4];

/** "Da próxima vez que entrar sem plano, vai ser mais fácil. E depois outra vez, até isto virar um hábito." */
export const Habito: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const feitas = HABITO_TRADES.filter((t) => frame >= r(t)).length;
  const barra = interpolate(frame, HABITO_TRADES.map(r), [0.2, 0.4, 0.6, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (feitas > 0 ? 1 : 0);
  const formado = useEntrada(r(22.96), 9);
  return (
    <Cena kicker="COMO NASCE UM MAU HÁBITO" titulo={<>Cada vez <Ouro>mais fácil</Ouro></>} cor={COR.negativo}>
      <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
        {HABITO_TRADES.map((t, i) => <Ficha key={t} n={i + 1} inicio={r(t)} />)}
      </div>
      <div style={{ marginTop: 60 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: COR.suave }}>
          <span>ENTRAR SEM PLANO</span><span style={{ color: COR.negativo }}>{Math.round(barra * 100)}%</span>
        </div>
        <div style={{ height: 26, borderRadius: 13, background: "#2A251A", marginTop: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${barra * 100}%`, borderRadius: 13, background: `linear-gradient(90deg, #8A3A33, ${COR.negativo})` }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50, transform: `scale(${formado}) rotate(-3deg)` }}>
        <div style={{ border: `6px solid ${COR.negativo}`, color: COR.negativo, borderRadius: 16, padding: "8px 34px", fontWeight: 800, fontSize: 48, letterSpacing: 4 }}>HÁBITO FORMADO</div>
      </div>
    </Cena>
  );
};

const Ficha: React.FC<{ n: number; inicio: number }> = ({ n, inicio }) => {
  const s = useEntrada(inicio, 11);
  return (
    <div style={{ flex: 1, height: 150, borderRadius: 20, border: `2px solid ${COR.negativo}88`, background: `${COR.negativo}14`, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>
      <div style={{ fontFamily: MONO, fontSize: 22, color: COR.suave }}>#{n}</div>
      <div style={{ fontWeight: 800, fontSize: 26, color: COR.negativo, marginTop: 8, textAlign: "center", lineHeight: 1.15 }}>SEM<br />PLANO</div>
    </div>
  );
};
