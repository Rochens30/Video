import { AbsoluteFill, Img, staticFile } from "remotion";
import { COR, MONO } from "../estilo";
import { Grao, Vinheta } from "./Efeitos";

/** Capa do vídeo 5 (1080×1920), no look do vídeo: tudo dentro do recorte 3:4 da grelha (y=240 a 1680). */
export const CapaPromo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo }}>
    <AbsoluteFill style={{ transform: "scale(1.7)", transformOrigin: "33% 34%", filter: "contrast(1.1) saturate(1.1)" }}>
      <Img src={staticFile("capa_promo_frame.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.3) 0%, rgba(10,9,8,0) 20%, rgba(10,9,8,0) 44%, rgba(10,9,8,0.9) 62%, #0A0908 80%)" }} />
    <Vinheta />

    <div style={{ position: "absolute", top: 1060, left: 40, right: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: COR.destaque }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: COR.negativo, boxShadow: `0 0 18px ${COR.negativo}` }} />
        É JÁ
      </div>
      <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 156, lineHeight: 1, color: "#fff", marginTop: 6, filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.6))" }}>
        AMANHÃ
      </div>
      <div style={{ marginTop: 22, background: COR.positivo, color: "#0A0908", fontFamily: MONO, fontWeight: 700, fontSize: 36, letterSpacing: 5, padding: "12px 28px", borderRadius: 999 }}>
        SÁB 24 OUT · 14H · LISBOA
      </div>
    </div>

    <div style={{ position: "absolute", top: 1500, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Img src={staticFile("logo.png")} style={{ width: 190 }} />
    </div>
    <Grao opacidade={0.06} />
  </AbsoluteFill>
);
