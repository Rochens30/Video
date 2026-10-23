import { interpolate, useCurrentFrame } from "remotion";
import { COR } from "../estilo";
import { Cena, Etiqueta, Ouro, useEntrada, useRel } from "../ui";
import { Curva } from "./graficos";

const ANTES = [0.45, 0.52, 0.38, 0.47, 0.3, 0.4, 0.26, 0.33, 0.2];
const DEPOIS = [0.2, 0.28, 0.25, 0.38, 0.35, 0.5, 0.47, 0.63, 0.6, 0.78, 0.74, 0.92];

/** "como é que nós fomos da inconsistência de perder dinheiro até sermos traders profissionais" */
export const Percurso: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const inc = useEntrada(r(17.04), 10);
  const pro = useEntrada(r(20.16), 10);
  const wA = 380;
  const brilho = interpolate(frame, [r(20.16), r(20.16) + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Cena kicker="A NOSSA HISTÓRIA" titulo={<>Da inconsistência<br /><Ouro>a trader profissional</Ouro></>}>
      <div style={{ position: "relative", height: 470 }}>
        <div style={{ position: "absolute", left: 0, top: 90 }}>
          <Curva vals={ANTES} w={wA} h={320} de={r(16.9)} ate={r(18.6)} cor={COR.negativo} espessura={7} />
        </div>
        <div style={{ position: "absolute", left: wA, top: 90, filter: brilho > 0 ? `drop-shadow(0 0 ${18 * brilho}px ${COR.ganho})` : undefined }}>
          <Curva vals={DEPOIS} w={940 - wA} h={320} de={r(18.7)} ate={r(20.4)} cor={COR.ganho} espessura={8} />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, transform: `scale(${inc})`, transformOrigin: "left" }}>
          <Etiqueta cor={COR.negativo}>✕ INCONSISTÊNCIA · A PERDER</Etiqueta>
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 0, transform: `scale(${pro})`, transformOrigin: "right" }}>
          <Etiqueta cor={COR.ganho} style={{ fontSize: 30 }}>✓ TRADER PROFISSIONAL</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};
