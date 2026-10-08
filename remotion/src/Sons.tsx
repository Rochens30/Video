import { Efeito } from "./ui";
import { f } from "./tempo";
import { useBlocos, useMontagem } from "./montagem";

type Som = [segundos: number, ficheiro: string, volume: number];

// Ganho global dos efeitos (0.5 ≈ −6 dB).
const GANHO = 0.5;

const ui = (nome: string) => `sfx/ui/${nome}.mp3`;
const sint = (nome: string) => `sfx/${nome}.wav`;
const fr = (n: number) => n / 30; // frames → segundos (para os atrasos das animações)

const clique = (i: number) => sint(`clique_rato_${(i % 2) + 1}`);
const tecla = (i: number) => `sfx/teclado/tecla_${(i * 3) % 5}.mp3`; // varia a tecla para não soar a loop

// Momentos-chave, em tempo do vídeo original (os que caem em trechos cortados não tocam).
const MOMENTOS: Som[] = [
  // Carimbo "NÃO EXISTE"
  [11.5, sint("impacto"), 0.2],
  // Checklist: clique do rato quando cada caixa fica marcada (6 frames depois de o item aparecer)
  ...[21.27, 24.19, 26.76].map((t, i): Som => [t + fr(6), clique(i), 0.7]),
  // Diário: cada linha é "escrita" (3 teclas) e entra com o Enter
  ...[0, 1, 2, 3, 4].flatMap((linha): Som[] => {
    const t = 28.85 + fr(linha * 7);
    return [
      ...[0.15, 0.1, 0.05].map((antes, k): Som => [t - antes, tecla(linha * 3 + k), 0.55]),
      [t, "sfx/teclado/enter.mp3", 0.6],
    ];
  }),
  // Troca de estratégia A → B → C → D: um clique por troca
  ...[0, 1, 2].map((k): Som => [43.12 + fr(k * 14), clique(k), 0.55]),
  // "6 PERDAS SEGUIDAS"
  [45.36, ui("warning"), 0.55],
  // Conta a cair
  [53.6, sint("queda"), 0.22],
  // Saldo riscado
  [58.4, ui("invalid-drop"), 0.5],
  // 90% no plano
  [63.28, ui("achievement"), 0.5],
];

export const Sons: React.FC = () => {
  const { dentro, mapa } = useMontagem();
  const blocos = useBlocos();
  const sons: Som[] = [
    // o painel de gráficos a entrar e a sair
    ...blocos.flatMap(([a, b]): Som[] => [[a - 0.36, sint("whoosh_in"), 0.4], [b - 0.25, sint("whoosh_out"), 0.35]]),
    ...MOMENTOS.filter(([t]) => dentro(t)).map(([t, ficheiro, v]): Som => [mapa(t), ficheiro, v]),
  ];
  return (
    <>
      {sons.map(([t, ficheiro, volume], i) => (
        <Efeito key={i} src={ficheiro} volume={volume * GANHO} de={Math.max(0, f(t))} />
      ))}
    </>
  );
};
