import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, DOURADO_GRADIENTE, DOURADO_TEXTO, MONO, SERIFA } from "../estilo";
import { f } from "../tempo";
import { useMontagem } from "../montagem";
import { COMENTARIO } from "./roteiro";

// Momentos especiais do vídeo 5 (por cima do orador). Margens seguras do Reel: 120 px dos lados, 250 px no topo.
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const FONTE_BLOCO = "Montserrat, sans-serif";
const useF = () => {
  const { mapa } = useMontagem();
  return (s: number) => f(mapa(s));
};

// ------------------------------------------------------------------ relógio "amanhã às 14h"
export const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const ent = spring({ frame, fps, config: { damping: 14, mass: 0.5 } });
  const saida = interpolate(frame, [durationInFrames - 4, durationInFrames], [1, 0], clamp);
  const ALVO = [1, 4, 0, 0];
  const H = 280;
  return (
    <AbsoluteFill style={{ opacity: Math.min(ent * 1.5, saida), backdropFilter: "blur(16px) brightness(0.4)", WebkitBackdropFilter: "blur(16px) brightness(0.4)", background: "rgba(10,9,8,0.35)" }}>
      <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingBottom: 140, transform: `scale(${0.9 + 0.1 * ent})` }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: COR.destaque }}>SÁBADO · 24 OUTUBRO</div>
        <div style={{ fontFamily: SERIFA, fontStyle: "italic", fontWeight: 900, fontSize: 150, lineHeight: 1.1, ...DOURADO_TEXTO }}>Amanhã</div>
        <div style={{ display: "flex", alignItems: "center", fontFamily: FONTE_BLOCO, fontWeight: 900, fontSize: H * 0.95, color: "#fff", height: H, marginTop: 10 }}>
          {ALVO.map((d, i) => {
            // conta-quilómetros: cada dígito rola e pára no valor certo (o "14" assenta quando ele diz "14")
            const fim = 12 + i * 4;
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
export const Carimbo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const atraso = 0; // o corte já entra 2 frames antes de "últimos"
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
export const Comentario: React.FC = () => {
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
      <div style={{ position: "absolute", top: 300, left: 120, right: 120, transform: `translateY(${(1 - ent) * -80}px) scale(${0.9 + 0.1 * ent})`, opacity: ent }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 6, color: COR.destaque, marginBottom: 14, textAlign: "center", textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>
          COMENTA AQUI EM BAIXO ↓
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(18,16,13,0.92)", border: "2px solid rgba(217,180,90,0.5)", borderRadius: 999, padding: "20px 22px 20px 20px", boxShadow: "0 20px 60px rgba(0,0,0,0.55)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: COR.fundo, border: `2px solid ${COR.positivo}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <Img src={staticFile("logo.png")} style={{ width: 50 }} />
          </div>
          <div style={{ flex: 1, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: letras ? 44 : 32, color: letras ? "#fff" : "#8A8478", letterSpacing: letras ? 3 : 0 }}>
            {letras ? PALAVRA.slice(0, letras) : enviado ? "" : "Adiciona um comentário…"}
            {cursor && <span style={{ color: COR.positivo }}>|</span>}
          </div>
          <div
            style={{
              fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 28, padding: "14px 24px", borderRadius: 999,
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

