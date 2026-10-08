import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "./palavras.json";
import { COR, DOURADO_TEXTO, SERIFA } from "./estilo";
import { f } from "./tempo";

const CHAVE = new Set(["consistência", "perdes", "garantidos", "traders", "normal", "risco", "critério", "registar",
  "controlas", "estratégia", "perdas", "arriscar", "loss", "destruir", "saldo", "plano", "consistente"]);
const limpa = (w: string) => w.toLowerCase().replace(/[^\p{L}]/gu, "");

const W = palavras.palavras;

/** Uma palavra de cada vez, com pop; fica no ecrã até à seguinte se a pausa for curta. */
export const Legendas: React.FC<{ divisao: number }> = ({ divisao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const i = W.findIndex((w, k) => {
    const prox = W[k + 1]?.inicio ?? w.fim + 0.5;
    const fim = prox - w.fim < 0.35 ? prox : w.fim + 0.25;
    return t >= w.inicio && t < fim;
  });
  if (i < 0) return null;
  const w = W[i];
  const s = spring({ frame: frame - f(w.inicio), fps, config: { damping: 11, mass: 0.4 } });
  const chave = CHAVE.has(limpa(w.palavra));
  const y = interpolate(divisao, [0, 1], [1150, 1440]);
  return (
    <div style={{ position: "absolute", top: y, left: 40, right: 40, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
      <div
        style={{
          fontFamily: SERIFA,
          fontWeight: 900,
          fontStyle: chave ? "italic" : "normal",
          fontSize: chave ? 116 : 104,
          color: COR.texto,
          textTransform: chave ? "none" : "uppercase",
          filter: "drop-shadow(0 0 3px #000) drop-shadow(0 0 3px #000) drop-shadow(0 6px 18px rgba(0,0,0,0.7))",
          transform: `scale(${0.7 + 0.3 * s})`,
          ...(chave ? DOURADO_TEXTO : {}),
        }}
      >
        {w.palavra.replace(/[.,:]$/, "")}
      </div>
    </div>
  );
};
