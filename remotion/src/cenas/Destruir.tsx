import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "../estilo";
import { Cena, Etiqueta, useRel, useEntrada, Ouro } from "../ui";
import { Curva } from "./graficos";

const SUBIDA = [0.1, 0.2, 0.18, 0.3, 0.34, 0.45, 0.42, 0.55, 0.62, 0.7, 0.75];
const QUEDA = [0.75, 0.6, 0.66, 0.4, 0.45, 0.22, 0.12];

/** "E aí é que começa a destruir tudo o que estava a construir antes." */
export const Destruir: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const crash = r(53.6);
  const saldo = interpolate(frame, [r(52.1), crash, crash + 30], [10000, 15400, 4830], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const caiu = frame >= crash;
  const treme = caiu && frame < crash + 20 ? Math.sin(frame * 3.1) * 10 : 0;
  const pct = useEntrada(crash + 26, 10);
  const wSub = 940 * (SUBIDA.length - 1) / (SUBIDA.length + QUEDA.length - 2);
  return (
    <Cena kicker="CONSEQUÊNCIA" titulo={<>Destróis tudo o que<br /><Ouro>estavas a construir</Ouro></>} cor={COR.negativo}>
      <div style={{ position: "relative", transform: `translateX(${treme}px)` }}>
        <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 80, color: caiu ? COR.negativo : COR.ganho }}>
          {Math.round(saldo).toLocaleString("pt-PT")} €
        </div>
        <div style={{ position: "relative", height: 330, marginTop: 10 }}>
          <div style={{ position: "absolute", left: 0, top: 0 }}>
            <Curva vals={SUBIDA} w={wSub} h={330} de={r(52.1)} ate={crash} cor={COR.ganho} />
          </div>
          <div style={{ position: "absolute", left: wSub, top: 0 }}>
            <Curva vals={QUEDA} w={940 - wSub} h={330} de={crash} ate={crash + 30} cor={COR.negativo} />
          </div>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, transform: `scale(${pct})` }}>
          <Etiqueta cor={COR.negativo} style={{ fontSize: 40 }}>−69%</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};
