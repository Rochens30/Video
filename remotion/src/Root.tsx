import { Composition } from "remotion";
import { Final } from "./Final";
import { FPS, TOTAL } from "./tempo";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Consistencia"
    component={Final}
    durationInFrames={Math.ceil(TOTAL * FPS)}
    fps={FPS}
    width={1080}
    height={1920}
  />
);
