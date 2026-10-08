import { Composition } from "remotion";
import { Video } from "./Video";
import { FPS } from "./tempo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Consistencia"
    component={Video}
    durationInFrames={Math.ceil(67.25 * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
