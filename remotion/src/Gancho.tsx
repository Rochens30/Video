import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Efeito, Ouro } from "./ui";

/**
 * Gancho por cima do orador, visível logo no 1.º frame (é também a capa por defeito).
 * Vídeo 3: "Acertas em 60%… e perdes dinheiro?" com anel de taxa de acerto e brilho a pulsar.
 * (Vídeo 1: "Até os traders mais consistentes têm meses negativos.")
 */
export const Gancho: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const fim = f(duracao);
  const escala = interpolate(frame, [0, 8], [1.06, 1], { extrapolateRight: "clamp" });
  const op = interpolate(frame, [fim - 8, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const anel = 0.6; // 60 % desde o frame 0 (é a capa por defeito)
  const pulso = 0.5 + 0.5 * Math.sin(frame / 5); // elemento de destaque: brilho a pulsar
  const r = 62, C = 2 * Math.PI * r;
  return (
    <>
      <div style={{ position: "absolute", top: 120, left: 40, right: 40, opacity: op, transform: `scale(${escala})` }}>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 26, padding: "22px 28px", borderRadius: 30,
            background: "rgba(10,9,8,0.92)", border: `3px solid rgba(46,189,133,${0.5 + 0.4 * pulso})`,
            boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${30 + 30 * pulso}px rgba(46,189,133,${0.25 + 0.25 * pulso})`,
          }}
        >
          <div style={{ position: "relative", width: 150, height: 150, flexShrink: 0 }}>
            <svg width={150} height={150} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={75} cy={75} r={r} fill="none" stroke="#2A251A" strokeWidth={16} />
              <circle cx={75} cy={75} r={r} fill="none" stroke={COR.ganho} strokeWidth={16} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - anel)} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 46, color: COR.texto }}>{Math.round(anel * 100)}%</div>
              <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 2, color: COR.suave }}>ACERTO</div>
            </div>
          </div>
          <div style={{ fontFamily: SERIFA, lineHeight: 1.08 }}>
            <div style={{ fontWeight: 700, fontSize: 50, color: COR.texto }}>Acertas em 60%…</div>
            <div style={{ fontWeight: 900, fontSize: 62, marginTop: 4 }}><Ouro cor={COR.negativo}>e perdes dinheiro?</Ouro></div>
          </div>
        </div>
      </div>
      <Efeito src="sfx/impacto.wav" volume={0.1} de={3} />
    </>
  );
};
