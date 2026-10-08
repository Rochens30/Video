import { Composition, Still } from "remotion";
import { Capa } from "./Capa";
import { duracaoTotal, Final } from "./Final";
import { FPS } from "./tempo";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Consistencia"
      component={Final}
      defaultProps={{ versao: "completa" as const }}
      durationInFrames={Math.ceil(duracaoTotal("completa") * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Consistencia45"
      component={Final}
      defaultProps={{ versao: "curta" as const }}
      durationInFrames={Math.ceil(duracaoTotal("curta") * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Composition
      id="Consistencia45SemEfeitos"
      component={Final}
      defaultProps={{ versao: "curta" as const, semEfeitos: true }}
      durationInFrames={Math.ceil(duracaoTotal("curta") * FPS)}
      fps={FPS}
      width={1080}
      height={1920}
    />
    <Still id="Capa" component={Capa} width={1080} height={1920} />
  </>
);
