import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Etiqueta, Ouro, useEntrada, useRel } from "../ui";
import { Curva } from "./graficos";

const CURVA = [0.1, 0.22, 0.17, 0.33, 0.28, 0.45, 0.4, 0.58, 0.53, 0.72, 0.68, 0.88];

/** "A relação entre stop loss e take profit é o que vai decidir se o nosso sistema é lucrativo a médio e longo prazo." */
export const RiscoRetorno: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const sl = useEntrada(r(16.96), 12);
  const tp = useEntrada(r(17.76), 12);
  const curva = useEntrada(r(21.36));
  const prazo = useEntrada(r(22.24));
  return (
    <Cena kicker="RISCO : RETORNO" titulo={<>A relação que <Ouro>decide tudo</Ouro></>}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 40, height: 470 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 26 }}>
          <Barra s={sl} cor={COR.negativo} rotulo="STOP" valor="1R" />
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 90, color: COR.suave, paddingBottom: 130, opacity: Math.min(sl, tp) }}>:</div>
          <Barra s={tp} cor={COR.ganho} rotulo="TAKE" valor="1R" />
        </div>
        <div style={{ flex: 1, position: "relative", height: 400, opacity: curva }}>
          <div style={{ position: "absolute", top: 0, left: 0 }}><Etiqueta cor={COR.ganho} style={{ fontSize: 24 }}>SISTEMA LUCRATIVO</Etiqueta></div>
          <div style={{ position: "absolute", left: 0, top: 70 }}>
            <Curva vals={CURVA} w={480} h={250} de={r(21.36)} ate={r(22.96)} cor={COR.ganho} espessura={7} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, opacity: prazo, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: COR.suave,
            display: "flex", justifyContent: "space-between", borderTop: "2px solid #2A251A", paddingTop: 10 }}>
            <span>HOJE</span><span>MÉDIO</span><span>LONGO PRAZO →</span>
          </div>
        </div>
      </div>
    </Cena>
  );
};

const Barra: React.FC<{ s: number; cor: string; rotulo: string; valor: string }> = ({ s, cor, rotulo, valor }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 52, color: cor, opacity: s }}>{valor}</div>
    <div style={{ width: 110, height: 260 * s, borderRadius: 16, background: cor }} />
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: cor }}>{rotulo}</div>
  </div>
);
