import { interpolate, useCurrentFrame } from "remotion";
import { COR } from "../estilo";
import { Cena, Etiqueta, rel, useEntrada } from "../ui";
import { Curva, pontoEm } from "./graficos";

const VALS = [0.15, 0.3, 0.22, 0.42, 0.35, 0.28, 0.5, 0.44, 0.62, 0.55, 0.48, 0.66, 0.6, 0.78, 0.7, 0.86];

/** "O resultado sobe e desce, e isso é normal, faz parte do jogo." */
export const Realidade: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const de = rel(a, 14.5), ate = rel(a, 17.4);
  const p = interpolate(frame, [de, ate], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pt = pontoEm(VALS, p);
  const sobe = useEntrada(rel(a, 15.31)), desce = useEntrada(rel(a, 15.83)), normal = useEntrada(rel(a, 16.8), 10);
  return (
    <Cena kicker="A REALIDADE" titulo="O resultado sobe e desce" cor={COR.verde}>
      <div style={{ position: "relative", width: 940, height: 420 }}>
        <Curva vals={VALS} w={940} h={420} de={de} ate={ate} cor={COR.verde} />
        <div
          style={{
            position: "absolute", left: pt.x * 940 - 14, top: (1 - pt.y) * 420 - 14, width: 28, height: 28, borderRadius: 14,
            background: COR.verde, boxShadow: `0 0 0 10px ${COR.verde}44`, opacity: p > 0 ? 1 : 0,
          }}
        />
        <div style={{ position: "absolute", top: -10, left: 0, display: "flex", gap: 16 }}>
          <Etiqueta cor={COR.verde} style={{ transform: `scale(${sobe})` }}>▲ SOBE</Etiqueta>
          <Etiqueta cor={COR.vermelho} style={{ transform: `scale(${desce})` }}>▼ DESCE</Etiqueta>
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 10, transform: `scale(${normal})` }}>
          <Etiqueta cor={COR.amarelo} style={{ fontSize: 40 }}>✓ É NORMAL</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};
