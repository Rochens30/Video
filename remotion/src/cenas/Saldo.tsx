import { interpolate, random, useCurrentFrame } from "remotion";
import { COR, MONO } from "../estilo";
import { Cena, rel } from "../ui";

/** "Se queres medir a tua consistência, não olhes para o saldo da tua conta." */
export const Saldo: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const corte = rel(a, 58.4);
  const risco = interpolate(frame, [corte, corte + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // O saldo oscila a cada 3 frames: é ruído, não é medida de consistência.
  const passo = Math.floor(Math.min(frame, corte) / 3);
  const valor = 10243.5 + (random(`s${passo}`) - 0.5) * 900;
  const pts = Array.from({ length: 24 }, (_, i) => 0.5 + (random(`p${i + passo}`) - 0.5) * 0.8);
  return (
    <Cena kicker="COMO MEDIR CONSISTÊNCIA" titulo={<>Não olhes para o<br />saldo da conta</>} cor={COR.vermelho}>
      <div style={{ position: "relative", borderRadius: 30, background: "#ffffff0d", border: `2px solid ${COR.linha}`, padding: 40, opacity: 1 - 0.5 * risco }}>
        <div style={{ color: COR.suave, fontWeight: 800, fontSize: 28, letterSpacing: 4 }}>SALDO DA CONTA</div>
        <div style={{ fontFamily: MONO, fontSize: 96, color: COR.texto, marginTop: 6 }}>
          {valor.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
        </div>
        <svg width={860} height={110} style={{ marginTop: 10 }}>
          <polyline points={pts.map((v, i) => `${(i / 23) * 860},${(1 - v) * 110}`).join(" ")} fill="none" stroke={COR.suave} strokeWidth={5} />
        </svg>
      </div>
      <svg width={940} height={420} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={20} y1={360} x2={20 + 900 * risco} y2={360 - 320 * risco} stroke={COR.vermelho} strokeWidth={16} strokeLinecap="round" />
        <line x1={20} y1={40} x2={20 + 900 * risco} y2={40 + 320 * risco} stroke={COR.vermelho} strokeWidth={16} strokeLinecap="round" />
      </svg>
    </Cena>
  );
};
