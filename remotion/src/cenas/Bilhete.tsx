import { COR, DOURADO_GRADIENTE, MONO, SERIFA } from "../estilo";
import { Cena, Efeito, Ouro, useEntrada, useRel } from "../ui";

/** "Garante já o teu bilhete, amanhã às 14 horas, são os últimos lugares." */
export const Bilhete: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const bilhete = useEntrada(r(38.0), 12);
  const hora = useEntrada(r(40.36), 9);
  const carimbo = useEntrada(r(41.72), 9);
  return (
    <Cena kicker="EVENTO PRESENCIAL PARA TRADERS" titulo={<>Garante <Ouro>o teu bilhete</Ouro></>}>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: 10 }}>
        <div style={{ width: 900, height: 400, display: "flex", borderRadius: 30, overflow: "hidden", opacity: bilhete,
          transform: `translateY(${(1 - bilhete) * 80}px) rotate(${(1 - bilhete) * -4}deg)`, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ flex: 1, background: "linear-gradient(160deg, #1C1810, #0F0D0A)", border: "3px solid rgba(217,180,90,0.6)", borderRight: "none",
            borderRadius: "30px 0 0 30px", padding: "34px 40px" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: COR.positivo }}>FOREX ACADEMY CLUB · LISBOA</div>
            <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 84, color: COR.texto, marginTop: 20, lineHeight: 1 }}>Sáb · 24 Out</div>
            <div style={{ display: "flex", gap: 20, marginTop: 30, alignItems: "baseline" }}>
              <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 72, color: COR.positivo, transform: `scale(${0.85 + 0.15 * hora})`, transformOrigin: "left" }}>14h–19h</div>
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: COR.suave, marginTop: 22 }}>DoubleTree by Hilton · Lisboa</div>
          </div>
          <div style={{ width: 170, background: DOURADO_GRADIENTE, borderLeft: "4px dashed #0A0908", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ transform: "rotate(-90deg)", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: "#15110A", whiteSpace: "nowrap" }}>ADMIT ONE</div>
          </div>
        </div>
        <div style={{ position: "absolute", right: 150, top: 230, opacity: Math.min(1, carimbo * 2), transform: `scale(${2.2 - 1.2 * carimbo}) rotate(-12deg)`,
          border: `8px solid ${COR.negativo}`, color: COR.negativo, borderRadius: 16, padding: "6px 22px", fontWeight: 800, fontSize: 46, letterSpacing: 3, background: "rgba(10,9,8,0.85)" }}>
          ÚLTIMOS LUGARES
        </div>
      </div>
      <Efeito src="sfx/impacto.wav" volume={0.12} de={r(41.72) + 4} />
    </Cena>
  );
};
