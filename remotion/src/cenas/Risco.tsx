import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Etiqueta, useRel, useEntrada, Ouro } from "../ui";

/** "Ou começa então a arriscar mais por trade para recuperar da loss…" */
export const Risco: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const t0 = r(47.84), t1 = r(50.9);
  const risco = interpolate(frame, [t0, t1], [1, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cor = interpolateColors(risco, [1, 2.5, 6], [COR.ganho, COR.destaque, COR.negativo]);
  const aviso = useEntrada(r(49.44), 10);
  const treme = risco > 4 ? Math.sin(frame * 2.3) * (risco - 4) * 3 : 0;
  return (
    <Cena kicker="O ERRO Nº2" titulo={<>Arriscar mais para<br /><Ouro>recuperar a loss</Ouro></>} cor={COR.negativo}>
      <div style={{ textAlign: "center", transform: `translateX(${treme}px)` }}>
        <div style={{ color: COR.suave, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 6 }}>RISCO POR TRADE</div>
        <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 190, color: cor, lineHeight: 1.05 }}>{risco.toFixed(0)}%</div>
      </div>
      <div style={{ height: 44, borderRadius: 22, background: "#ffffff14", overflow: "hidden", marginTop: 10 }}>
        <div style={{ height: "100%", width: `${(risco / 6) * 100}%`, background: `linear-gradient(90deg, ${COR.ganho}, ${cor})`, borderRadius: 22 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: COR.suave, fontFamily: MONO, fontSize: 24, marginTop: 8 }}>
        <span>1% plano</span><span>6%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 26, transform: `scale(${aviso})` }}>
        <Etiqueta cor={COR.negativo} style={{ fontSize: 34 }}>⚠ FORA DO PLANO</Etiqueta>
      </div>
    </Cena>
  );
};
