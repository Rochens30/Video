import "@fontsource/manrope/500.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/playfair-display/900-italic.css";
import "@fontsource/jetbrains-mono/700.css";
import { AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { CHIP_FINAL, CHIP_INICIAL, CORTES, f, MODO, VIDEO_BASE, VOZ_BASE } from "./tempo";
import { useBlocos, useMontagem } from "./montagem";
import { COR, DOURADO_GRADIENTE, FONTE } from "./estilo";
import { Legendas } from "./Legendas";
import { Sons } from "./Sons";
import { Chip, Kicker } from "./ui";
import { Expectativa } from "./cenas/Expectativa";
import { Realidade } from "./cenas/Realidade";
import { Checklist } from "./cenas/Checklist";
import { Diario } from "./cenas/Diario";
import { Mensal } from "./cenas/Mensal";
import { Perdas } from "./cenas/Perdas";
import { Risco } from "./cenas/Risco";
import { Destruir } from "./cenas/Destruir";
import { Saldo } from "./cenas/Saldo";
import { Plano } from "./cenas/Plano";
import { Gancho2 } from "./cenas/Gancho2";
import { LucroErro } from "./cenas/LucroErro";
import { Sorte } from "./cenas/Sorte";
import { Cerebro } from "./cenas/Cerebro";
import { Habito } from "./cenas/Habito";
import { Regra } from "./cenas/Regra";
import { Matriz } from "./cenas/Matriz";

const PAINEL = 860; // altura do painel de gráficos no modo dividido
const DESCE = 540; // quanto o orador desce no modo dividido
const TRANS = 12; // frames da transição

const useDivisao = () => {
  const frame = useCurrentFrame();
  const blocos = useBlocos();
  const ease = Easing.bezier(0.65, 0, 0.35, 1);
  return Math.max(
    0,
    ...blocos.map(([a, b]) =>
      interpolate(frame, [f(a) - TRANS / 2, f(a) + TRANS / 2, f(b) - TRANS / 2, f(b) + TRANS / 2], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: ease,
      }),
    ),
  );
};

const Orador: React.FC<{ divisao: number; semVoz: boolean }> = ({ divisao, semVoz }) => {
  const frame = useCurrentFrame();
  const { segmentos, mapa, dentro } = useMontagem();
  // Zoom alternado (100% / 112%) a cada jump cut original e a cada corte entre frases, ancorado na cara.
  const t = frame / 30;
  const trocas =
    segmentos.filter((s) => s.trocaZoom && s.saida + (s.fim - s.ini) <= t + 1e-3).length +
    CORTES.filter((c) => dentro(c) && mapa(c) <= t).length;
  const zoom = interpolate(divisao, [0, 1], [trocas % 2 ? 1.12 : 1, 1]);
  return (
    <AbsoluteFill style={{ transform: `translateY(${divisao * DESCE}px) scale(${zoom})`, transformOrigin: "50% 30%" }}>
      {segmentos.map((s) => {
        const de = f(s.saida);
        const dur = f(s.saida + (s.fim - s.ini)) - de;
        return (
          <Sequence key={s.ini} from={de} durationInFrames={dur} layout="none">
            <OffthreadVideo
              src={staticFile(VIDEO_BASE)}
              trimBefore={Math.round(s.ini * 30)}
              // micro-fade de 2 frames em cada corte para não haver estalos no áudio
              volume={(fr) => (semVoz ? 0 : interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Catálogo de todas as cenas feitas até agora (o vídeo atual escolhe as suas em tempo.ts → CENAS).
const CATALOGO: Record<string, React.FC<{ a: number }>> = {
  // vídeo 1 — Consistência
  expectativa: Expectativa, realidade: Realidade, checklist: Checklist, diario: Diario, mensal: Mensal,
  perdas: Perdas, risco: Risco, destruir: Destruir, saldo: Saldo, plano: Plano,
  // vídeo 2 — Lucro com erro
  gancho: Gancho2, lucroErro: LucroErro, sorte: Sorte, cerebro: Cerebro, habito: Habito, regra: Regra, matriz: Matriz,
};

const Cenas: React.FC = () => {
  const montagem = useMontagem();
  return (
    <>
      {Object.entries(montagem.cenas).map(([nome, janela]) => {
        const Cena = CATALOGO[nome];
        if (!janela || !Cena) return null;
        const [a, b] = janela;
        return (
          <Sequence key={nome} from={f(montagem.mapa(a))} durationInFrames={f(montagem.mapa(b)) - f(montagem.mapa(a))} layout="none">
            <Cena a={a} />
          </Sequence>
        );
      })}
    </>
  );
};

export const Video: React.FC<{ chipInicial?: boolean; semVoz?: boolean }> = (props) =>
  MODO === "audio" ? <VideoAudio semVoz={props.semVoz ?? false} /> : <VideoCamara {...props} />;

const VideoCamara: React.FC<{ chipInicial?: boolean; semVoz?: boolean }> = ({ chipInicial = true, semVoz = false }) => {
  const frame = useCurrentFrame();
  const divisao = useDivisao();
  const montagem = useMontagem();
  return (
    <AbsoluteFill style={{ backgroundColor: COR.fundo, fontFamily: FONTE }}>
      <Orador divisao={divisao} semVoz={semVoz} />

      {/* Painel de gráficos */}
      <AbsoluteFill
        style={{
          height: PAINEL,
          transform: `translateY(${(divisao - 1) * (PAINEL + 60)}px)`,
          background: `radial-gradient(120% 90% at 50% 0%, #221C10 0%, ${COR.fundo} 70%)`,
          borderBottomLeftRadius: 48,
          borderBottomRightRadius: 48,
          borderBottom: "2px solid rgba(217,180,90,0.45)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 10px 60px rgba(217,180,90,0.12)",
          overflow: "hidden",
        }}
      >
        <Grelha />
        <Cenas />
      </AbsoluteFill>

      {/* Títulos de abertura e fecho, por cima da parede */}
      {chipInicial && CHIP_INICIAL && (
        <Sequence from={f(0.1)} durationInFrames={f(4.8)} layout="none">
          <Chip y={230} cor={COR.positivo} texto={CHIP_INICIAL} />
        </Sequence>
      )}
      {CHIP_FINAL && (
        <Sequence from={f(montagem.mapa(CHIP_FINAL.t))} layout="none">
          <Chip y={230} cor={COR.positivo} texto={CHIP_FINAL.texto} />
        </Sequence>
      )}

      <Legendas divisao={divisao} />
      <BarraProgresso frame={frame} duracao={montagem.duracao} />
      <Sons />
    </AbsoluteFill>
  );
};

// Velas muito ténues ao fundo, como no hero do site (verde/vermelho de mercado).
const Grelha: React.FC = () => (
  <svg width={1080} height={860} style={{ position: "absolute", opacity: 0.08 }}>
    {Array.from({ length: 34 }, (_, i) => {
      const x = 10 + i * 32;
      const meio = 560 + Math.sin(i * 0.55) * 60 + Math.sin(i * 1.9) * 25;
      const h = 14 + ((i * 37) % 30);
      return (
        <g key={i}>
          <line x1={x + 7} x2={x + 7} y1={meio - h - 14} y2={meio + h + 14} stroke={(i * 7) % 3 ? COR.ganho : COR.negativo} strokeWidth={2} />
          <rect x={x} y={meio - h} width={14} height={h * 2} fill={(i * 7) % 3 ? COR.ganho : COR.negativo} />
        </g>
      );
    })}
  </svg>
);

const BarraProgresso: React.FC<{ frame: number; duracao: number }> = ({ frame, duracao }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      bottom: 0,
      height: 8,
      width: `${(frame / f(duracao)) * 100}%`,
      background: DOURADO_GRADIENTE,
    }}
  />
);

// ---------------------------------------------------------------- modo áudio (só voz)
const TOPO_PAINEL = 300;
const PAINEL_AUDIO = 900;

/** Voz por trechos (com as pausas encurtadas) + micro-fade em cada corte. */
const Voz: React.FC<{ semVoz: boolean }> = ({ semVoz }) => {
  const { segmentos } = useMontagem();
  return (
    <>
      {segmentos.map((s) => {
        const de = f(s.saida);
        const dur = f(s.saida + (s.fim - s.ini)) - de;
        return (
          <Sequence key={s.ini} from={de} durationInFrames={dur} layout="none">
            <Audio
              src={staticFile(VOZ_BASE)}
              trimBefore={Math.round(s.ini * 30)}
              volume={(fr) => (semVoz ? 0 : interpolate(fr, [0, 2, dur - 2, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))}
            />
          </Sequence>
        );
      })}
    </>
  );
};

/** Nível da voz neste frame (0..1) e espectro, lidos do ficheiro original no instante correspondente. */
const useNivelVoz = (barras: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { segmentos } = useMontagem();
  const dados = useAudioData(staticFile(VOZ_BASE));
  const t = frame / fps;
  const s = segmentos.find((x) => t >= x.saida && t < x.saida + (x.fim - x.ini));
  if (!dados || !s) return { nivel: 0, espectro: new Array(barras).fill(0) as number[] };
  const fonte = Math.round((s.ini + (t - s.saida)) * fps);
  const espectro = visualizeAudio({ fps, frame: fonte, audioData: dados, numberOfSamples: 64, smoothing: true }).slice(0, barras);
  const nivel = Math.min(1, (espectro.reduce((a, b) => a + b, 0) / barras) * 6);
  return { nivel, espectro };
};

const Avatar: React.FC = () => {
  const { nivel } = useNivelVoz(16);
  return (
    <div style={{ position: "absolute", top: 120, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 26 }}>
      <div style={{ position: "relative", width: 130, height: 130 }}>
        <div style={{ position: "absolute", inset: -8 - 10 * nivel, borderRadius: "50%", border: `3px solid rgba(217,180,90,${0.25 + 0.6 * nivel})` }} />
        <Img src={staticFile("avatar.png")} style={{ width: 130, height: 130, borderRadius: "50%", border: "4px solid #D9B45A", objectFit: "cover" }} />
      </div>
      <div>
        <Kicker>FOREX ACADEMY CLUB</Kicker>
        <div style={{ color: COR.suave, fontSize: 28, marginTop: 10, fontWeight: 600 }}>Trading · Mentalidade</div>
      </div>
    </div>
  );
};

const Onda: React.FC = () => {
  const { espectro } = useNivelVoz(28);
  return (
    <div style={{ position: "absolute", top: 1410, left: 0, right: 0, height: 70, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
      {espectro.map((v, i) => {
        const espelho = espectro[Math.abs(espectro.length - 1 - i)] ?? v;
        const h = 6 + Math.min(64, (v + espelho) * 260);
        return <div key={i} style={{ width: 10, height: h, borderRadius: 5, background: "#D9B45A", opacity: 0.85 }} />;
      })}
    </div>
  );
};

const VideoAudio: React.FC<{ semVoz: boolean }> = ({ semVoz }) => {
  const frame = useCurrentFrame();
  const montagem = useMontagem();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 55% at 50% 35%, #1E190E 0%, ${COR.fundo} 70%)`, fontFamily: FONTE }}>
      <Voz semVoz={semVoz} />
      <Avatar />
      <AbsoluteFill
        style={{
          top: TOPO_PAINEL, height: PAINEL_AUDIO, left: 30, right: 30, width: undefined, borderRadius: 40, overflow: "hidden",
          border: "2px solid rgba(217,180,90,0.3)", background: "linear-gradient(180deg, #14110C 0%, #0D0B09 100%)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(217,180,90,0.08)",
        }}
      >
        <Grelha />
        <Cenas />
      </AbsoluteFill>
      <Legendas divisao={0} y={1320} />
      <Onda />
      <BarraProgresso frame={frame} duracao={montagem.duracao} />
      <Sons />
    </AbsoluteFill>
  );
};
