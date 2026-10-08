import { Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { COR, SERIFA } from "./estilo";
import { f } from "./tempo";
import { Kicker, Ouro } from "./ui";

/**
 * Gancho por cima do orador, visível logo no 1.º frame (sem ecrã de intro à parte):
 * afirmação contra o senso comum que o resto do vídeo explica.
 */
export const Gancho: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const fim = f(duracao);
  // Já visível no frame 0 (é o que aparece na capa/primeiro segundo); só um ligeiro "assentar".
  const escala = interpolate(frame, [0, 8], [1.06, 1], { extrapolateRight: "clamp" });
  const op = interpolate(frame, [fim - 8, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", top: 140, left: 50, right: 50, opacity: op, transform: `scale(${escala})` }}>
        <div
          style={{
            background: "rgba(10,9,8,0.9)", border: "2px solid rgba(217,180,90,0.5)", borderRadius: 28, padding: "22px 30px 26px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.45), 0 0 40px rgba(217,180,90,0.15)", textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Kicker>A VERDADE</Kicker>
          </div>
          <div style={{ fontFamily: SERIFA, fontWeight: 700, fontSize: 54, lineHeight: 1.1, color: COR.texto, marginTop: 10 }}>
            Até os traders mais consistentes
          </div>
          <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 70, lineHeight: 1.1, marginTop: 2}}>
            <Ouro>têm meses negativos.</Ouro>
          </div>
        </div>
      </div>
      <Sequence from={3} layout="none"><Audio src={staticFile("sfx/impacto.wav")} volume={0.1} /></Sequence>
    </>
  );
};
