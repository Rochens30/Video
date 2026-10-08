import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, DOURADO_GRADIENTE, FONTE, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Ouro, useEntrada } from "./ui";

const URL = "homepage.forexacademyclub.com";
const CLIQUE = f(2.9);
const FAIXA = ["Consistência", "Mesmo risco", "Mesmo critério", "Diário", "Plano", "Zero promessas milagrosas"];

/** CTA final: logótipo → promessa curta → botão "QUERO SABER MAIS" com toque → link na bio. */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const entrada = useEntrada(0, 16);
  const logo = useEntrada(f(0.25), 12);
  const l1 = useEntrada(f(0.6));
  const l2 = useEntrada(f(1.1), 10);
  const botao = useEntrada(f(1.8), 11);
  const url = useEntrada(f(3.4));
  const pulso = frame > CLIQUE + 6 ? 1 + 0.035 * Math.sin((frame - CLIQUE) / 4) : 1;
  const premido = frame >= CLIQUE && frame < CLIQUE + 5 ? 0.93 : 1;
  const onda = interpolate(frame, [CLIQUE, CLIQUE + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Dedo/cursor que vem tocar no botão
  const cx = interpolate(frame, [f(2.2), CLIQUE], [880, 640], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(frame, [f(2.2), CLIQUE], [1330, 1110], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONTE, transform: `translateY(${(1 - entrada) * 1920}px)`,
        background: `radial-gradient(90% 50% at 50% 25%, #241D0F 0%, ${COR.fundo} 68%)`,
      }}
    >
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("logo.png")} style={{ width: 400, opacity: logo, transform: `scale(${0.8 + 0.2 * logo})`, filter: "drop-shadow(0 10px 40px rgba(217,180,90,0.25))" }} />
      </div>

      <div style={{ position: "absolute", top: 560, left: 60, right: 60, textAlign: "center", fontFamily: SERIFA }}>
        <div style={{ color: COR.texto, fontWeight: 700, fontSize: 72, lineHeight: 1.08, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>
          Consistência não é sorte.
        </div>
        <div style={{ marginTop: 14, color: COR.texto, fontWeight: 900, fontSize: 104, lineHeight: 1.02, opacity: l2, transform: `scale(${0.75 + 0.25 * l2})` }}>
          <Ouro>Aprende-se.</Ouro>
        </div>
      </div>

      <div style={{ position: "absolute", top: 860, left: 90, right: 90, textAlign: "center", color: COR.suave, fontSize: 38, lineHeight: 1.4, opacity: l2 }}>
        Risco, critério de entrada e diário de trading<br />— <span style={{ color: COR.texto, fontWeight: 700 }}>com método.</span>
      </div>

      <div style={{ position: "absolute", top: 1040, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", transform: `scale(${botao * pulso * premido})` }}>
          <div style={{ position: "absolute", inset: -22 * onda, borderRadius: 999, border: "4px solid #D9B45A", opacity: 1 - onda }} />
          <div style={{ background: DOURADO_GRADIENTE, color: "#15110A", borderRadius: 999, padding: "32px 70px", fontWeight: 800, fontSize: 46, letterSpacing: 5, boxShadow: "0 0 60px rgba(217,180,90,0.4)" }}>
            QUERO SABER MAIS →
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1215, left: 0, right: 0, textAlign: "center", opacity: url, transform: `translateY(${(1 - url) * 20}px)` }}>
        <div style={{ fontFamily: MONO, fontSize: 32, color: COR.suave, letterSpacing: 1 }}>{URL}</div>
        <div style={{ marginTop: 16, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: COR.positivo }}>↑ LINK NA BIO</div>
      </div>

      <svg width={86} height={106} viewBox="0 0 24 30" style={{ position: "absolute", left: cx, top: cy, opacity: frame > f(2.2) && frame < f(4.2) ? 1 : 0, filter: "drop-shadow(0 6px 10px rgba(0,0,0,.6))" }}>
        <path d="M3 1 L3 23 L8.5 18 L12 27 L15.5 25.5 L12 17 L19.5 17 Z" fill="#fff" stroke="#000" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>

      <Faixa frame={frame} />

      <Sequence layout="none"><Audio src={staticFile("sfx/whoosh_in.wav")} volume={0.15} /></Sequence>
      <Sequence from={CLIQUE} layout="none"><Audio src={staticFile("sfx/ui/press.mp3")} volume={0.3} /></Sequence>
    </AbsoluteFill>
  );
};

/** Faixa em movimento com palavras em itálico e ✦, como a do site. */
const Faixa: React.FC<{ frame: number }> = ({ frame }) => {
  const itens = [...FAIXA, ...FAIXA, ...FAIXA];
  return (
    <div style={{ position: "absolute", top: 1370, left: 0, right: 0, height: 80, overflow: "hidden", borderTop: "1px solid #2A251A", borderBottom: "1px solid #2A251A" }}>
      <div style={{ display: "flex", alignItems: "center", height: "100%", whiteSpace: "nowrap", transform: `translateX(${-frame * 3}px)` }}>
        {itens.map((t, i) => (
          <span key={i} style={{ fontFamily: SERIFA, fontStyle: "italic", fontSize: 38, color: COR.texto, marginRight: 36 }}>
            {t}<span style={{ color: COR.positivo, fontStyle: "normal", fontSize: 22, marginLeft: 36 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
