import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/900-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import { AbsoluteFill, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_GRADIENTE, FONTE, MONO, SERIFA } from "../estilo";
import { Kicker, Ouro } from "../ui";
import { VelasSerie } from "../cenas/graficos";

/*
 * Stories (9:16, só texto) para forexacademyclub.com/cursoiniciante/.
 * Argumento: problema → causa → solução → prova → ação.
 * Zonas seguras dos Stories: nada importante acima de y≈250 (barra de progresso/nome) nem abaixo de y≈1600 (caixa de resposta).
 * Factos usados: só os que estão no site (capturas enviadas pelo utilizador).
 */

export const DURACOES = [10, 11, 12, 10, 10]; // segundos de cada Story (tempo de leitura)

// ---------------------------------------------------------------- utilitários
const useMola = (inicioSeg: number, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(inicioSeg * fps), fps, config: { damping, mass: 0.6 } });
};

/** Entrada com subida, escala e motion blur. */
const Surge: React.FC<{ em: number; children: React.ReactNode; style?: React.CSSProperties; de?: "baixo" | "esq" | "dir" }> = ({ em, children, style, de = "baixo" }) => {
  const s = useMola(em);
  const desl = (1 - s) * 70;
  const t = de === "baixo" ? `translateY(${desl}px)` : `translateX(${de === "esq" ? -desl : desl}px)`;
  return <div style={{ opacity: Math.min(1, s * 1.4), transform: `${t} scale(${0.92 + 0.08 * s})`, filter: s < 0.8 ? `blur(${(0.8 - s) * 14}px)` : undefined, ...style }}>{children}</div>;
};

const Fundo: React.FC<{ brilho?: string; children?: React.ReactNode }> = ({ brilho = "#241D0F", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(90% 55% at 50% 35%, ${brilho} 0%, ${COR.fundo} 70%)`, fontFamily: FONTE }}>
    <VelasFundo />
    {children}
  </AbsoluteFill>
);

const VelasFundo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.07, transform: `translateX(${-frame * 0.6}px)` }}>
      {Array.from({ length: 50 }, (_, i) => {
        const x = i * 34, meio = 1000 + Math.sin(i * 0.5) * 120 + Math.sin(i * 1.7) * 40, h = 20 + ((i * 37) % 40);
        const cor = (i * 7) % 3 ? COR.ganho : COR.negativo;
        return (
          <g key={i}>
            <line x1={x + 8} x2={x + 8} y1={meio - h - 20} y2={meio + h + 20} stroke={cor} strokeWidth={2} />
            <rect x={x} y={meio - h} width={16} height={h * 2} fill={cor} />
          </g>
        );
      })}
    </svg>
  );
};

/** B-roll: trecho das gravações com aproximação lenta (Ken Burns) e escurecido. */
const BRoll: React.FC<{ inicio: number; zoom: [number, number]; origem: string; escuro?: number }> = ({ inicio, zoom, origem, escuro = 0.62 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], zoom);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: origem }}>
        <OffthreadVideo src={staticFile("broll/secretaria.mp4")} trimBefore={Math.round(inicio * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(10,9,8,${escuro + 0.15}) 0%, rgba(10,9,8,${escuro}) 45%, rgba(10,9,8,${escuro + 0.25}) 100%)` }} />
    </AbsoluteFill>
  );
};

const Marca: React.FC = () => (
  <div style={{ position: "absolute", top: 1500, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 0.85 }}>
    <Kicker style={{ fontSize: 22 }}>FOREX ACADEMY CLUB</Kicker>
  </div>
);

const Seguinte: React.FC<{ em: number; texto?: string }> = ({ em, texto = "Toca para continuar" }) => {
  const frame = useCurrentFrame();
  const s = useMola(em);
  return (
    <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s }}>
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: COR.suave, transform: `translateX(${Math.sin(frame / 6) * 8}px)` }}>
        {texto.toUpperCase()} →
      </div>
    </div>
  );
};

const Titulo: React.FC<{ children: React.ReactNode; tamanho?: number; style?: React.CSSProperties }> = ({ children, tamanho = 96, style }) => (
  <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: tamanho, lineHeight: 1.04, color: COR.texto, textAlign: "center", ...style }}>{children}</div>
);

const Contador: React.FC<{ de: number; ate: number; inicio: number; dur: number; prefixo?: string; sufixo?: string }> = ({ de, ate, inicio, dur, prefixo = "", sufixo = "" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [inicio * fps, (inicio + dur) * fps], [de, ate], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - (1 - x) ** 3 });
  return <>{prefixo}{Math.round(v)}{sufixo}</>;
};

// ---------------------------------------------------------------- Story 1 — o problema
export const Story1: React.FC = () => {
  const barras = [0.62, 0.8, 0.55, 0.9, 0.7, 0.85, 0.6, 0.78, 0.35, 0.4];
  return (
    <Fundo brilho="#2A1210">
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Surge em={0}><Kicker cor={COR.negativo}>A REALIDADE QUE NINGUÉM MOSTRA</Kicker></Surge>
        <Surge em={0.2} style={{ marginTop: 40 }}>
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 190, lineHeight: 1, color: COR.texto, textAlign: "center" }}>
            <Contador de={0} ate={74} inicio={0.2} dur={1.2} />–<span style={{ color: COR.negativo }}><Contador de={0} ate={84} inicio={0.4} dur={1.3} />%</span>
          </div>
        </Surge>
        <Surge em={1.4} style={{ marginTop: 20 }}><Titulo tamanho={66}>das contas de retalho<br /><Ouro cor={COR.negativo}>perdem dinheiro.</Ouro></Titulo></Surge>
        <Surge em={2.6} style={{ marginTop: 40, display: "flex", alignItems: "flex-end", gap: 16, height: 180 }}>
          {barras.map((b, i) => <Barra key={i} h={b} i={i} cor={i < 8 ? COR.negativo : COR.positivo} />)}
        </Surge>
        <Surge em={3.4} style={{ marginTop: 30 }}>
          <div style={{ fontSize: 34, color: COR.suave, textAlign: "center", lineHeight: 1.35 }}>Segundo os números que as próprias corretoras<br />são obrigadas a publicar.</div>
        </Surge>
        <Surge em={5.5} style={{ marginTop: 46 }}><Titulo tamanho={66}>E o motivo é<br /><Ouro>quase sempre o mesmo.</Ouro></Titulo></Surge>
      </div>
      <Seguinte em={7.5} />
      <Marca />
    </Fundo>
  );
};

const Barra: React.FC<{ h: number; i: number; cor: string }> = ({ h, i, cor }) => {
  const s = useMola(2.6 + i * 0.08, 14);
  return <div style={{ width: 62, height: 170 * h * s, borderRadius: 10, background: cor, opacity: 0.9 }} />;
};

// ---------------------------------------------------------------- Story 2 — a causa
export const Story2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const risca = interpolate(frame, [3.2 * fps, 3.7 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const causas = ["Sem método", "Sem gestão de risco", "Decisões tomadas no momento"];
  return (
    <Fundo>
      <div style={{ position: "absolute", top: 290, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Surge em={0}><Kicker>NAS REDES SOCIAIS</Kicker></Surge>
        <Surge em={0.3} style={{ marginTop: 30, position: "relative" }}>
          <Titulo tamanho={84}>Ser trader rentável<br />parece <Ouro>fácil.</Ouro></Titulo>
          <svg width={940} height={200} style={{ position: "absolute", left: -20, top: 0 }}>
            <line x1={110} y1={165} x2={110 + 720 * risca} y2={165 - 130 * risca} stroke={COR.negativo} strokeWidth={14} strokeLinecap="round" opacity={risca > 0 ? 1 : 0} />
          </svg>
        </Surge>
        <Surge em={1.3} style={{ marginTop: 34, display: "flex", gap: 18 }}>
          {["Carros desportivos", "Ecrãs verdes", "Capturas a dedo"].map((t) => (
            <div key={t} style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 2, color: COR.suave, border: "2px solid #2A251A", borderRadius: 999, padding: "10px 18px" }}>{t.toUpperCase()}</div>
          ))}
        </Surge>
        <Surge em={4.0} style={{ marginTop: 70 }}><Titulo tamanho={74}>A realidade é outra.<br /><Ouro>Quem perde, perde porque:</Ouro></Titulo></Surge>
        <div style={{ marginTop: 40, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          {causas.map((c, i) => (
            <Surge key={c} em={5.4 + i * 0.9} de="esq">
              <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "22px 28px", borderRadius: 24, background: `${COR.negativo}14`, border: `2px solid ${COR.negativo}88` }}>
                <svg width={56} height={56} viewBox="0 0 56 56"><path d="M14 14 L42 42 M42 14 L14 42" stroke={COR.negativo} strokeWidth={8} strokeLinecap="round" /></svg>
                <div style={{ fontWeight: 800, fontSize: 46, color: COR.texto }}>{c}</div>
              </div>
            </Surge>
          ))}
        </div>
      </div>
      <Seguinte em={8.6} texto="E isto tem solução" />
      <Marca />
    </Fundo>
  );
};

// ---------------------------------------------------------------- Story 3 — a solução (B-roll dos manuais)
export const Story3: React.FC = () => {
  const pilares = ["Um método claro, passo a passo", "Gestão de risco desde a 1.ª trade", "Um plano antes de cada entrada"];
  return (
    <AbsoluteFill style={{ fontFamily: FONTE, background: COR.fundo }}>
      <BRoll inicio={1.5} zoom={[1.12, 1.25]} origem="50% 80%" escuro={0.5} />
      <div style={{ position: "absolute", top: 290, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Surge em={0}><Kicker>A SOLUÇÃO</Kicker></Surge>
        <Surge em={0.3} style={{ marginTop: 26 }}><Titulo tamanho={96}>Curso<br /><Ouro>Iniciante</Ouro></Titulo></Surge>
        <Surge em={1.3} style={{ marginTop: 24 }}>
          <div style={{ fontSize: 40, color: COR.texto, textAlign: "center", lineHeight: 1.35, fontWeight: 600 }}>Começa pelo que separa quem<br />ganha de quem perde:</div>
        </Surge>
        <div style={{ marginTop: 44, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          {pilares.map((p, i) => (
            <Surge key={p} em={2.6 + i * 1.1} de="dir">
              <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "24px 28px", borderRadius: 24, background: "rgba(10,9,8,0.82)", border: `2px solid ${COR.ganho}99` }}>
                <svg width={58} height={58} viewBox="0 0 58 58"><rect x={3} y={3} width={52} height={52} rx={14} fill={`${COR.ganho}33`} stroke={COR.ganho} strokeWidth={4} /><path d="M15 30 L25 40 L44 18" fill="none" stroke={COR.ganho} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div style={{ fontWeight: 800, fontSize: 42, color: COR.texto }}>{p}</div>
              </div>
            </Surge>
          ))}
        </div>
        <Surge em={6.6} style={{ marginTop: 50 }}>
          <div style={{ border: `3px solid ${COR.positivo}`, color: COR.positivo, borderRadius: 999, padding: "14px 34px", fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 5, background: "rgba(10,9,8,0.8)" }}>
            ✦ ZERO PROMESSAS MILAGROSAS ✦
          </div>
        </Surge>
      </div>
      <Seguinte em={9} texto="Quem está por trás" />
      <Marca />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Story 4 — a prova (B-roll do formador)
export const Story4: React.FC = () => {
  const dados: [number, string, string][] = [[10, "anos de", "experiência"], [1500, "alunos", "formados"], [120, "traders profissionais", "formados"]];
  return (
    <AbsoluteFill style={{ fontFamily: FONTE, background: COR.fundo }}>
      <BRoll inicio={28} zoom={[1.5, 1.62]} origem="50% 32%" escuro={0.66} />
      <div style={{ position: "absolute", top: 300, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Surge em={0}><Kicker>NÃO É TEORIA</Kicker></Surge>
        <Surge em={0.3} style={{ marginTop: 26 }}><Titulo tamanho={84}>Quem ensina<br /><Ouro>já fez o caminho.</Ouro></Titulo></Surge>
        <div style={{ marginTop: 60, width: "100%", display: "flex", flexDirection: "column", gap: 22 }}>
          {dados.map(([n, a, b], i) => (
            <Surge key={b + a} em={1.5 + i * 1.0} de="esq">
              <div style={{ display: "flex", alignItems: "center", gap: 30, padding: "18px 32px", borderRadius: 26, background: "rgba(10,9,8,0.82)", border: "2px solid rgba(217,180,90,0.4)" }}>
                <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 110, color: COR.positivo, minWidth: 380, lineHeight: 1.05 }}>
                  <Contador de={0} ate={n} inicio={1.5 + i * 1.0} dur={1.2} prefixo="+" />
                </div>
                <div style={{ fontSize: 40, color: COR.texto, fontWeight: 700, lineHeight: 1.2 }}>{a}<br /><span style={{ color: COR.suave, fontWeight: 600 }}>{b}</span></div>
              </div>
            </Surge>
          ))}
        </div>
        <Surge em={5.5} style={{ marginTop: 50 }}><Titulo tamanho={60}>Método, risco e plano —<br /><Ouro>ensinados por quem os usa.</Ouro></Titulo></Surge>
      </div>
      <Seguinte em={7.4} texto="Começa aqui" />
      <Marca />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- Story 5 — a ação (espaço para o autocolante de link)
export const Story5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulso = 1 + 0.04 * Math.sin(frame / 5);
  const seta = Math.sin(frame / 4) * 12;
  return (
    <Fundo>
      <div style={{ position: "absolute", top: 280, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Surge em={0}><Img src={staticFile("logo.png")} style={{ width: 300 }} /></Surge>
        <Surge em={0.6} style={{ marginTop: 40 }}><Titulo tamanho={88}>Pronto para começar<br /><Ouro>com método?</Ouro></Titulo></Surge>
        <Surge em={1.8} style={{ marginTop: 30 }}>
          <div style={{ fontSize: 40, color: COR.suave, textAlign: "center", lineHeight: 1.35 }}>Vê tudo sobre o <span style={{ color: COR.texto, fontWeight: 800 }}>Curso Iniciante</span><br />na página do curso.</div>
        </Surge>
        <Surge em={2.8} style={{ marginTop: 40, transform: `scale(${pulso})` }}>
          <div style={{ background: DOURADO_GRADIENTE, color: "#15110A", borderRadius: 999, padding: "26px 60px", fontWeight: 800, fontSize: 42, letterSpacing: 4, boxShadow: "0 0 60px rgba(217,180,90,0.4)" }}>
            QUERO SABER MAIS
          </div>
        </Surge>
        <Surge em={3.6} style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 5, color: COR.positivo }}>TOCA NO LINK</div>
          <svg width={60} height={70} viewBox="0 0 60 70" style={{ transform: `translateY(${seta}px)`, marginTop: 6 }}>
            <path d="M30 5 V60 M10 42 L30 62 L50 42" fill="none" stroke={COR.positivo} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Surge>
      </div>
      {/* espaço vazio para o autocolante de link (pôr na app do Instagram) */}
      <div style={{ position: "absolute", top: 1250, left: 240, right: 240, height: 130, borderRadius: 30, border: "3px dashed rgba(217,180,90,0.35)",
        opacity: interpolate(frame, [3.8 * fps, 4.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />
      <Marca />
    </Fundo>
  );
};
