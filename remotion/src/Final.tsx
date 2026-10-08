import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { Video } from "./Video";
import { Intro } from "./Intro";
import { CTA as CallToAction } from "./CTA";
import { CTA, f, INTRO, PRINCIPAL, SOBREPOSICAO_CTA, TOTAL } from "./tempo";

const INICIO_CTA = INTRO + PRINCIPAL - SOBREPOSICAO_CTA;

// Música baixinha debaixo da voz; mais presente na intro e no CTA.
const VOL_SEM_VOZ = 0.3;
const VOL_COM_VOZ = 0.07;
const volumeMusica = (frame: number) =>
  interpolate(
    frame,
    [0, f(INTRO) - 6, f(INTRO) + 6, f(INICIO_CTA), f(INICIO_CTA) + 12, f(TOTAL) - 30, f(TOTAL)],
    [VOL_SEM_VOZ, VOL_SEM_VOZ, VOL_COM_VOZ, VOL_COM_VOZ, VOL_SEM_VOZ, VOL_SEM_VOZ, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

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
    <Audio src={staticFile("musica.wav")} volume={volumeMusica} />
  </AbsoluteFill>
);
