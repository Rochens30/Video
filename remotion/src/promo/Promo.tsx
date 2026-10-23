import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/900-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/manrope/700.css";
import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_GRADIENTE, DOURADO_TEXTO, MONO, SERIFA } from "../estilo";
import { f, VIDEO_BASE, ZOOM_BASE } from "../tempo";
import { CURTA, MontagemContext, useMontagem } from "../montagem";
import { CTAFinal } from "../CTA";
import { Legendas } from "../Legendas";
import { Efeito, EfeitosContext } from "../ui";
import { FiltroRGB, Flashes, Fugas, Grao, ruido, useTremor, Vinheta } from "./Efeitos";
import { CARIMBO, COMENTARIO, Cor, FLASHES, FUGAS, PB, Plano, PLANOS, REENQUADRAR, RELOGIO, SONS, Titulo, TITULOS, TREMORES } from "./roteiro";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONTE_BLOCO = "Montserrat, sans-serif";
export const CTA_PROMO = 5.0;
export const SOBREPOSICAO = 0.4;
export const duracaoPromo = () => CURTA.duracao + CTA_PROMO - SOBREPOSICAO;

/** Tempo do original → frame da montagem. */
const useF = () => {
  const { mapa } = useMontagem();
  return (s: number) => f(mapa(s));
};

// ------------------------------------------------------------------ orador
const ORIGEM = "45% 42%"; // âncora perto da cara: o zoom não a empurra para fora do ecrã
const ENQUADRAMENTOS = [1, 1.16, 1.06, 1.26];

const Orador: React.FC<{ semVoz: boolean }> = ({ semVoz }) => {
  const frame = useCurrentFrame();
  const F = useF();
  const { segmentos, dentro } = useMontagem();
  // Cada corte (e cada reenquadramento extra) muda o enquadramento, com um "punch" de 4 frames.
  const cortes = [...segmentos.map((s) => f(s.saida)), ...REENQUADRAR.filter(dentro).map(F)].sort((a, b) => a - b);
  const passados = cortes.filter((c) => c <= frame);
  const ultimo = passados[passados.length - 1] ?? 0;
  const desde = frame - ultimo;
  const punch = interpolate(desde, [0, 4], [1.06, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const deriva = interpolate(desde, [0, 120], [1, 1.03], clamp);
  const zoom = ZOOM_BASE * ENQUADRAMENTOS[Math.max(0, passados.length - 1) % ENQUADRAMENTOS.length] * punch * deriva;
  // fase "perder dinheiro": preto e branco com tom vermelho
  const pb = frame >= F(PB.t) && frame < F(PB.ate);
  return (
    <AbsoluteFill style={{ filter: pb ? "grayscale(1) contrast(1.3) brightness(0.8)" : undefined }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: ORIGEM }}>
        {segmentos.map((s) => {
          const de = f(s.saida);
          const dur = f(s.saida + (s.fim - s.ini)) - de;
          return (
            <Sequence key={s.ini} from={de} durationInFrames={dur} layout="none">
              <OffthreadVideo
                src={staticFile(VIDEO_BASE)}
                trimBefore={Math.round(s.ini * 30)}
                volume={(fr) => (semVoz ? 0 : interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], clamp))}
                style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {pb && <AbsoluteFill style={{ background: COR.negativo, opacity: 0.42, mixBlendMode: "color" }} />}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ B-roll em ecrã inteiro
const Planos: React.FC = () => {
  const F = useF();
  const { dentro } = useMontagem();
  return (
    <>
      {PLANOS.filter((p) => dentro(p.t)).map((p) => {
        const de = F(p.t);
        return (
          <Sequence key={p.t} from={de} durationInFrames={Math.max(1, F(p.ate) - de)} layout="none">
            <PlanoB p={p} primeiro={de === 0} />
          </Sequence>
        );
      })}
    </>
  );
};

const PlanoB: React.FC<{ p: Plano; primeiro: boolean }> = ({ p, primeiro }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [z0, z1] = p.zoom ?? [1.1, 1.25];
  const z = interpolate(frame, [0, durationInFrames], [z0, z1], { easing: Easing.inOut(Easing.quad) });
  const e = primeiro ? undefined : p.entrada;
  const punch = e === "punch" ? interpolate(frame, [0, 4], [1.14, 1], clamp) : 1;
  const desfoque = e === "punch" ? interpolate(frame, [0, 3], [10, 0], clamp) : 0;
  // whip pan: entra de lado com desfoque de movimento horizontal
  const whipX = e === "whip" ? interpolate(frame, [0, 5], [320, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
  const whipBlur = e === "whip" ? interpolate(frame, [0, 5], [45, 0], clamp) : 0;
  const id = `whip-${Math.round(p.t * 100)}`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {whipBlur > 0.5 && (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <defs>
            <filter id={id} x="-10%" y="0%" width="120%" height="100%">
              <feGaussianBlur stdDeviation={`${whipBlur} 0`} />
            </filter>
          </defs>
        </svg>
      )}
      <AbsoluteFill
        style={{
          transform: `translateX(${whipX}px) scale(${z * punch})`,
          transformOrigin: p.origem ?? "50% 50%",
          filter: whipBlur > 0.5 ? `url(#${id})` : desfoque > 0.3 ? `blur(${desfoque}px)` : undefined,
        }}
      >
        <OffthreadVideo
          src={staticFile(p.ficheiro)}
          trimBefore={Math.round(p.inicio * 30)}
          playbackRate={p.ritmo ?? 1}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ títulos cinéticos
const COR_TITULO: Record<Cor, React.CSSProperties> = {
  branco: { color: "#FFFFFF" },
  ouro: DOURADO_TEXTO,
  verde: { color: COR.ganho },
  vermelho: { color: COR.negativo },
};

const Titulos: React.FC = () => {
  const F = useF();
  const { dentro } = useMontagem();
  return (
    <>
      {TITULOS.filter((t) => dentro(t.t)).map((t) => {
        const de = F(t.t);
        return (
          <Sequence key={t.t} from={de} durationInFrames={Math.max(1, F(t.ate) - de)} layout="none">
            <TituloCinetico t={t} primeiro={de === 0} />
          </Sequence>
        );
      })}
    </>
  );
};

// largura aproximada de uma linha em Montserrat 900 maiúsculas (em "em"), para o título caber no ecrã
const largura = (l: string) =>
  [...l].reduce((w, c) => w + (/[MWAÁÃÂHNOÓÕQDGUÚCÇV]/.test(c) ? 0.86 : /[I1Í]/.test(c) ? 0.38 : c === " " ? 0.3 : 0.74), 0) + 0.03 * l.length;

const TituloCinetico: React.FC<{ t: Titulo; primeiro: boolean }> = ({ t, primeiro }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ent = primeiro ? 1 : interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const escala = interpolate(ent, [0, 1], [1.45, 1]) * interpolate(frame, [0, durationInFrames], [1, 1.04]);
  const op = Math.min(primeiro ? 1 : interpolate(frame, [0, 2], [0, 1], clamp), interpolate(frame, [durationInFrames - 2, durationInFrames], [1, 0], clamp));
  const desfoque = (1 - ent) * 12;
  const espaco = interpolate(frame, [0, durationInFrames], [0, 8]);
  // glitch: tremido + separação de cor na entrada e em pequenos "soluços"
  const soluco = t.glitch && (frame < 5 || frame % 13 === 0 || frame % 13 === 1);
  const g = soluco ? (ruido(frame + t.t) - 0.5) * 26 : 0;
  const linhas = t.texto.split("\n");
  const tam = Math.min(250, 880 / Math.max(1, ...linhas.map(largura)));
  const conta = t.contador ? Math.round(t.contador * interpolate(frame, [2, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })) : null;
  const texto = conta !== null ? `+${conta}` : t.texto;
  const topo = t.pos === "baixo" ? 1330 : 880;
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {t.pos !== "baixo" && texto && <AbsoluteFill style={{ background: "radial-gradient(70% 30% at 50% 46%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)" }} />}
      <div
        style={{
          position: "absolute", left: 60, right: 60, top: topo, transform: `translate(${g}px, -50%) scale(${escala})`,
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          filter: desfoque > 0.3 ? `blur(${desfoque}px)` : undefined,
        }}
      >
        {t.kicker && (
          <div
            style={{
              fontFamily: MONO, fontWeight: 700, fontSize: texto ? 46 : 40, letterSpacing: 8, color: texto ? COR.destaque : "#15110A",
              marginBottom: 12, textShadow: texto ? "0 4px 18px rgba(0,0,0,0.8)" : undefined,
              ...(texto ? {} : { background: DOURADO_GRADIENTE, padding: "16px 30px", borderRadius: 999, marginTop: -560 }),
            }}
          >
            {t.kicker}
          </div>
        )}
        {texto &&
          linhas.map((l, i) => (
            <div
              key={i}
              style={{
                fontFamily: FONTE_BLOCO, fontWeight: 900, fontSize: tam, lineHeight: 0.98, letterSpacing: espaco - 2, whiteSpace: "nowrap",
                filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.65))",
                textShadow: soluco ? `${g * 0.6}px 0 rgba(246,70,93,0.9), ${-g * 0.6}px 0 rgba(0,229,255,0.8)` : undefined,
                ...COR_TITULO[t.cor ?? "branco"],
              }}
            >
              {conta !== null ? texto : l}
            </div>
          ))}
        {t.sub && (
          <div style={{ marginTop: 18, background: COR.positivo, color: "#0A0908", fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 5, padding: "10px 24px", borderRadius: 999 }}>
            {t.sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ relógio "amanhã às 14h"
const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const ent = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const saida = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], clamp);
  const ALVO = [1, 4, 0, 0];
  const H = 300;
  return (
    <AbsoluteFill style={{ opacity: Math.min(ent * 1.5, saida), backdropFilter: "blur(16px) brightness(0.4)", WebkitBackdropFilter: "blur(16px) brightness(0.4)", background: "rgba(10,9,8,0.35)" }}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 140, transform: `scale(${0.9 + 0.1 * ent})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: COR.destaque }}>SÁBADO · 24 OUTUBRO</div>
        <div style={{ fontFamily: SERIFA, fontStyle: "italic", fontWeight: 900, fontSize: 150, lineHeight: 1.1, ...DOURADO_TEXTO }}>Amanhã</div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: FONTE_BLOCO, fontWeight: 900, fontSize: H * 0.95, color: "#fff", height: H, marginTop: 10 }}>
          {ALVO.map((d, i) => {
            // conta-quilómetros: cada dígito rola e pára no valor certo (o "14" assenta quando ele diz "14")
            const fim = 14 + i * 4;
            const p = interpolate(frame, [0, fim], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
            const pos = p * (10 + d);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                {i === 2 && <div style={{ width: 80, textAlign: "center", color: COR.positivo, opacity: frame % 20 < 12 ? 1 : 0.35 }}>:</div>}
                <div style={{ height: H, overflow: "hidden", width: H * 0.62 }}>
                  <div style={{ transform: `translateY(${-pos * H}px)` }}>
                    {Array.from({ length: 20 }, (_, k) => (
                      <div key={k} style={{ height: H, lineHeight: `${H}px`, textAlign: "center" }}>{k % 10}</div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 24, fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: COR.suave }}>LISBOA · DOUBLETREE BY HILTON</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ carimbo "últimos lugares"
const Carimbo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const atraso = 3; // assenta em "últimos"
  const p = interpolate(frame, [atraso, atraso + 4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const saida = interpolate(frame, [durationInFrames - 3, durationInFrames], [1, 0], clamp);
  if (frame < atraso) return null;
  return (
    <AbsoluteFill style={{ opacity: Math.min(p * 2, saida) }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center", transform: `translateY(-50%) rotate(-7deg) scale(${interpolate(p, [0, 1], [2.4, 1])})` }}>
        <div
          style={{
            border: `12px solid ${COR.negativo}`, borderRadius: 26, padding: "18px 44px 22px", background: "rgba(10,9,8,0.6)",
            fontFamily: FONTE_BLOCO, fontWeight: 900, fontSize: 118, lineHeight: 0.95, color: COR.negativo, textAlign: "center",
            boxShadow: `0 0 60px ${COR.negativo}55, 0 20px 60px rgba(0,0,0,0.6)`,
          }}
        >
          ÚLTIMOS<br />LUGARES
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ comentário "EVENTO"
const Comentario: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const F = useF();
  const ini = F(COMENTARIO.t);
  const ent = spring({ frame, fps, config: { damping: 13, mass: 0.5 } });
  const saida = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], clamp);
  const PALAVRA = "EVENTO";
  const letras = PALAVRA.split("").filter((_, i) => frame >= F(43.0 + i * 0.11) - ini).length;
  const enviado = frame >= F(43.82) - ini;
  const enviadoS = spring({ frame: frame - (F(43.82) - ini), fps, config: { damping: 11, mass: 0.5 } });
  const cursor = !enviado && frame % 16 < 9;
  return (
    <AbsoluteFill style={{ opacity: saida }}>
      <div style={{ position: "absolute", top: 210, left: 70, right: 70, transform: `translateY(${(1 - ent) * -80}px) scale(${0.9 + 0.1 * ent})`, opacity: ent }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: COR.destaque, marginBottom: 14, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>
          COMENTA AQUI EM BAIXO ↓
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(18,16,13,0.92)", border: "2px solid rgba(217,180,90,0.5)", borderRadius: 999, padding: "20px 22px 20px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: COR.fundo, border: `2px solid ${COR.positivo}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Img src={staticFile("logo.png")} style={{ width: 60 }} />
          </div>
          <div style={{ flex: 1, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 46, color: letras ? "#fff" : "#8A8478", letterSpacing: letras ? 3 : 0 }}>
            {letras ? PALAVRA.slice(0, letras) : enviado ? "" : "Adiciona um comentário…"}
            {cursor && <span style={{ color: COR.positivo }}>|</span>}
          </div>
          <div
            style={{
              fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 34, padding: "16px 28px", borderRadius: 999,
              background: letras === PALAVRA.length ? DOURADO_GRADIENTE : "#2A251A", color: letras === PALAVRA.length ? "#15110A" : "#8A8478",
              transform: `scale(${enviado ? interpolate(enviadoS, [0, 1], [0.88, 1]) : 1})`,
            }}
          >
            {enviado ? "✓" : "Publicar"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ montagem
const Sons: React.FC = () => {
  const F = useF();
  const { dentro } = useMontagem();
  return (
    <>
      {SONS.filter(([t]) => dentro(t)).map(([t, src, v], i) => (
        <Efeito key={i} src={src} volume={v * 0.6} de={Math.max(0, F(t))} />
      ))}
    </>
  );
};

const Janela: React.FC<{ j: { t: number; ate: number }; children: React.ReactNode }> = ({ j, children }) => {
  const F = useF();
  return (
    <Sequence from={F(j.t)} durationInFrames={F(j.ate) - F(j.t)} layout="none">
      {children}
    </Sequence>
  );
};

const Principal: React.FC<{ semVoz: boolean }> = ({ semVoz }) => {
  const frame = useCurrentFrame();
  const F = useF();
  const { dentro, duracao } = useMontagem();
  const tremor = useTremor(TREMORES.filter(dentro).map(F));
  // separação RGB nos títulos com glitch e na entrada do preto e branco
  const glitches = [...TITULOS.filter((t) => t.glitch).map((t) => F(t.t)), F(PB.t)];
  const emGlitch = glitches.some((g) => frame >= g && frame < g + 4);
  const d = emGlitch ? 6 + ruido(frame) * 16 : 0;
  // legendas escondidas quando há título grande, relógio ou carimbo (não repetir o mesmo texto)
  const ocupado =
    TITULOS.some((t) => t.texto && dentro(t.t) && frame >= F(t.t) && frame < F(t.ate)) ||
    [RELOGIO, CARIMBO].some((j) => frame >= F(j.t) && frame < F(j.ate));
  const flashes = [...FLASHES.filter(dentro).map(F), ...PLANOS.filter((p) => p.entrada === "flash" && dentro(p.t)).map((p) => F(p.t))];
  return (
    <AbsoluteFill style={{ background: "#000", transform: tremor }}>
      <FiltroRGB d={d} />
      <AbsoluteFill style={{ filter: [d ? "url(#rgb)" : "", "contrast(1.08) saturate(1.12)"].join(" ") }}>
        <Orador semVoz={semVoz} />
        <Planos />
      </AbsoluteFill>
      <Vinheta />
      <Fugas em={FUGAS.filter(dentro).map(F)} />
      <Janela j={RELOGIO}><Relogio /></Janela>
      <Janela j={COMENTARIO}><Comentario /></Janela>
      <Titulos />
      <Janela j={CARIMBO}><Carimbo /></Janela>
      {!ocupado && <Legendas divisao={0} y={1150} />}
      <Flashes em={flashes} />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(frame / f(duracao)) * 100}%`, background: DOURADO_GRADIENTE }} />
      <Sons />
    </AbsoluteFill>
  );
};

export const Promo: React.FC<{ semEfeitos?: boolean; semVoz?: boolean }> = ({ semEfeitos = false, semVoz = false }) => {
  const inicioCta = f(CURTA.duracao - SOBREPOSICAO);
  return (
    <EfeitosContext.Provider value={!semEfeitos}>
      <MontagemContext.Provider value={CURTA}>
        <AbsoluteFill style={{ background: "#000" }}>
          <Sequence durationInFrames={f(CURTA.duracao)}>
            <Principal semVoz={semVoz} />
          </Sequence>
          <Sequence from={inicioCta} durationInFrames={f(CTA_PROMO)}>
            <CTAFinal deslizar={false} />
            <Fugas em={[0]} />
            <Flashes em={[0]} />
            <Efeito src="sfx/boom.wav" volume={0.25} />
          </Sequence>
          <Grao />
        </AbsoluteFill>
      </MontagemContext.Provider>
    </EfeitosContext.Provider>
  );
};
