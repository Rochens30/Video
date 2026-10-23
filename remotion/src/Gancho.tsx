import { interpolate, useCurrentFrame } from "remotion";
import { COR, MONO, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Efeito, Ouro } from "./ui";

/**
 * Gancho por cima do orador, visível logo no 1.º frame (é também a capa por defeito).
 * Vídeo 4: "AMANHÃ · LISBOA" com ponto vermelho a piscar (tipo "em direto") + "5 traders profissionais. O que a Internet não mostra."
 * (Vídeo 1: "Até os traders mais consistentes têm meses negativos."; vídeo 3: "Acertas em 60%… e perdes dinheiro?")
 */
export const Gancho: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const fim = f(duracao);
  const escala = interpolate(frame, [0, 8], [1.06, 1], { extrapolateRight: "clamp" });
  const op = interpolate(frame, [fim - 8, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulso = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <>
      <div style={{ position: "absolute", top: 120, left: 40, right: 40, opacity: op, transform: `scale(${escala})` }}>
        <div
          style={{
            padding: "24px 30px 28px", borderRadius: 30, textAlign: "center", background: "rgba(10,9,8,0.9)",
            border: `3px solid rgba(217,180,90,${0.5 + 0.4 * pulso})`, boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 ${30 + 30 * pulso}px rgba(217,180,90,${0.2 + 0.2 * pulso})`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: COR.texto }}>
            <div style={{ width: 18, height: 18, borderRadius: 9, background: COR.negativo, opacity: 0.4 + 0.6 * pulso, boxShadow: `0 0 ${12 * pulso}px ${COR.negativo}` }} />
            AMANHÃ · SÁB 24 OUT · LISBOA
          </div>
          <div style={{ fontFamily: SERIFA, fontWeight: 700, fontSize: 58, lineHeight: 1.08, color: COR.texto, marginTop: 14 }}>5 traders profissionais.</div>
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 62, lineHeight: 1.08 }}><Ouro>O que a Internet não mostra.</Ouro></div>
        </div>
      </div>
      <Efeito src="sfx/impacto.wav" volume={0.1} de={3} />
    </>
  );
};
