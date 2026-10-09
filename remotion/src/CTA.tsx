import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, DOURADO_GRADIENTE, FONTE, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Ouro, useEntrada, Efeito } from "./ui";

const URL = "homepage.forexacademyclub.com";
// Textos do vídeo atual (vídeo 1: "Consistência não é sorte." / "Aprende-se."; vídeo 2: "Avalia decisões," / "não resultados.")
const LINHA1 = "Acertar não chega.";
const LINHA2 = "Respeita o plano.";
const SUB = "Risco, Stop Loss e Take Profit";

// Conta final antes do CTA (null = sem conta). Vídeo 3: a gravação acaba em "ganhámos 3R" —
// a conta termina com os números que ele próprio deu (6 × 0,5R e 4 × −1R).
const CONTA: { dur: number; linhas: { texto: string; valor: string; cor: "ganho" | "negativo" }[]; total: string; nota: string } | null = {
  dur: 3.0,
  linhas: [
    { texto: "6 ganhos × 0,5R", valor: "+3R", cor: "ganho" },
    { texto: "4 perdas × 1R", valor: "−4R", cor: "negativo" },
  ],
  total: "−1R",
  nota: "com 60% de acerto",
};
const CLIQUE = f(2.9);
const FAIXA = ["Consistência", "Mesmo risco", "Mesmo critério", "Diário", "Plano", "Zero promessas milagrosas"];

/** CTA: (conta final) → logótipo → promessa curta → botão "QUERO SABER MAIS" com toque → link na bio. */
export const CTA: React.FC = () => {
  const entrada = useEntrada(0, 16);
  if (!CONTA) return <CTAFinal deslizar />;
  return (
    <AbsoluteFill style={{ transform: `translateY(${(1 - entrada) * 1920}px)`, background: `radial-gradient(90% 50% at 50% 35%, #241D0F 0%, ${COR.fundo} 68%)` }}>
      <Sequence durationInFrames={f(CONTA.dur) + 8} layout="none">
        <Conta conta={CONTA} />
      </Sequence>
      <Sequence from={f(CONTA.dur)} layout="none">
        <CTAFinal deslizar={false} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Conta: React.FC<{ conta: NonNullable<typeof CONTA> }> = ({ conta }) => {
  const frame = useCurrentFrame();
  const fim = f(conta.dur);
  const saida = interpolate(frame, [fim - 4, fim + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const total = useEntrada(f(1.5), 9);
  return (
    <AbsoluteFill style={{ fontFamily: FONTE, opacity: saida, filter: saida < 0.98 ? `blur(${(1 - saida) * 10}px)` : undefined,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 260 }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: COR.positivo, marginBottom: 40 }}>— A CONTA FINAL</div>
      {conta.linhas.map((l, i) => <LinhaConta key={l.texto} {...l} inicio={f(0.25 + i * 0.6)} />)}
      <div style={{ width: 760, height: 4, background: "#2A251A", margin: "26px 0 20px" }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 30, opacity: total, transform: `scale(${0.6 + 0.4 * total})` }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: COR.texto }}>TOTAL</span>
        <span style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 170, color: COR.negativo, lineHeight: 1 }}>{conta.total}</span>
      </div>
      <div style={{ marginTop: 18, fontFamily: SERIFA, fontStyle: "italic", fontSize: 50, color: COR.suave, opacity: total }}>{conta.nota}</div>
      <Efeito src="sfx/impacto.wav" volume={0.15} de={f(1.5) + 3} />
    </AbsoluteFill>
  );
};

const LinhaConta: React.FC<{ texto: string; valor: string; cor: "ganho" | "negativo"; inicio: number }> = ({ texto, valor, cor, inicio }) => {
  const s = useEntrada(inicio, 12);
  return (
    <div style={{ width: 760, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: s, transform: `translateX(${(1 - s) * -60}px)`, margin: "8px 0" }}>
      <span style={{ fontFamily: SERIFA, fontWeight: 700, fontSize: 58, color: COR.texto }}>{texto}</span>
      <span style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 80, color: COR[cor] }}>{valor}</span>
    </div>
  );
};

/** Logótipo → promessa curta → botão "QUERO SABER MAIS" com toque → link na bio. */
const CTAFinal: React.FC<{ deslizar: boolean }> = ({ deslizar }) => {
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
        fontFamily: FONTE,
        ...(deslizar ? { transform: `translateY(${(1 - entrada) * 1920}px)` } : { opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" }) }),
        background: `radial-gradient(90% 50% at 50% 25%, #241D0F 0%, ${COR.fundo} 68%)`,
      }}
    >
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("logo.png")} style={{ width: 400, opacity: logo, transform: `scale(${0.8 + 0.2 * logo})`, filter: "drop-shadow(0 10px 40px rgba(217,180,90,0.25))" }} />
      </div>

      <div style={{ position: "absolute", top: 560, left: 60, right: 60, textAlign: "center", fontFamily: SERIFA }}>
        <div style={{ color: COR.texto, fontWeight: 700, fontSize: 72, lineHeight: 1.08, opacity: l1, transform: `translateY(${(1 - l1) * 30}px)` }}>
          {LINHA1}
        </div>
        <div style={{ marginTop: 14, color: COR.texto, fontWeight: 900, fontSize: 104, lineHeight: 1.02, opacity: l2, transform: `scale(${0.75 + 0.25 * l2})` }}>
          <Ouro>{LINHA2}</Ouro>
        </div>
      </div>

      <div style={{ position: "absolute", top: 860, left: 90, right: 90, textAlign: "center", color: COR.suave, fontSize: 38, lineHeight: 1.4, opacity: l2 }}>
        {SUB}<br />— <span style={{ color: COR.texto, fontWeight: 700 }}>com método.</span>
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

      <Efeito src="sfx/whoosh_in.wav" volume={0.15} />
      <Efeito src="sfx/clique_rato_1.wav" volume={0.35} de={CLIQUE - 1} />
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
