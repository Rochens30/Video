import { AbsoluteFill, Sequence } from "remotion";
import { Video } from "./Video";
import { Intro } from "./Intro";
import { CTA as CallToAction } from "./CTA";
import { CTA, f, INTRO, PRINCIPAL, SOBREPOSICAO_CTA } from "./tempo";

const INICIO_CTA = INTRO + PRINCIPAL - SOBREPOSICAO_CTA;

export const Final: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Sequence durationInFrames={f(INTRO)}>
      <Intro />
    </Sequence>
    <Sequence from={f(INTRO)} durationInFrames={f(PRINCIPAL)}>
      <Video />
    </Sequence>
    <Sequence from={f(INICIO_CTA)} durationInFrames={f(CTA)}>
      <CallToAction />
    </Sequence>
  </AbsoluteFill>
);
