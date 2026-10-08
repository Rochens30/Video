import { AbsoluteFill, Img, staticFile } from "remotion";
import { COR, FONTE, SERIFA } from "./estilo";
import { Kicker, Ouro } from "./ui";

// Título do vídeo atual (vídeo 1: "Consistência / não é ganhar / sempre.")
const TITULO = (
  <>
    Ganhei
    <br />
    dinheiro.
    <br />
    <Ouro>Foi um erro.</Ouro>
  </>
);

/**
 * Capa do Reel (1080×1920). Tudo o que importa fica dentro do recorte 3:4 que a grelha do perfil mostra
 * (faixa central de y=240 a y=1680).
 */
export const Capa: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COR.fundo, fontFamily: FONTE }}>
    {/* foto: aproximada e com a cara no terço superior */}
    <AbsoluteFill style={{ transform: "scale(1.3)", transformOrigin: "50% 22%" }}>
      <Img src={staticFile("capa_frame.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    {/* escurecer em baixo para o título ler bem */}
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,9,8,0.35) 0%, rgba(10,9,8,0) 18%, rgba(10,9,8,0) 42%, rgba(10,9,8,0.92) 60%, #0A0908 78%)" }} />

    <div style={{ position: "absolute", top: 1020, left: 60, right: 60, textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Kicker style={{ fontSize: 28 }}>TRADING</Kicker>
      </div>
      <div style={{ fontFamily: SERIFA, fontWeight: 900, fontSize: 130, lineHeight: 1.0, color: COR.texto, marginTop: 22 }}>
        {TITULO}
      </div>
    </div>

    <div style={{ position: "absolute", top: 1520, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Img src={staticFile("logo.png")} style={{ width: 200 }} />
    </div>
  </AbsoluteFill>
);
