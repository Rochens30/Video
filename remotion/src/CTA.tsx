import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, FONTE, MONO } from "./estilo";
import { f } from "./tempo";
import { useEntrada } from "./ui";
import { Curva } from "./cenas/graficos";

const DOURADO = "#D4AF37";
const URL = "homepage.forexacademyclub.com";
const CLIQUE = f(3.0);
const PALAVRAS = ["QUERES", "SER", "UM", "TRADER", "CONSISTENTE?"];
const CURVA = [0.1, 0.18, 0.14, 0.28, 0.24, 0.38, 0.34, 0.5, 0.46, 0.62, 0.58, 0.75, 0.72, 0.9];

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const entrada = useEntrada(0, 16);
  const marca = useEntrada(f(0.35));
  const sub = useEntrada(f(1.7));
  const botao = useEntrada(f(2.1), 11);
  const url = useEntrada(f(2.5));
  const pulso = frame > CLIQUE + 6 ? 1 + 0.04 * Math.sin((frame - CLIQUE) / 4) : 1;
  const premido = frame >= CLIQUE && frame < CLIQUE + 5 ? 0.92 : 1;
  // Cursor que vem tocar no botão
  const cx = interpolate(frame, [f(2.3), CLIQUE], [900, 600], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [f(2.3), CLIQUE], [1450, 1130], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onda = interpolate(frame, [CLIQUE, CLIQUE + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONTE, transform: `translateY(${(1 - entrada) * 1920}px)`,
        background: `radial-gradient(100% 70% at 50% 30%, #1d1a0e 0%, ${COR.fundo} 65%)`,
      }}
    >
      <AbsoluteFill style={{ opacity: 0.25, top: 1250 }}>
        <Curva vals={CURVA} w={1080} h={560} de={f(0.3)} ate={f(4.5)} cor={COR.verde} espessura={6} />
      </AbsoluteFill>

      <div style={{ position: "absolute", top: 260, left: 0, right: 0, textAlign: "center", opacity: marca, transform: `translateY(${(1 - marca) * -30}px)` }}>
        <div style={{ display: "inline-block", border: `3px solid ${DOURADO}`, borderRadius: 18, padding: "14px 34px", color: DOURADO, fontWeight: 900, fontSize: 40, letterSpacing: 8 }}>
          FOREX ACADEMY CLUB
        </div>
      </div>

      <div style={{ position: "absolute", top: 470, left: 60, right: 60, textAlign: "center", color: COR.texto, fontWeight: 900, fontSize: 104, lineHeight: 1.08 }}>
        {PALAVRAS.map((p, i) => (
          <Palavra key={p} texto={p} inicio={f(0.6) + i * 6} destaque={p === "CONSISTENTE?"} />
        ))}
      </div>

      <div style={{ position: "absolute", top: 920, left: 80, right: 80, textAlign: "center", color: COR.suave, fontWeight: 600, fontSize: 40, lineHeight: 1.35, opacity: sub }}>
        Aprende um processo com regras claras:<br />
        <span style={{ color: COR.texto, fontWeight: 800 }}>risco, entradas e diário de trading.</span>
      </div>

      <div style={{ position: "absolute", top: 1075, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${botao * pulso * premido})` }}>
          <div style={{ position: "absolute", inset: -20 * onda, borderRadius: 999, border: `4px solid ${DOURADO}`, opacity: 1 - onda }} />
          <div
            style={{
              background: `linear-gradient(180deg, #F2D06B, ${DOURADO})`, color: "#111", fontWeight: 900, fontSize: 54,
              padding: "30px 70px", borderRadius: 999, boxShadow: `0 0 60px ${DOURADO}66`,
            }}
          >
            ENTRA NA ACADEMIA →
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1265, left: 0, right: 0, textAlign: "center", opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 38, color: COR.texto }}>{URL}</div>
        <div style={{ marginTop: 22, display: "inline-block", background: `${COR.verde}22`, border: `2px solid ${COR.verde}`, color: COR.verde, borderRadius: 14, padding: "8px 22px", fontWeight: 800, fontSize: 34 }}>
          ↑ LINK NA BIO
        </div>
      </div>

      <svg width={90} height={110} viewBox="0 0 24 30" style={{ position: "absolute", left: cx, top: cy, opacity: frame > f(2.3) ? 1 : 0, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.5))" }}>
        <path d="M3 1 L3 23 L8.5 18 L12 27 L15.5 25.5 L12 17 L19.5 17 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>

      <Sequence from={f(0.35)} layout="none"><Audio src={staticFile("sfx/ui/notification.mp3")} volume={0.25} /></Sequence>
      {PALAVRAS.map((p, i) => (
        <Sequence key={p} from={f(0.6) + i * 6} layout="none"><Audio src={staticFile("sfx/ui/press.mp3")} volume={0.15} /></Sequence>
      ))}
      <Sequence from={f(2.1)} layout="none"><Audio src={staticFile("sfx/ui/open.mp3")} volume={0.25} /></Sequence>
      <Sequence from={CLIQUE} layout="none"><Audio src={staticFile("sfx/ui/press.mp3")} volume={0.35} /></Sequence>
      <Sequence from={CLIQUE + 4} layout="none"><Audio src={staticFile("sfx/ui/success.mp3")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};

const Palavra: React.FC<{ texto: string; inicio: number; destaque: boolean }> = ({ texto, inicio, destaque }) => {
  const s = useEntrada(inicio, 10);
  return (
    <span style={{ display: "inline-block", margin: "0 14px", opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + 0.2 * s})`, color: destaque ? DOURADO : COR.texto }}>
      {texto}
    </span>
  );
};
