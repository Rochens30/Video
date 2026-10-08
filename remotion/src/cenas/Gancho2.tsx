import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Etiqueta, Ouro, useEntrada, useRel } from "../ui";

/** "Ganhei dinheiro, mas não devia ter entrado." — já visível no frame 0. */
export const Gancho2: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const aviso = useEntrada(r(1.44), 10);
  return (
    <Cena kicker="A VERDADE" titulo={<>Nem toda a trade com lucro<br /><Ouro>é uma boa trade.</Ouro></>} entrada={false}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30 }}>
        <div style={{ width: 760, borderRadius: 28, padding: "34px 40px", background: "linear-gradient(180deg, #16130E, #100E0B)", border: "2px solid rgba(217,180,90,0.25)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 28, color: COR.suave, letterSpacing: 3 }}>
            <span>EUR/USD · COMPRA</span><span>FECHADA</span>
          </div>
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 130, color: COR.ganho, lineHeight: 1.1, marginTop: 10 }}>+320 €</div>
        </div>
        <div style={{ marginTop: 34, transform: `scale(${aviso})` }}>
          <Etiqueta cor={COR.negativo} style={{ fontSize: 34 }}>✕ NÃO DEVIA TER ENTRADO</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};
