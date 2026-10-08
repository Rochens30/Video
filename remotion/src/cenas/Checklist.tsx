import { interpolate, useCurrentFrame } from "remotion";
import { COR } from "../estilo";
import { Cena, Etiqueta, rel, useEntrada } from "../ui";

const ITENS: [number, string, string][] = [
  [21.27, "Mesmo risco em todas as trades", "1% / trade"],
  [24.19, "Mesmo critério de entrada", "setup definido"],
  [26.76, "Registar todas as trades", "diário"],
];

/** "Consistência real é outra coisa: é usar o mesmo risco…" */
export const Checklist: React.FC<{ a: number }> = ({ a }) => (
  <Cena kicker="CONSISTÊNCIA REAL" titulo="É outra coisa:" cor={COR.verde}>
    <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 10 }}>
      {ITENS.map(([t, texto, extra]) => (
        <Item key={texto} inicio={rel(a, t)} texto={texto} extra={extra} />
      ))}
    </div>
  </Cena>
);

const Item: React.FC<{ inicio: number; texto: string; extra: string }> = ({ inicio, texto, extra }) => {
  const frame = useCurrentFrame();
  const s = useEntrada(inicio);
  const check = interpolate(frame, [inicio + 6, inicio + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 28, opacity: s, transform: `translateX(${(1 - s) * -80}px)`,
        background: "#ffffff0d", border: `2px solid ${COR.linha}`, borderRadius: 26, padding: "26px 30px",
      }}
    >
      <svg width={70} height={70} viewBox="0 0 70 70">
        <rect x={3} y={3} width={64} height={64} rx={16} fill={`${COR.verde}${check > 0 ? "33" : "00"}`} stroke={COR.verde} strokeWidth={5} />
        <path d="M18 36 L30 48 L52 22" fill="none" stroke={COR.verde} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray={60} strokeDashoffset={60 * (1 - check)} />
      </svg>
      <div style={{ flex: 1 }}>
        <div style={{ color: COR.texto, fontWeight: 800, fontSize: 40, lineHeight: 1.15 }}>{texto}</div>
        <Etiqueta cor={COR.suave} style={{ fontSize: 24, marginTop: 10, padding: "4px 12px" }}>{extra}</Etiqueta>
      </div>
    </div>
  );
};
