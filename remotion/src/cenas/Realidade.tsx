import { COR } from "../estilo";
import { Cena, Etiqueta, useRel, useEntrada, Ouro } from "../ui";
import { VelasSerie } from "./graficos";

const VALS = [0.15, 0.3, 0.22, 0.42, 0.35, 0.28, 0.5, 0.44, 0.62, 0.55, 0.48, 0.66, 0.6, 0.78, 0.7, 0.86];

/** "O resultado sobe e desce, e isso é normal, faz parte do jogo." */
export const Realidade: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const de = r(14.5), ate = r(17.4);
  const sobe = useEntrada(r(15.31)), desce = useEntrada(r(15.83)), normal = useEntrada(r(16.8), 10);
  return (
    <Cena kicker="A REALIDADE" titulo={<>O resultado <Ouro>sobe e desce</Ouro></>} cor={COR.positivo}>
      <div style={{ position: "relative", width: 940, height: 420 }}>
        <div style={{ position: "absolute", top: 60, left: 0 }}>
          <VelasSerie vals={VALS} w={940} h={340} de={de} ate={ate} verde={COR.ganho} vermelho={COR.negativo} />
        </div>
        <div style={{ position: "absolute", top: -10, left: 0, display: "flex", gap: 16 }}>
          <Etiqueta cor={COR.ganho} style={{ transform: `scale(${sobe})` }}>▲ SOBE</Etiqueta>
          <Etiqueta cor={COR.negativo} style={{ transform: `scale(${desce})` }}>▼ DESCE</Etiqueta>
        </div>
        <div style={{ position: "absolute", right: 0, bottom: 10, transform: `scale(${normal})` }}>
          <Etiqueta cor={COR.destaque} style={{ fontSize: 40 }}>✓ É NORMAL</Etiqueta>
        </div>
      </div>
    </Cena>
  );
};
