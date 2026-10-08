import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, Etiqueta, Ouro, useEntrada, useRel } from "../ui";

/** "O perigo não é esta trade, é o que o meu cérebro faz a seguir. Ele guarda o resultado positivo e associa-o à decisão." */
export const Cerebro: React.FC<{ a: number }> = ({ a }) => {
  const r = useRel(a);
  const frame = useCurrentFrame();
  const perigo = useEntrada(r(8.96), 10);
  const memoria = useEntrada(r(11.36));
  const n1 = useEntrada(r(13.84));
  const seta = interpolate(frame, [r(15.28), r(15.28) + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n2 = useEntrada(r(16.0));
  return (
    <Cena kicker="O VERDADEIRO PERIGO" titulo={<>O que o cérebro <Ouro>aprende</Ouro></>} cor={COR.negativo}>
      <div style={{ display: "flex", justifyContent: "center", transform: `scale(${perigo})` }}>
        <Etiqueta cor={COR.negativo} style={{ fontSize: 30 }}>⚠ O PERIGO NÃO É ESTA TRADE</Etiqueta>
      </div>
      <div
        style={{
          position: "relative", marginTop: 34, height: 420, borderRadius: 28, border: "3px dashed rgba(217,180,90,0.45)", opacity: memoria,
          background: "rgba(217,180,90,0.04)", padding: "26px 30px",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: COR.positivo }}>MEMÓRIA DO CÉREBRO</div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 60 }}>
          <No titulo="RESULTADO" texto="+320 €" cor={COR.ganho} s={n1} />
          <svg width={180} height={120} viewBox="0 0 180 120">
            <line x1={10} y1={60} x2={10 + 140 * seta} y2={60} stroke={COR.destaque} strokeWidth={8} strokeLinecap="round" />
            <path d="M150 40 L172 60 L150 80" fill="none" stroke={COR.destaque} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={seta >= 1 ? 1 : 0} />
            <text x={90} y={35} textAnchor="middle" fill={COR.destaque} fontFamily="JetBrains Mono" fontSize={20} opacity={seta}>ASSOCIA</text>
          </svg>
          <No titulo="DECISÃO" texto="Entrar sem plano" cor={COR.negativo} s={n2} />
        </div>
      </div>
    </Cena>
  );
};

const No: React.FC<{ titulo: string; texto: string; cor: string; s: number }> = ({ titulo, texto, cor, s }) => (
  <div style={{ flex: 1, height: 200, borderRadius: 24, padding: "24px 26px", border: `2px solid ${cor}88`, background: `${cor}14`, opacity: s, transform: `scale(${0.8 + 0.2 * s})` }}>
    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, color: COR.suave }}>{titulo}</div>
    <div style={{ fontWeight: 800, fontSize: 44, color: cor, marginTop: 26, lineHeight: 1.1 }}>{texto}</div>
  </div>
);
