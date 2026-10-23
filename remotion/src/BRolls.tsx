import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, MONO, SERIFA } from "./estilo";
import { BROLL_TEXTOS, BROLLS, BRoll, f } from "./tempo";
import { useMontagem } from "./montagem";

/** Cortes para B-roll (a voz do orador continua por baixo). Só aparecem com o orador em ecrã inteiro. */
export const BRolls: React.FC<{ divisao: number }> = ({ divisao }) => {
  const { dentro, mapa } = useMontagem();
  if (divisao > 0.3) return null;
  return (
    <>
      {BROLLS.filter((b) => dentro(b.t)).map((b) => {
        const de = f(mapa(b.t));
        const dur = Math.max(1, f(mapa(b.t + b.dur)) - de);
        return (
          <Sequence key={b.t} from={de} durationInFrames={dur} layout="none">
            <Plano b={b} primeiro={de === 0} />
          </Sequence>
        );
      })}
      {BROLL_TEXTOS.filter((x) => dentro(x.t)).map((x) => {
        const de = f(mapa(x.t));
        return (
          <Sequence key={`t${x.t}`} from={de} durationInFrames={Math.max(1, f(mapa(x.t + x.dur)) - de)} layout="none">
            <TextoGrande texto={x.texto} sub={x.sub} />
          </Sequence>
        );
      })}
    </>
  );
};

const Plano: React.FC<{ b: BRoll; primeiro: boolean }> = ({ b, primeiro }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const [z0, z1] = b.zoom ?? [1.1, 1.25];
  const z = interpolate(frame, [0, durationInFrames], [z0, z1]);
  const entrada = primeiro ? 1 : interpolate(frame, [0, 4], [1.08, 1], { extrapolateRight: "clamp" }); // "punch" no corte
  // motion blur no corte (não no 1.º frame do vídeo: é a capa por defeito)
  const desfoque = primeiro ? 0 : interpolate(frame, [0, 3], [10, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", filter: desfoque > 0.3 ? `blur(${desfoque}px)` : undefined }}>
      <AbsoluteFill style={{ transform: `scale(${z * entrada})`, transformOrigin: b.origem ?? "50% 50%" }}>
        <OffthreadVideo src={staticFile(b.ficheiro)} trimBefore={Math.round(b.inicio * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0) 30%, rgba(10,9,8,0) 60%, rgba(10,9,8,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

const TextoGrande: React.FC<{ texto: string; sub?: string }> = ({ texto, sub }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 10, mass: 0.5 } });
  return (
    <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${0.5 + 0.5 * s})`, opacity: Math.min(1, s * 1.5) }}>
      <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 260, lineHeight: 1, color: COR.texto, textShadow: "0 10px 40px rgba(0,0,0,0.6)" }}>{texto}</div>
      {sub && (
        <div style={{ marginTop: 10, background: COR.positivo, color: "#0A0908", fontFamily: MONO, fontWeight: 700, fontSize: 32, letterSpacing: 4, padding: "10px 22px", borderRadius: 999 }}>{sub}</div>
      )}
    </div>
  );
};
