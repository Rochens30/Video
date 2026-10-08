import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

/** "Portanto, uma trade não se avalia pelo resultado. Avalia sim pela decisão que gerou essa trade." */
export const Regra: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const l1 = useEntrada(r(25.2));
  const risco = interpolate(frame, [r(26.08), r(26.08) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const l2 = useEntrada(r(27.52));
  const visto = interpolate(frame, [r(28.16), r(28.16) + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Cena kicker="COMO AVALIAR UMA TRADE" titulo={<>Pela <Ouro>decisão</Ouro>,<br />não pelo resultado</>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 30, marginTop: 30 }}>
        <Linha s={l1} rotulo="RESULTADO" texto="Ganhou ou perdeu?" cor={COR.negativo}>
          <svg width={70} height={70} viewBox="0 0 70 70">
            <path d="M15 15 L55 55 M55 15 L15 55" stroke={COR.negativo} strokeWidth={9} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - risco)} />
          </svg>
          <div style={{ position: "absolute", left: 30, right: 130, top: "50%", height: 6, background: COR.negativo, transform: `scaleX(${risco})`, transformOrigin: "left" }} />
        </Linha>
        <Linha s={l2} rotulo="DECISÃO" texto="Seguiste o plano?" cor={COR.ganho}>
          <svg width={70} height={70} viewBox="0 0 70 70">
            <path d="M12 37 L29 53 L58 18" fill="none" stroke={COR.ganho} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - visto)} />
          </svg>
        </Linha>
      </div>
    </Cena>
  );
};

const Linha: React.FC<{ s: number; rotulo: string; texto: string; cor: string; children: React.ReactNode }> = ({ s, rotulo, texto, cor, children }) => (
  <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", height: 180, borderRadius: 26, padding: "0 34px",
    background: "linear-gradient(180deg, #16130E, #100E0B)", border: `2px solid ${cor}66`, opacity: s, transform: `translateX(${(1 - s) * -60}px)` }}>
    <div>
      <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: COR.suave }}>{rotulo}</div>
      <div style={{ fontFamily: SERIFA, fontWeight: 700, fontSize: 52, color: COR.texto, marginTop: 10 }}>{texto}</div>
    </div>
    {children}
  </div>
);
