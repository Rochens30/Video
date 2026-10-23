import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/900-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import "@fontsource/manrope/700.css";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_GRADIENTE, DOURADO_TEXTO, larguraBloco, MONO } from "../estilo";
import { f, VIDEO_BASE } from "../tempo";
import { CURTA, MontagemContext, useMontagem } from "../montagem";
import { CTAFinal } from "../CTA";
import { Legendas } from "../Legendas";
import { Efeito, EfeitosContext } from "../ui";
import { FiltroRGB, Fugas, Grao, ruido, useTremor, Vinheta } from "./Efeitos";
import { Carimbo, Comentario, Relogio } from "./Momentos";
import { CARIMBO, COMENTARIO, Cor, FLASHES, FUGAS, PB, Plano, PLANOS, REENQUADRAR, RELOGIO, Titulo, TITULOS, TREMORES } from "./roteiro";
import inicios from "./inicios.json";
import cara from "./cara.json";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONTE_BLOCO = "Montserrat, sans-serif";
export const CTA_PROMO = 5.0;
export const SOBREPOSICAO = 0.4;
export const duracaoPromo = () => CURTA.duracao + CTA_PROMO - SOBREPOSICAO;

// Margens seguras do Reel: o texto fica numa coluna central de 840 px (120 px de cada lado — à direita estão os botões).
const LARGURA_UTIL = 840;
const W = 1080;
const ANTECIPA = 2; // a imagem muda 2 frames antes da palavra (o olho chega antes do ouvido)
const TR = 6; // frames de cada transição (3 antes e 3 depois do corte)

// ------------------------------------------------------------------ tempos
/** Início de palavra do ASR → ataque real da sílaba (scripts/afinar_palavras.py). */
const afina = (t: number) => (inicios as number[][]).find(([a]) => Math.abs(a - t) < 0.005)?.[1] ?? t;

/** Frame do corte para uma palavra (tempo do original), já com a montagem e a antecipação. */
const useCorte = () => {
  const { mapa } = useMontagem();
  return (t: number) => Math.max(0, f(mapa(afina(t))) - ANTECIPA);
};

/** Progresso 0→1 de uma transição centrada no frame `c`. */
const prog = (frame: number, c: number) =>
  interpolate(frame, [c - TR / 2, c + TR / 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const emTransicao = (frame: number, c: number) => c > 0 && frame >= c - TR / 2 && frame < c + TR / 2;

type PlanoF = Plano & { a: number; b: number; daOrador: boolean; paraOrador: boolean };
const usePlanos = (): PlanoF[] => {
  const corte = useCorte();
  const { dentro } = useMontagem();
  const ps = PLANOS.filter((p) => dentro(p.t)).map((p) => ({ ...p, a: corte(p.t), b: corte(p.ate) }));
  return ps.map((p) => ({
    ...p,
    daOrador: !ps.some((q) => Math.abs(q.b - p.a) <= 1),
    paraOrador: !ps.some((q) => Math.abs(q.a - p.b) <= 1),
  }));
};

type Estado = { x: number; s: number; blur: number; blurH: number; visivel: boolean };
const PARADO: Estado = { x: 0, s: 1, blur: 0, blurH: 0, visivel: true };

/** Como está um plano B-roll neste frame (entra e sai com whip pan, zoom-through ou corte seco). */
const estadoPlano = (frame: number, p: PlanoF): Estado => {
  if (frame < p.a - TR / 2 || frame >= p.b + TR / 2) return { ...PARADO, visivel: false };
  if (emTransicao(frame, p.a)) {
    const q = prog(frame, p.a);
    if (p.entrada === "whip") return { ...PARADO, x: (1 - q) * W, blurH: Math.sin(q * Math.PI) * 70 };
    if (p.entrada === "zoom") return { ...PARADO, s: 1 + (1 - q) * 0.55, blur: Math.sin(q * Math.PI) * 16, visivel: q >= 0.5 };
    return { ...PARADO, visivel: frame >= p.a };
  }
  if (emTransicao(frame, p.b)) {
    const q = prog(frame, p.b);
    if (p.saida === "whip") return { ...PARADO, x: -q * W, blurH: Math.sin(q * Math.PI) * 70 };
    if (p.saida === "zoom") return { ...PARADO, s: 1 + q * 0.55, blur: Math.sin(q * Math.PI) * 16, visivel: q < 0.5 };
    return { ...PARADO, visivel: frame < p.b };
  }
  return PARADO;
};

/** O orador sai/entra em conjunto com o plano (os dois movem-se juntos — nunca aparece fundo preto). */
const estadoOrador = (frame: number, planos: PlanoF[]): Estado => {
  for (const p of planos) {
    if (p.daOrador && emTransicao(frame, p.a)) {
      const q = prog(frame, p.a);
      if (p.entrada === "whip") return { ...PARADO, x: -q * W, blurH: Math.sin(q * Math.PI) * 70 };
      if (p.entrada === "zoom") return { ...PARADO, s: 1 + q * 0.55, blur: Math.sin(q * Math.PI) * 16 };
    }
    if (p.paraOrador && emTransicao(frame, p.b)) {
      const q = prog(frame, p.b);
      if (p.saida === "whip") return { ...PARADO, x: (1 - q) * W, blurH: Math.sin(q * Math.PI) * 70 };
      if (p.saida === "zoom") return { ...PARADO, s: 1 + (1 - q) * 0.55, blur: Math.sin(q * Math.PI) * 16 };
    }
  }
  return PARADO;
};

/** Desfoque de movimento horizontal (SVG) com id próprio por camada. */
const DesfoqueH: React.FC<{ id: string; v: number }> = ({ id, v }) =>
  v > 0.5 ? (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <defs>
        <filter id={id} x="-15%" y="0%" width="130%" height="100%">
          <feGaussianBlur stdDeviation={`${v} 0`} />
        </filter>
      </defs>
    </svg>
  ) : null;

const filtros = (id: string, e: Estado, extra?: string) =>
  [e.blurH > 0.5 ? `url(#${id})` : "", e.blur > 0.3 ? `blur(${e.blur}px)` : "", extra ?? ""].join(" ").trim() || undefined;

// ------------------------------------------------------------------ orador (cara sempre centrada)
const ALVO_CARA = 300; // altura da cara no ecrã (px) no enquadramento base
const Y_CARA = 640; // centro da cara no ecrã — acima das legendas (1150) e dos títulos (1330)
const NIVEIS = [1, 1.14, 1.05, 1.22];
const CARA = cara as { passo: number; x: number[]; y: number[]; h: number[] };
const naCara = (v: number[], t: number) => v[Math.max(0, Math.min(v.length - 1, Math.round(t / CARA.passo)))];

const Orador: React.FC<{ semVoz: boolean; estado: Estado }> = ({ semVoz, estado }) => {
  const frame = useCurrentFrame();
  const corte = useCorte();
  const { segmentos, dentro } = useMontagem();
  const t = frame / 30;
  // tempo no ficheiro original (para saber onde está a cara)
  const seg = segmentos.find((s) => t >= s.saida && t < s.saida + (s.fim - s.ini)) ?? segmentos[segmentos.length - 1];
  const tOrig = seg.ini + (t - seg.saida);
  const cx = naCara(CARA.x, tOrig) * W;
  const cy = naCara(CARA.y, tOrig) * 1920;
  const h = naCara(CARA.h, tOrig) * 1920;
  // Mudanças de enquadramento: jump cut = troca seca com "punch" de 3 frames; palavra forte = aproximação suave de 8 frames.
  const eventos = [
    ...segmentos.slice(1).map((s) => ({ fr: f(s.saida), suave: false })),
    ...REENQUADRAR.filter(dentro).map((x) => ({ fr: corte(x), suave: true })),
  ].sort((a, b) => a.fr - b.fr);
  const passados = eventos.filter((e) => e.fr <= frame);
  const k = passados.length;
  const ult = passados[k - 1];
  const desde = ult ? frame - ult.fr : frame;
  let nivel = NIVEIS[k % NIVEIS.length];
  if (ult?.suave) nivel = interpolate(desde, [0, 8], [NIVEIS[(k - 1) % NIVEIS.length], nivel], { ...clamp, easing: Easing.out(Easing.cubic) });
  const punch = ult && !ult.suave ? interpolate(desde, [0, 3], [1.04, 1], clamp) : 1;
  const deriva = interpolate(desde, [0, 150], [1, 1.05], clamp);
  const z = Math.min(2.3, Math.max(1.35, ALVO_CARA / h)) * nivel * punch * deriva;
  // põe a cara em (540, Y_CARA) sem deixar ver as bordas do vídeo
  const tx = Math.min(0, Math.max(W - W * z, W / 2 - z * cx));
  const ty = Math.min(0, Math.max(1920 - 1920 * z, Y_CARA - z * cy));
  const pb = frame >= corte(PB.t) && frame < corte(PB.ate);
  return (
    <AbsoluteFill style={{ transform: `translateX(${estado.x}px) scale(${estado.s})`, filter: filtros("hb-orador", estado, pb ? "grayscale(1) contrast(1.3) brightness(0.8)" : undefined) }}>
      <DesfoqueH id="hb-orador" v={estado.blurH} />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${z})`, transformOrigin: "0 0" }}>
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
const RAMPA = 10; // frames iniciais acelerados (speed ramp) que assentam na velocidade normal
const PlanoB: React.FC<{ p: PlanoF }> = ({ p }) => {
  const frame = useCurrentFrame(); // relativo ao início da Sequence (p.a - 3)
  const inicioSeq = Math.max(0, p.a - TR / 2);
  const abs = inicioSeq + frame;
  const e = estadoPlano(abs, p);
  if (!e.visivel) return null;
  const dur = p.b - p.a;
  const [z0, z1] = p.zoom ?? [1.1, 1.25];
  const z = interpolate(abs - p.a, [0, dur], [z0, z1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const ritmo = p.ritmo ?? 1;
  const rapido = p.a > 0 ? 2.4 : ritmo; // o 1.º plano (capa) não leva rampa
  const t0 = Math.round(p.inicio * 30);
  const id = `hb-${Math.round(p.t * 100)}`;
  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateX(${e.x}px) scale(${e.s})`, filter: filtros(id, e) }}>
      <DesfoqueH id={id} v={e.blurH} />
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: p.origem ?? "50% 50%", background: "#000" }}>
        <Sequence durationInFrames={RAMPA + TR / 2} layout="none">
          <OffthreadVideo src={staticFile(p.ficheiro)} trimBefore={t0} playbackRate={rapido} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Sequence>
        <Sequence from={RAMPA + TR / 2} layout="none">
          <OffthreadVideo
            src={staticFile(p.ficheiro)}
            trimBefore={t0 + Math.round((RAMPA + TR / 2) * rapido)}
            playbackRate={ritmo}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Planos: React.FC<{ planos: PlanoF[] }> = ({ planos }) => (
  <>
    {planos.map((p) => {
      const de = Math.max(0, p.a - TR / 2);
      return (
        <Sequence key={p.t} from={de} durationInFrames={p.b + TR / 2 - de} layout="none">
          <PlanoB p={p} />
        </Sequence>
      );
    })}
  </>
);

// ------------------------------------------------------------------ títulos cinéticos
const COR_TITULO: Record<Cor, React.CSSProperties> = {
  branco: { color: "#FFFFFF" },
  ouro: DOURADO_TEXTO,
  verde: { color: COR.ganho },
  vermelho: { color: COR.negativo },
};

const Titulos: React.FC = () => {
  const corte = useCorte();
  const { dentro } = useMontagem();
  return (
    <>
      {TITULOS.filter((t) => dentro(t.t)).map((t) => {
        const de = corte(t.t);
        return (
          <Sequence key={t.t} from={de} durationInFrames={Math.max(1, corte(t.ate) - de)} layout="none">
            <TituloCinetico t={t} primeiro={de === 0} />
          </Sequence>
        );
      })}
    </>
  );
};

const TituloCinetico: React.FC<{ t: Titulo; primeiro: boolean }> = ({ t, primeiro }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const subir = t.entrada === "subir";
  const bater = primeiro ? 1 : interpolate(frame, [0, 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const escala = (subir ? 1 : interpolate(bater, [0, 1], [1.35, 1])) * interpolate(frame, [0, durationInFrames], [1, 1.03]);
  const saida = interpolate(frame, [durationInFrames - 3, durationInFrames], [0, 1], clamp);
  const op = Math.min(primeiro || subir ? 1 : interpolate(frame, [0, 2], [0, 1], clamp), 1 - saida);
  const desfoque = subir ? 0 : (1 - bater) * 10;
  const soluco = t.glitch && frame < 4;
  const g = soluco ? (ruido(frame + t.t) - 0.5) * 22 : 0;
  const linhas = t.texto.split("\n");
  const tam = Math.min(230, LARGURA_UTIL / Math.max(1, ...linhas.map(larguraBloco)));
  const conta = t.contador ? Math.round(t.contador * interpolate(frame, [2, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) })) : null;
  const topo = t.pos === "baixo" ? 1330 : 900;
  const sub = interpolate(frame, [5, 11], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ opacity: op }}>
      {t.pos !== "baixo" && <AbsoluteFill style={{ background: "radial-gradient(70% 30% at 50% 47%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)" }} />}
      <div
        style={{
          position: "absolute", left: (W - LARGURA_UTIL) / 2, width: LARGURA_UTIL, top: topo,
          transform: `translate(${g}px, calc(-50% - ${saida * 24}px)) scale(${escala})`,
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
          filter: desfoque > 0.3 ? `blur(${desfoque}px)` : undefined,
        }}
      >
        {t.kicker && (
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: COR.destaque, marginBottom: 10, textShadow: "0 4px 18px rgba(0,0,0,0.85)", opacity: subir ? interpolate(frame, [0, 6], [0, 1], clamp) : 1 }}>
            {t.kicker}
          </div>
        )}
        {linhas.map((l, i) => {
          // "subir": cada linha sobe por trás de uma máscara, com 2 frames de atraso entre linhas
          const y = subir && !primeiro ? interpolate(frame, [i * 2, i * 2 + 7], [110, 0], { ...clamp, easing: Easing.out(Easing.cubic) }) : 0;
          return (
            <div key={i} style={{ overflow: "hidden", padding: "0 10px" }}>
              <div
                style={{
                  transform: `translateY(${y}%)`,
                  fontFamily: FONTE_BLOCO, fontWeight: 900, fontSize: tam, lineHeight: 1.0, letterSpacing: -2, whiteSpace: "nowrap",
                  filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.65))",
                  textShadow: soluco ? `${g * 0.6}px 0 rgba(246,70,93,0.9), ${-g * 0.6}px 0 rgba(0,229,255,0.8)` : undefined,
                  ...COR_TITULO[t.cor ?? "branco"],
                }}
              >
                {conta !== null ? `+${conta}` : l}
              </div>
            </div>
          );
        })}
        {t.sub && (
          <div style={{ marginTop: 16, transform: `scale(${primeiro ? 1 : sub})`, background: COR.positivo, color: "#0A0908", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 4, padding: "10px 22px", borderRadius: 999, whiteSpace: "nowrap" }}>
            {t.sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ som: um só efeito, sopro de ar suave
const SOPROS = [0.42, 0.5, 0.36]; // durações de sopro_1..3 (o pico está a 55 %)
const Sopro: React.FC<{ em: number; i: number; volume?: number }> = ({ em, i, volume = 0.08 }) => {
  const k = i % 3;
  return <Efeito src={`sfx/sopro_${k + 1}.wav`} volume={volume} de={Math.max(0, em - Math.round(SOPROS[k] * 0.55 * 30))} />;
};

// ------------------------------------------------------------------ montagem
const Janela: React.FC<{ j: { t: number; ate: number }; children: React.ReactNode }> = ({ j, children }) => {
  const corte = useCorte();
  return (
    <Sequence from={corte(j.t)} durationInFrames={corte(j.ate) - corte(j.t)} layout="none">
      {children}
    </Sequence>
  );
};

const Principal: React.FC<{ semVoz: boolean }> = ({ semVoz }) => {
  const frame = useCurrentFrame();
  const corte = useCorte();
  const { dentro, duracao } = useMontagem();
  const planos = usePlanos();
  const tremor = useTremor(TREMORES.filter(dentro).map(corte));
  // separação RGB só na entrada de "inconsistência"
  const glitch = TITULOS.filter((t) => t.glitch).map((t) => corte(t.t)).some((g) => frame >= g && frame < g + 3);
  const d = glitch ? 6 + ruido(frame) * 12 : 0;
  // flash de exposição (não um ecrã branco): o brilho sobe e desce em 7 frames
  const flashes = [...FLASHES.filter(dentro).map(corte), ...planos.filter((p) => p.entrada === "flash" && p.a > 0).map((p) => p.a)];
  const brilho = 1 + Math.max(0, ...flashes.map((c) => interpolate(frame - c, [-1, 0, 6], [0, 1.3, 0], clamp)));
  const ocupado =
    TITULOS.some((t) => dentro(t.t) && frame >= corte(t.t) && frame < corte(t.ate)) ||
    [RELOGIO, CARIMBO].some((j) => frame >= corte(j.t) && frame < corte(j.ate));
  // um sopro (~12 dB abaixo da voz) só nos whip pans, nos flashes e nos momentos especiais — ~14 no vídeo
  const sopros = [
    ...planos.flatMap((p) => [
      ...(p.a > 0 && (p.entrada === "whip" || p.entrada === "flash") ? [p.a] : []),
      ...(p.saida === "whip" ? [p.b] : []),
    ]),
    corte(RELOGIO.t), corte(CARIMBO.t), corte(COMENTARIO.t),
  ].filter((v, i, xs) => xs.indexOf(v) === i).sort((a, b) => a - b);
  return (
    <AbsoluteFill style={{ background: "#000", transform: tremor }}>
      <FiltroRGB d={d} />
      <AbsoluteFill style={{ filter: [d ? "url(#rgb)" : "", `contrast(1.08) saturate(1.12) brightness(${brilho})`].join(" ") }}>
        <Orador semVoz={semVoz} estado={estadoOrador(frame, planos)} />
        <Planos planos={planos} />
      </AbsoluteFill>
      <Vinheta />
      <Fugas em={FUGAS.filter(dentro).map(corte)} />
      <Janela j={RELOGIO}><Relogio /></Janela>
      <Janela j={COMENTARIO}><Comentario /></Janela>
      <Titulos />
      <Janela j={CARIMBO}><Carimbo /></Janela>
      {!ocupado && <Legendas divisao={0} y={1150} largura={LARGURA_UTIL} />}
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${(frame / f(duracao)) * 100}%`, background: DOURADO_GRADIENTE }} />
      {sopros.map((c, i) => <Sopro key={c} em={c} i={i} />)}
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
            <CTAFinal deslizar={false} desce={60} sons={false} />
            <Fugas em={[0]} />
            <Sopro em={3} i={1} />
          </Sequence>
          <Grao />
        </AbsoluteFill>
      </MontagemContext.Provider>
    </EfeitosContext.Provider>
  );
};
