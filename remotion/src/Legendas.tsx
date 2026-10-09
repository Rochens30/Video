import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import palavras from "./palavras.json";
import { f } from "./tempo";
import { useMontagem } from "./montagem";

// Palavras-chave do vídeo atual: quando ditas ficam verdes em vez de amarelas.
const CHAVE = new Set(["60", "perdes", "risco", "stop", "loss", "take", "profit", "lucrativo", "problema", "papel", "prática",
  "respeitar", "traders", "números", "lucrativas", "perdas", "3"]);
const limpa = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

const BRANCO = "#FFFFFF";
const ATIVA = "#FFD43B"; // amarelo forte: contraste máximo com a palavra branca
const ATIVA_CHAVE = "#2EBD85"; // verde de mercado nas palavras-chave
const MAX_PALAVRAS = 3;

type Palavra = { palavra: string; inicio: number; fim: number };

/** Junta as palavras em grupos curtos (máx. 3), partindo em pontuação e pausas. */
const grupos = (W: Palavra[]) => {
  const out: Palavra[][] = [];
  let cur: Palavra[] = [];
  W.forEach((w, i) => {
    cur.push(w);
    const prox = W[i + 1];
    const parte = cur.length >= MAX_PALAVRAS || /[.,:?!]$/.test(w.palavra) || !prox || prox.inicio - w.fim > 0.25;
    if (parte) { out.push(cur); cur = []; }
  });
  return out;
};

/** Legendas em frases muito curtas, centradas; a palavra que está a ser dita muda de cor. */
export const Legendas: React.FC<{ divisao: number; y?: number }> = ({ divisao, y: yFixo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { dentro, mapa } = useMontagem();
  const W = palavras.palavras.filter((w) => dentro(w.inicio)).map((w) => ({ ...w, inicio: mapa(w.inicio), fim: mapa(w.fim) }));
  const G = grupos(W);
  const gi = G.findIndex((g, k) => {
    const prox = G[k + 1]?.[0].inicio ?? g[g.length - 1].fim + 0.4;
    const fim = prox - g[g.length - 1].fim < 0.35 ? prox : g[g.length - 1].fim + 0.25;
    return t >= g[0].inicio && t < fim;
  });
  if (gi < 0) return null;
  const g = G[gi];
  const s = spring({ frame: frame - f(g[0].inicio), fps, config: { damping: 12, mass: 0.4 } });
  const y = yFixo ?? interpolate(divisao, [0, 1], [1150, 1440]);
  return (
    <div style={{ position: "absolute", top: y, left: 50, right: 50, display: "flex", justifyContent: "center", transform: `translateY(-50%) scale(${0.85 + 0.15 * s})` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 26px", textAlign: "center" }}>
        {g.map((w, k) => {
          const ativa = t >= w.inicio && (k === g.length - 1 || t < g[k + 1].inicio);
          const cor = ativa ? (CHAVE.has(limpa(w.palavra)) ? ATIVA_CHAVE : ATIVA) : BRANCO;
          return (
            <span
              key={k}
              style={{
                fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 92, lineHeight: 1.1, textTransform: "uppercase", color: cor,
                WebkitTextStroke: "12px #000", paintOrder: "stroke fill", textShadow: "0 8px 24px rgba(0,0,0,0.55)",
              }}
            >
              {w.palavra.replace(/[.,:;]$/, "")}
            </span>
          );
        })}
      </div>
    </div>
  );
};
