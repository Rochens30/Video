import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COR, MONO } from "./estilo";
import { ICONES, Icone, f } from "./tempo";
import { useMontagem } from "./montagem";

const DURA = 1.8; // segundos no ecrã
const Y = 470; // à altura da cara (modo câmara, ecrã inteiro)

/** Ícones que saltam ao lado do orador quando ele diz uma palavra-chave (só com o orador em ecrã inteiro). */
export const Icones: React.FC<{ divisao: number }> = ({ divisao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { dentro, mapa } = useMontagem();
  if (divisao > 0.3) return null;
  return (
    <>
      {ICONES.filter((i) => dentro(i.t)).map((i) => {
        const ini = f(mapa(i.t));
        const fim = ini + f(DURA);
        if (frame < ini || frame > fim) return null;
        const s = spring({ frame: frame - ini, fps, config: { damping: 11, mass: 0.5 } });
        const saida = interpolate(frame, [fim - 6, fim], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const desfoque = interpolate(frame - ini, [0, 5], [10, 0], { extrapolateRight: "clamp" }) + (1 - saida) * 8;
        const cor = COR[i.cor];
        const x = i.lado === "esq" ? 60 : 1080 - 60 - 300;
        return (
          <div
            key={i.t}
            style={{
              position: "absolute", left: x, top: Y, width: 300, display: "flex", flexDirection: "column", alignItems: "center",
              opacity: saida, filter: desfoque > 0.3 ? `blur(${desfoque}px)` : undefined,
              transform: `translateX(${(1 - s) * (i.lado === "esq" ? -120 : 120)}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * (i.lado === "esq" ? -12 : 12)}deg)`,
            }}
          >
            <div style={{ width: 150, height: 150, borderRadius: 40, background: "rgba(10,9,8,0.88)", border: `4px solid ${cor}`,
              boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 40px ${cor}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Desenho icone={i.icone} cor={cor} />
            </div>
            <div style={{ marginTop: 14, background: cor, color: "#0A0908", fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 2,
              padding: "8px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>
              {i.texto}
            </div>
          </div>
        );
      })}
    </>
  );
};

const Desenho: React.FC<{ icone: Icone; cor: string }> = ({ icone, cor }) => {
  const p = { fill: "none", stroke: cor, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      {icone === "alvo" && (<><circle cx={48} cy={48} r={38} {...p} /><circle cx={48} cy={48} r={22} {...p} /><circle cx={48} cy={48} r={7} fill={cor} /></>)}
      {icone === "grafico" && (<><polyline points="10,22 34,44 50,34 84,72" {...p} /><polyline points="64,72 84,72 84,52" {...p} /></>)}
      {icone === "documento" && (<><path d="M24 10 H60 L74 24 V86 H24 Z" {...p} /><path d="M34 40 H64 M34 54 H64 M34 68 H52" {...p} /></>)}
      {icone === "cruz" && <path d="M24 24 L72 72 M72 24 L24 72" {...p} strokeWidth={10} />}
      {icone === "visto" && <path d="M18 50 L40 72 L80 26" {...p} strokeWidth={10} />}
      {icone === "aviso" && (<><path d="M48 10 L88 82 H8 Z" {...p} /><path d="M48 36 V58" {...p} /><circle cx={48} cy={70} r={4} fill={cor} /></>)}
      {icone === "pessoas" && (<><circle cx={48} cy={30} r={12} {...p} /><path d="M24 78 C24 56 72 56 72 78" {...p} /><circle cx={20} cy={40} r={9} {...p} strokeWidth={5} /><circle cx={76} cy={40} r={9} {...p} strokeWidth={5} /></>)}
    </svg>
  );
};
