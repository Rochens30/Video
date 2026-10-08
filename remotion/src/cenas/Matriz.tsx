import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

/** "Esta trade gerou lucro, mas mesmo assim foi um erro. E esta é a regra." — matriz decisão × resultado. */
export const Matriz: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const grelha = useEntrada(r(30.42));
  const destaque = useEntrada(r(31.76), 9);
  const seta = useEntrada(r(33.44), 10);
  const celulas: [string, string, string, number][] = [
    ["Boa decisão", "Mereceste", COR.ganho, 0],
    ["Boa decisão", "Faz parte", COR.suave, 0],
    ["Má decisão", "Sorte — perigo", COR.negativo, 1],
    ["Má decisão", "Lição", COR.suave, 0],
  ];
  return (
    <Cena kicker="A REGRA" titulo={<>Lucro <Ouro>não prova</Ouro><br />que acertaste</>}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 10, opacity: grelha }}>
        <Cab texto="COM LUCRO" cor={COR.ganho} /><Cab texto="COM PERDA" cor={COR.negativo} />
        {celulas.map(([linha, texto, cor, alvo]) => (
          <div
            key={texto}
            style={{
              position: "relative", height: 175, borderRadius: 22, padding: "20px 24px",
              background: alvo ? `rgba(246,70,93,${0.08 + 0.12 * destaque})` : "#13110D",
              border: alvo ? `3px solid ${COR.negativo}` : "2px solid #2A251A",
              transform: alvo ? `scale(${1 + 0.05 * destaque})` : undefined, boxShadow: alvo ? `0 0 50px rgba(246,70,93,${0.3 * destaque})` : undefined,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.suave }}>{linha.toUpperCase()}</div>
            <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 46, color: cor, marginTop: 18 }}>{texto}</div>
            {alvo ? (
              <div style={{ position: "absolute", right: 16, top: -22, opacity: seta, transform: `scale(${seta})`, background: COR.negativo, color: "#fff",
                fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, padding: "6px 14px", borderRadius: 999 }}>ESTA TRADE</div>
            ) : null}
          </div>
        ))}
      </div>
    </Cena>
  );
};

const Cab: React.FC<{ texto: string; cor: string }> = ({ texto, cor }) => (
  <div style={{ textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: cor }}>{texto}</div>
);
