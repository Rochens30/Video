import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, Etiqueta, rel, useEntrada } from "../ui";

/** "Ou começa então a arriscar mais por trade para recuperar da loss…" */
export const Risco: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const t0 = rel(a, 47.84), t1 = rel(a, 50.9);
  const risco = interpolate(frame, [t0, t1], [1, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cor = interpolateColors(risco, [1, 2.5, 6], [COR.verde, COR.amarelo, COR.vermelho]);
  const aviso = useEntrada(rel(a, 49.44), 10);
  const treme = risco > 4 ? Math.sin(frame * 2.3) * (risco - 4) * 3 : 0;
  return (
    <Cena kicker="O ERRO Nº2" titulo={<>Arriscar mais para<br />recuperar a loss</>} cor={COR.vermelho}>
      <div style={{ textAlign: "center", transform: `translateX(${treme}px)` }}>
        <div style={{ color: COR.suave, fontWeight: 800, fontSize: 30, letterSpacing: 4 }}>RISCO POR TRADE</div>
        <div style={{ fontFamily: MONO, fontSize: 170, color: cor, lineHeight: 1.1 }}>{risco.toFixed(0)}%</div>
      </div>
      <div style={{ height: 44, borderRadius: 22, background: "#ffffff14", overflow: "hidden", marginTop: 10 }}>
        <div style={{ height: "100%", width: `${(risco / 6) * 100}%`, background: `linear-gradient(90deg, ${COR.verde}, ${cor})`, borderRadius: 22 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", color: COR.suave, fontFamily: MONO, fontSize: 24, marginTop: 8 }}>
        <span>1% plano</span><span>6%</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 26, transform: `scale(${aviso})` }}>
        <Etiqueta cor={COR.vermelho} style={{ fontSize: 34 }}>⚠ FORA DO PLANO</Etiqueta>
      </div>
    </Cena>
  );
};
