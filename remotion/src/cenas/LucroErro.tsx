import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

/** "Esta trade foi lucro, mas ao mesmo tempo foi um erro." */
export const LucroErro: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const res = useEntrada(r(3.84));
  const dec = useEntrada(r(5.2));
  const carimbo = useEntrada(r(5.76), 9);
  return (
    <Cena kicker="A MESMA TRADE" titulo={<>Lucro <Ouro>e erro</Ouro><br />ao mesmo tempo</>}>
      <div style={{ position: "relative", display: "flex", gap: 30, marginTop: 20 }}>
        <Cartao rotulo="RESULTADO" valor="+320 €" cor={COR.ganho} nota="✓ Lucro" s={res} />
        <Cartao rotulo="DECISÃO" valor="Sem plano" cor={COR.negativo} nota="✕ Entrada por impulso" s={dec} />
        <div
          style={{
            position: "absolute", right: 30, top: 150, opacity: Math.min(1, carimbo * 2),
            transform: `scale(${2.2 - 1.2 * carimbo}) rotate(-10deg)`, color: COR.negativo, border: `9px solid ${COR.negativo}`,
            borderRadius: 18, padding: "2px 30px", fontFamily: SERIFA, fontStyle: "italic", fontWeight: 900, fontSize: 92, background: "rgba(10,9,8,0.85)",
          }}
        >
          ERRO
        </div>
      </div>
    </Cena>
  );
};

const Cartao: React.FC<{ rotulo: string; valor: string; cor: string; nota: string; s: number }> = ({ rotulo, valor, cor, nota, s }) => (
  <div
    style={{
      flex: 1, height: 360, borderRadius: 28, padding: "30px 32px", opacity: s, transform: `translateY(${(1 - s) * 40}px)`,
      background: "linear-gradient(180deg, #16130E, #100E0B)", border: `2px solid ${cor}55`,
    }}
  >
    <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: COR.suave }}>{rotulo}</div>
    <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 76, color: cor, marginTop: 40, lineHeight: 1.05 }}>{valor}</div>
    <div style={{ fontSize: 30, fontWeight: 700, color: cor, marginTop: 40 }}>{nota}</div>
  </div>
);
