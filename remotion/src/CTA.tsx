import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, FONTE, MONO } from "./estilo";
import { f } from "./tempo";
import { useEntrada } from "./ui";

const DOURADO = "#D4AF37";
const URL = "homepage.forexacademyclub.com";
const ESCREVE = [f(1.9), f(3.1)]; // o URL é escrito letra a letra neste intervalo
const ENTER = f(3.35);

/**
 * CTA de curiosidade: "já sabes o QUE, falta o COMO" + um browser que começa a abrir o site
 * e fica preso nos 99% — a única forma de ver o resto é visitar a página.
 */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const entrada = useEntrada(0, 16);
  const l1 = useEntrada(f(0.3));
  const l2 = useEntrada(f(0.95), 9);
  const janela = useEntrada(f(1.6), 14);
  const bio = useEntrada(f(4.4), 11);
  const letras = Math.round(interpolate(frame, ESCREVE, [0, URL.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const carregar = interpolate(frame, [ENTER + 3, ENTER + 30], [0, 99], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - (1 - x) ** 3 });
  const preso = frame > ENTER + 30;
  const cursorVisivel = frame < ENTER || Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONTE, transform: `translateY(${(1 - entrada) * 1920}px)`,
        background: `radial-gradient(100% 70% at 50% 30%, #1d1a0e 0%, ${COR.fundo} 65%)`,
      }}
    >
      <div style={{ position: "absolute", top: 230, left: 60, right: 60, textAlign: "center" }}>
        <div style={{ color: COR.suave, fontWeight: 800, fontSize: 62, lineHeight: 1.15, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>
          Já sabes <span style={{ color: COR.texto }}>O QUE</span> é<br />consistência.
        </div>
        <div style={{ marginTop: 34, color: COR.texto, fontWeight: 900, fontSize: 96, lineHeight: 1.05, opacity: l2, transform: `scale(${0.7 + 0.3 * l2})` }}>
          Falta o <span style={{ color: DOURADO }}>COMO.</span>
        </div>
      </div>

      {/* Janela de browser */}
      <div
        style={{
          position: "absolute", top: 720, left: 70, right: 70, height: 600, borderRadius: 30, overflow: "hidden",
          background: "#0F141D", border: `2px solid ${COR.linha}`, boxShadow: "0 30px 90px rgba(0,0,0,.6)",
          opacity: janela, transform: `translateY(${(1 - janela) * 80}px) scale(${0.92 + 0.08 * janela})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", background: "#161C27" }}>
          {["#EF4444", "#FACC15", "#22C55E"].map((c) => (
            <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
          ))}
          <div style={{ flex: 1, marginLeft: 12, background: "#0B0F17", borderRadius: 14, padding: "14px 20px", fontFamily: MONO, fontSize: 30, color: COR.texto, whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={{ color: COR.suave }}>🔒 </span>
            {URL.slice(0, letras)}
            <span style={{ opacity: cursorVisivel ? 1 : 0, color: DOURADO }}>|</span>
          </div>
        </div>
        {/* barra de carregamento */}
        <div style={{ height: 8, background: "#ffffff10" }}>
          <div style={{ height: "100%", width: `${carregar}%`, background: DOURADO, boxShadow: `0 0 20px ${DOURADO}` }} />
        </div>
        {/* conteúdo desfocado da página */}
        <div style={{ position: "relative", padding: 40 }}>
          <div style={{ filter: "blur(14px)", opacity: interpolate(carregar, [0, 60], [0.15, 0.8]) }}>
            <div style={{ height: 50, width: "70%", background: DOURADO, borderRadius: 10 }} />
            <div style={{ height: 26, width: "90%", background: "#ffffff40", borderRadius: 8, marginTop: 26 }} />
            <div style={{ height: 26, width: "80%", background: "#ffffff40", borderRadius: 8, marginTop: 14 }} />
            <div style={{ display: "flex", gap: 20, marginTop: 34 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 150, borderRadius: 18, background: "#ffffff22" }} />)}
            </div>
            <div style={{ height: 60, width: "45%", background: COR.verde, borderRadius: 30, marginTop: 34 }} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: preso ? 1 : 0 }}>
            <div style={{ fontFamily: MONO, fontSize: 92, color: DOURADO }}>99%</div>
            <div style={{ color: COR.texto, fontWeight: 900, fontSize: 44, marginTop: 8, textAlign: "center", background: "rgba(11,15,23,.8)", padding: "10px 24px", borderRadius: 16 }}>
              O último 1% está no site.
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1380, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${bio})` }}>
        <div style={{ background: `${DOURADO}22`, border: `3px solid ${DOURADO}`, color: DOURADO, borderRadius: 18, padding: "14px 32px", fontWeight: 900, fontSize: 44 }}>
          ↑ LINK NA BIO
        </div>
      </div>

      <Sequence layout="none"><Audio src={staticFile("sfx/whoosh_in.wav")} volume={0.15} /></Sequence>
      <Sequence from={ENTER} layout="none"><Audio src={staticFile("sfx/ui/press.mp3")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};
