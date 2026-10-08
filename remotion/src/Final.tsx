import { AbsoluteFill, Sequence } from "remotion";
import { Video } from "./Video";
import { Intro } from "./Intro";
import { Gancho } from "./Gancho";
import { CTA as CallToAction } from "./CTA";
import { COMPLETA, CURTA, MontagemContext } from "./montagem";
import { EfeitosContext } from "./ui";
import { CTA, f, GANCHO_FIM, INTRO, MODO, SOBREPOSICAO_CTA } from "./tempo";

export type Versao = "completa" | "curta";

const CONFIG = {
  // ~75 s: intro em ecrã próprio + vídeo inteiro + CTA
  completa: { montagem: COMPLETA, intro: MODO === "camara" ? INTRO : 0, cta: CTA, gancho: 0 },
  // ~45 s: gancho por cima do orador desde o 1.º frame, frases repetidas cortadas, pausas encurtadas
  // (no modo áudio o gancho é a 1.ª cena do painel, não um cartão por cima)
  curta: { montagem: CURTA, intro: 0, cta: 5.0, gancho: MODO === "camara" ? CURTA.mapa(GANCHO_FIM) : 0 },
} as const;

export const duracaoTotal = (v: Versao) => {
  const c = CONFIG[v];
  return c.intro + c.montagem.duracao + c.cta - SOBREPOSICAO_CTA;
};

/** `semVoz`: diagnóstico — renderiza só a faixa de efeitos (ex.: --props='{"versao":"curta","semVoz":true}'). */
export const Final: React.FC<{ versao: Versao; semVoz?: boolean; semEfeitos?: boolean }> = ({ versao, semVoz = false, semEfeitos = false }) => {
  const c = CONFIG[versao];
  const inicioCta = c.intro + c.montagem.duracao - SOBREPOSICAO_CTA;
  return (
    <EfeitosContext.Provider value={!semEfeitos}>
      <MontagemContext.Provider value={c.montagem}>
        <AbsoluteFill style={{ backgroundColor: "#000" }}>
          {c.intro > 0 && (
            <Sequence durationInFrames={f(c.intro)}>
              <Intro />
            </Sequence>
          )}
          <Sequence from={f(c.intro)} durationInFrames={f(c.montagem.duracao)}>
            <Video chipInicial={c.gancho === 0} semVoz={semVoz} />
            {c.gancho > 0 && <Gancho duracao={c.gancho} />}
          </Sequence>
          <Sequence from={f(inicioCta)} durationInFrames={f(c.cta)}>
            <CallToAction />
          </Sequence>
        </AbsoluteFill>
      </MontagemContext.Provider>
    </EfeitosContext.Provider>
  );
};
