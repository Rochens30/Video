import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, DOURADO_GRADIENTE, FONTE, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Kicker, Ouro, useEntrada } from "./ui";

const URL = "homepage.forexacademyclub.com";
const ESCREVE = [f(1.9), f(3.1)]; // o URL é escrito letra a letra neste intervalo
const ENTER = f(3.35);
const FAIXA = ["Consistência", "Mesmo risco", "Mesmo critério", "Diário", "Plano", "Zero promessas milagrosas"];

/**
 * CTA de curiosidade: "já sabes o que, falta o como" + um browser que começa a abrir o site
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
  const caret = frame < ENTER || Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONTE, transform: `translateY(${(1 - entrada) * 1920}px)`,
        background: `radial-gradient(90% 55% at 50% 22%, #241D0F 0%, ${COR.fundo} 68%)`,
      }}
    >
      <div style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: l1 }}>
        <Kicker>FOREX ACADEMY CLUB</Kicker>
      </div>
      <div style={{ position: "absolute", top: 270, left: 60, right: 60, textAlign: "center", fontFamily: SERIFA }}>
        <div style={{ color: COR.texto, fontWeight: 700, fontSize: 70, lineHeight: 1.1, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>
          Já sabes o que é<br />consistência.
        </div>
        <div style={{ marginTop: 26, color: COR.texto, fontWeight: 900, fontSize: 132, lineHeight: 1.0, opacity: l2, transform: `scale(${0.7 + 0.3 * l2})` }}>
          Falta o <Ouro>como.</Ouro>
        </div>
      </div>

      {/* Janela de browser, no estilo dos cartões do site */}
      <div
        style={{
          position: "absolute", top: 700, left: 70, right: 70, height: 560, borderRadius: 30, overflow: "hidden",
          background: "linear-gradient(180deg, #16130E, #0E0C09)", border: "2px solid rgba(217,180,90,0.45)",
          boxShadow: "0 30px 90px rgba(0,0,0,.6), 0 0 70px rgba(217,180,90,0.15)",
          opacity: janela, transform: `translateY(${(1 - janela) * 80}px) scale(${0.92 + 0.08 * janela})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 26px", borderBottom: "1px solid rgba(217,180,90,0.2)" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 18, height: 18, borderRadius: 9, background: "#4A4234" }} />)}
          <div style={{ flex: 1, marginLeft: 12, background: "#0A0908", border: "1px solid #2A251A", borderRadius: 999, padding: "14px 24px", fontFamily: MONO, fontSize: 29, color: COR.texto, whiteSpace: "nowrap", overflow: "hidden" }}>
            <span style={{ color: COR.positivo }}>● </span>
            {URL.slice(0, letras)}
            <span style={{ opacity: caret ? 1 : 0, color: COR.positivo }}>|</span>
          </div>
        </div>
        {/* conteúdo desfocado da página (título serifado + cartões, como no site) */}
        <div style={{ position: "relative", padding: "34px 40px" }}>
          <div style={{ filter: "blur(13px)", opacity: interpolate(carregar, [0, 60], [0.12, 0.85]) }}>
            <div style={{ height: 46, width: "75%", background: COR.texto, borderRadius: 8 }} />
            <div style={{ height: 46, width: "55%", background: COR.positivo, borderRadius: 8, marginTop: 14 }} />
            <div style={{ height: 20, width: "88%", background: "#ffffff38", borderRadius: 6, marginTop: 26 }} />
            <div style={{ display: "flex", gap: 18, marginTop: 30 }}>
              {[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: 110, borderRadius: 16, border: "3px solid #D9B45A66" }} />)}
            </div>
          </div>
          {/* cartão de progresso igual ao dos bilhetes do site */}
          <div
            style={{
              position: "absolute", left: 40, right: 40, bottom: -150, padding: "24px 28px", borderRadius: 22,
              background: "rgba(10,9,8,0.92)", border: "2px solid rgba(217,180,90,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", color: COR.texto, fontWeight: 700, fontSize: 28 }}>
              <span>A carregar o “como”…</span>
              <span style={{ color: COR.positivo }}>{Math.round(carregar)}%</span>
            </div>
            <div style={{ height: 12, borderRadius: 6, background: "#2A251A", marginTop: 16, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${carregar}%`, background: DOURADO_GRADIENTE, borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: COR.negativo, opacity: preso ? 1 : 0 }}>
              ● O ÚLTIMO 1% ESTÁ NO SITE
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 1305, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${bio})` }}>
        <div style={{ background: DOURADO_GRADIENTE, color: "#15110A", borderRadius: 999, padding: "26px 60px", fontWeight: 800, fontSize: 40, letterSpacing: 4, boxShadow: "0 0 50px rgba(217,180,90,0.35)" }}>
          ↑ LINK NA BIO
        </div>
      </div>

      <Faixa frame={frame} />

      <Sequence layout="none"><Audio src={staticFile("sfx/whoosh_in.wav")} volume={0.15} /></Sequence>
      <Sequence from={ENTER} layout="none"><Audio src={staticFile("sfx/ui/press.mp3")} volume={0.25} /></Sequence>
    </AbsoluteFill>
  );
};

/** Faixa em movimento com palavras em itálico e ✦, como a do site. */
const Faixa: React.FC<{ frame: number }> = ({ frame }) => {
  const itens = [...FAIXA, ...FAIXA, ...FAIXA];
  return (
    <div style={{ position: "absolute", top: 1450, left: 0, right: 0, height: 86, overflow: "hidden", borderTop: "1px solid #2A251A", borderBottom: "1px solid #2A251A" }}>
      <div style={{ display: "flex", alignItems: "center", height: "100%", whiteSpace: "nowrap", transform: `translateX(${-frame * 3}px)` }}>
        {itens.map((t, i) => (
          <span key={i} style={{ fontFamily: SERIFA, fontStyle: "italic", fontSize: 40, color: COR.texto, marginRight: 38 }}>
            {t}<span style={{ color: COR.positivo, fontStyle: "normal", fontSize: 24, marginLeft: 38 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
