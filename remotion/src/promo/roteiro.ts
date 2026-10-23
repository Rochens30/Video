// Vídeo 5 — promo "o evento é amanhã" (mesma gravação do vídeo 4, edição cinematográfica).
// Menos gráficos, mais montagem: B-roll em ecrã inteiro, títulos cinéticos, flashes, glitch, grão e vinheta.
// Tempos em segundos do ficheiro ORIGINAL (são convertidos para a montagem com mapa()).

export type Plano = {
  t: number; // início (original)
  ate: number; // fim (original)
  ficheiro: string;
  inicio: number; // segundo do ficheiro onde o plano começa
  ritmo?: number; // velocidade (speed ramp)
  zoom?: [number, number];
  origem?: string;
  entrada?: "flash" | "whip" | "punch";
};

export const PLANOS: Plano[] = [
  // Gancho: plano geral da sala a 2× com aproximação ao orador → sala → banner
  { t: 5.307, ate: 6.12, ficheiro: "original.mp4", inicio: 0.4, ritmo: 2, zoom: [1.0, 1.55], origem: "50% 50%" },
  { t: 6.12, ate: 6.9, ficheiro: "broll/evento_2.mp4", inicio: 4.0, ritmo: 1.5, zoom: [1.15, 1.3], entrada: "whip" },
  { t: 6.9, ate: 7.66, ficheiro: "broll/evento_4.mp4", inicio: 0.3, zoom: [1.2, 1.35], origem: "70% 35%", entrada: "whip" },
  // "nesta sala"
  { t: 8.3, ate: 9.0, ficheiro: "broll/evento_2.mp4", inicio: 9.5, zoom: [1.1, 1.25], entrada: "punch" },
  // "+100 traders de todo o país"
  { t: 11.1, ate: 12.95, ficheiro: "broll/evento_5.mp4", inicio: 1.6, zoom: [1.1, 1.3], origem: "50% 60%", entrada: "flash" },
  // "a nossa história" → banner "+2000 traders formados"
  { t: 15.0, ate: 15.902, ficheiro: "broll/evento_4.mp4", inicio: 0.0, zoom: [1.35, 1.6], origem: "85% 40%", entrada: "whip" },
  // "como é que nós conseguimos" → ele a dar formação
  { t: 22.372, ate: 23.807, ficheiro: "broll/evento_3.mp4", inicio: 0.0, zoom: [1.1, 1.2], origem: "40% 30%", entrada: "whip" },
  // "análise gráfica avançada" → portátil na mesa
  { t: 27.6, ate: 30.3, ficheiro: "broll/evento_5.mp4", inicio: 10.6, zoom: [1.1, 1.35], origem: "45% 65%", entrada: "whip" },
  // "conceitos avançados" → ele a apresentar
  { t: 34.95, ate: 36.25, ficheiro: "broll/evento_3.mp4", inicio: 1.3, zoom: [1.05, 1.2], origem: "55% 30%", entrada: "punch" },
  // "garante já o teu bilhete" → mesa com o cartão
  { t: 38.4, ate: 39.6, ficheiro: "broll/evento_5.mp4", inicio: 4.6, zoom: [1.15, 1.3], origem: "60% 55%", entrada: "whip" },
  // "nesta sala, neste evento" → plano geral da sala
  { t: 45.12, ate: 47.95, ficheiro: "original.mp4", inicio: 1.0, zoom: [1.35, 1.0], origem: "50% 50%", entrada: "flash" },
];

export type Cor = "branco" | "ouro" | "verde" | "vermelho";
export type Titulo = {
  t: number;
  ate: number;
  texto: string;
  sub?: string;
  kicker?: string;
  cor?: Cor;
  pos?: "centro" | "baixo"; // "baixo": por cima do peito do orador (a cara fica livre)
  glitch?: boolean;
  contador?: number; // conta de 0 até este número
};

export const TITULOS: Titulo[] = [
  { t: 5.307, ate: 6.45, texto: "AMANHÃ", kicker: "● É JÁ", cor: "branco" },
  { t: 6.45, ate: 7.66, texto: "24 OUT", sub: "LISBOA · 14H", cor: "ouro" },
  { t: 9.2, ate: 10.85, texto: "5 TRADERS", sub: "PROFISSIONAIS · UMA SALA", pos: "baixo" },
  { t: 11.1, ate: 12.95, texto: "+100", sub: "TRADERS DE TODO O PAÍS", contador: 100 },
  { t: 17.0, ate: 17.84, texto: "INCONSISTÊNCIA", cor: "vermelho", pos: "baixo", glitch: true },
  { t: 17.84, ate: 18.745, texto: "PERDER\nDINHEIRO", cor: "vermelho", pos: "baixo", glitch: true },
  { t: 19.62, ate: 20.88, texto: "PROFISSIONAIS", kicker: "ATÉ SERMOS TRADERS", cor: "verde", pos: "baixo" },
  { t: 24.12, ate: 24.88, texto: "ERROS", cor: "vermelho", pos: "baixo", glitch: true },
  { t: 28.0, ate: 30.3, texto: "ANÁLISE\nGRÁFICA", sub: "AVANÇADA", cor: "branco" },
  { t: 30.52, ate: 32.9, texto: "METODOLOGIAS", kicker: "01", pos: "baixo" },
  { t: 33.08, ate: 34.9, texto: "ROTINAS", kicker: "02", sub: "DE UM TRADER PROFISSIONAL", pos: "baixo" },
  { t: 36.28, ate: 37.05, texto: "SMART\nMONEY", kicker: "03", pos: "baixo", glitch: true },
  { t: 37.08, ate: 37.95, texto: "ICT\nCONCEPTS", kicker: "04", pos: "baixo", glitch: true },
];

// Preto e branco com tom vermelho enquanto fala da fase de perder dinheiro; a cor volta em "traders profissionais".
export const PB = { t: 16.75, ate: 19.6 };
// "amanhã às 14 horas" → relógio
export const RELOGIO = { t: 39.6, ate: 41.3 };
// "são os últimos lugares" → carimbo
export const CARIMBO = { t: 41.62, ate: 42.645 };
// "comenta evento aqui abaixo" → caixa de comentário a escrever EVENTO
export const COMENTARIO = { t: 42.8, ate: 45.12 };

// Reenquadramentos extra dentro de trechos longos (além de um a cada corte).
export const REENQUADRAR = [9.2, 13.36, 21.68, 31.72, 33.08, 36.28, 39.16];

// Flashes brancos (para além das entradas "flash" dos planos).
export const FLASHES = [19.62];
// Tremores de câmara (impactos).
export const TREMORES = [5.307, 6.45, 11.1, 17.04, 19.62, 24.12, 41.72];
// Fugas de luz (light leaks).
export const FUGAS = [5.6, 11.1, 19.62, 45.12];

type Som = [segundos: number, ficheiro: string, volume: number];
const tecla = (i: number) => `sfx/teclado/tecla_${(i * 3) % 5}.mp3`;
export const SONS: Som[] = [
  [5.307, "sfx/boom.wav", 0.55],
  [6.06, "sfx/whoosh_in.wav", 0.3],
  [6.45, "sfx/impacto.wav", 0.25],
  [6.84, "sfx/whoosh_in.wav", 0.3],
  [8.26, "sfx/whoosh_in.wav", 0.25],
  [9.2, "sfx/impacto.wav", 0.15],
  [11.1, "sfx/boom.wav", 0.35],
  [14.94, "sfx/whoosh_in.wav", 0.25],
  [17.0, "sfx/glitch.wav", 0.3],
  [17.84, "sfx/glitch.wav", 0.22],
  [18.9, "sfx/subida.wav", 0.18],
  [19.62, "sfx/impacto.wav", 0.3],
  [22.34, "sfx/whoosh_in.wav", 0.22],
  [24.12, "sfx/glitch.wav", 0.22],
  [27.54, "sfx/whoosh_in.wav", 0.25],
  [30.52, "sfx/impacto.wav", 0.12],
  [33.08, "sfx/impacto.wav", 0.12],
  [34.9, "sfx/whoosh_in.wav", 0.22],
  [36.28, "sfx/glitch.wav", 0.22],
  [37.08, "sfx/glitch.wav", 0.22],
  [38.34, "sfx/whoosh_in.wav", 0.22],
  // relógio: tiques até às "14 horas"
  ...[39.62, 39.87, 40.12, 40.37, 40.62, 40.87, 41.12].map((t): Som => [t, "sfx/tique.wav", 0.35]),
  [40.36, "sfx/impacto.wav", 0.18],
  [41.72, "sfx/boom.wav", 0.4],
  // comentário: escrever EVENTO e enviar
  ...[0, 1, 2, 3, 4, 5].map((i): Som => [43.0 + i * 0.11, tecla(i), 0.5]),
  [43.82, "sfx/clique_rato_1.wav", 0.4],
  [45.06, "sfx/whoosh_out.wav", 0.25],
];
