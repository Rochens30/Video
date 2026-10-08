import { useCurrentFrame } from "remotion";
import { COR } from "../estilo";
import { Cena, Etiqueta, useRel, useEntrada, Ouro } from "../ui";

// [abertura, fecho, máximo, mínimo] em unidades 0..100 (100 = topo)
const VELAS: number[][] = [
  [40, 52, 56, 36], [52, 48, 58, 44], [48, 60, 63, 46], [60, 66, 70, 57], [66, 58, 68, 55],
  [58, 64, 67, 54], [64, 70, 74, 61],
  // sequência de perdas
  [70, 61, 72, 58], [61, 53, 63, 50], [53, 47, 56, 44], [47, 39, 49, 36], [39, 33, 42, 30], [33, 26, 35, 22],
];
const ESTRATEGIAS = ["ESTRATÉGIA A", "ESTRATÉGIA B", "ESTRATÉGIA C", "ESTRATÉGIA D"];

/** "…acaba por mudar de estratégia no meio de uma sequência de perdas." */
export const Perdas: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const troca = r(43.12);
  const k = frame < troca ? 0 : Math.min(ESTRATEGIAS.length - 1, 1 + Math.floor((frame - troca) / 14));
  const seq = useEntrada(r(45.36), 10);
  return (
    <Cena kicker="O ERRO Nº1" titulo={<>Mudar de estratégia<br /><Ouro>a meio das perdas</Ouro></>} cor={COR.negativo}>
      <div style={{ position: "absolute", right: 0, top: -200 }}>
        <Etiqueta key={k} cor={k ? COR.negativo : COR.suave} style={{ fontSize: 28 }}>{ESTRATEGIAS[k]}</Etiqueta>
      </div>
      <svg width={940} height={420}>
        {VELAS.map((v, i) => (
          <Vela key={i} v={v} i={i} inicio={r(43.1) + i * 6} />
        ))}
      </svg>
      <div style={{ position: "absolute", right: 0, bottom: 0, transform: `scale(${seq})` }}>
        <Etiqueta cor={COR.negativo} style={{ fontSize: 34, background: "#0A0908" }}>6 PERDAS SEGUIDAS</Etiqueta>
      </div>
    </Cena>
  );
};

const Vela: React.FC<{ v: number[]; i: number; inicio: number }> = ({ v, i, inicio }) => {
  const s = useEntrada(inicio, 13);
  const [o, c, h, l] = v;
  const y = (n: number) => 420 - (n / 100) * 420 * 1.25 + 60;
  const cor = c >= o ? COR.positivo : COR.negativo;
  const x = 20 + i * 70;
  const meio = (y(o) + y(c)) / 2;
  return (
    <g opacity={Math.min(1, s * 1.5)} transform={`translate(0 ${meio}) scale(1 ${s}) translate(0 ${-meio})`}>
      <line x1={x + 22} x2={x + 22} y1={y(h)} y2={y(l)} stroke={cor} strokeWidth={5} />
      <rect x={x} y={Math.min(y(o), y(c))} width={44} height={Math.max(6, Math.abs(y(o) - y(c)))} rx={6} fill={cor} />
    </g>
  );
};
