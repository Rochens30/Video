// Vídeo 5 — promo "o evento é amanhã" (mesma gravação do vídeo 4, edição cinematográfica).
// Menos gráficos, mais montagem: B-roll em ecrã inteiro com transições reais, títulos cinéticos, grão e vinheta.
// Tempos em segundos do ficheiro ORIGINAL = início de uma palavra (palavras.json). O Promo afina-os ao ataque
// real da sílaba (inicios.json) e corta 2 frames antes, para a imagem mudar em cima da palavra.

export type Transicao = "whip" | "zoom" | "flash" | "seco";

export type Plano = {
  t: number; // palavra onde entra
  ate: number; // palavra onde volta ao orador (ou passa ao plano seguinte)
  ficheiro: string;
  inicio: number; // segundo do ficheiro onde o plano começa
  ritmo?: number; // velocidade depois da rampa
  zoom?: [number, number];
  origem?: string;
  entrada?: Transicao;
  saida?: Transicao;
};

export const PLANOS: Plano[] = [
  // Gancho: plano geral da sala (acelerado) → sala → roll-up, em whip pans
  { t: 5.307, ate: 6.16, ficheiro: "original.mp4", inicio: 0.4, ritmo: 2, zoom: [1.0, 1.5], origem: "50% 47%", entrada: "seco", saida: "whip" },
  { t: 6.16, ate: 7.04, ficheiro: "broll/evento_2.mp4", inicio: 4.0, ritmo: 1.3, zoom: [1.15, 1.3], entrada: "whip", saida: "whip" },
  { t: 7.04, ate: 7.68, ficheiro: "broll/evento_4.mp4", inicio: 0.3, zoom: [1.2, 1.35], origem: "70% 35%", entrada: "whip", saida: "zoom" },
  // "nesta sala"
  { t: 8.32, ate: 8.96, ficheiro: "broll/evento_2.mp4", inicio: 9.5, zoom: [1.1, 1.25], entrada: "zoom", saida: "zoom" },
  // "mais de 100 traders de todo o país"
  { t: 11.12, ate: 13.36, ficheiro: "broll/evento_5.mp4", inicio: 1.6, zoom: [1.1, 1.3], origem: "50% 60%", entrada: "flash", saida: "whip" },
  // "a nossa história" → roll-up "+2000 traders formados"
  { t: 15.04, ate: 15.92, ficheiro: "broll/evento_4.mp4", inicio: 0.0, zoom: [1.35, 1.6], origem: "85% 40%", entrada: "whip", saida: "zoom" },
  // "como é que nós conseguimos" → ele a dar formação
  { t: 22.32, ate: 23.92, ficheiro: "broll/evento_3.mp4", inicio: 0.0, zoom: [1.1, 1.2], origem: "40% 30%", entrada: "whip", saida: "whip" },
  // "análise gráfica avançada" → portátil na mesa
  { t: 27.6, ate: 30.28, ficheiro: "broll/evento_5.mp4", inicio: 10.6, zoom: [1.1, 1.35], origem: "45% 65%", entrada: "zoom", saida: "zoom" },
  // "conceitos avançados"
  { t: 35.0, ate: 36.28, ficheiro: "broll/evento_3.mp4", inicio: 1.3, zoom: [1.05, 1.2], origem: "55% 30%", entrada: "whip", saida: "whip" },
  // "o teu bilhete" → mesa com o cartão
  { t: 38.77, ate: 39.64, ficheiro: "broll/evento_5.mp4", inicio: 4.6, zoom: [1.15, 1.3], origem: "60% 55%", entrada: "zoom", saida: "seco" },
  // "amanhã connosco nesta sala, neste evento" → plano geral
  { t: 45.12, ate: 47.95, ficheiro: "original.mp4", inicio: 1.0, zoom: [1.3, 1.0], origem: "50% 47%", entrada: "flash", saida: "seco" },
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
  entrada?: "bater" | "subir"; // bater = escala com desfoque; subir = sobe por trás de uma máscara
  glitch?: boolean;
  contador?: number; // conta de 0 até este número
};

export const TITULOS: Titulo[] = [
  { t: 5.307, ate: 6.48, texto: "AMANHÃ", kicker: "● É JÁ" },
  { t: 6.48, ate: 7.68, texto: "24 OUT", sub: "LISBOA · 14H", cor: "ouro" },
  { t: 9.2, ate: 10.88, texto: "5 TRADERS", sub: "PROFISSIONAIS · UMA SALA", pos: "baixo", entrada: "subir" },
  { t: 11.52, ate: 13.36, texto: "+100", sub: "TRADERS DE TODO O PAÍS", contador: 100 },
  { t: 17.04, ate: 18.0, texto: "INCONSISTÊNCIA", cor: "vermelho", pos: "baixo", glitch: true },
  { t: 18.0, ate: 18.72, texto: "PERDER\nDINHEIRO", cor: "vermelho", pos: "baixo" },
  { t: 19.68, ate: 20.88, texto: "PROFISSIONAIS", kicker: "ATÉ SERMOS TRADERS", cor: "verde", pos: "baixo", entrada: "subir" },
  { t: 24.16, ate: 24.88, texto: "ERROS", cor: "vermelho", pos: "baixo" },
  { t: 28.0, ate: 30.28, texto: "ANÁLISE\nGRÁFICA", sub: "AVANÇADA", entrada: "subir" },
  { t: 30.52, ate: 33.08, texto: "METODOLOGIAS", kicker: "01", pos: "baixo", entrada: "subir" },
  { t: 33.08, ate: 35.0, texto: "ROTINAS", kicker: "02", sub: "DE UM TRADER PROFISSIONAL", pos: "baixo", entrada: "subir" },
  { t: 36.28, ate: 37.08, texto: "SMART\nMONEY", kicker: "03", pos: "baixo", entrada: "subir" },
  { t: 37.08, ate: 38.0, texto: "ICT\nCONCEPTS", kicker: "04", pos: "baixo", entrada: "subir" },
];

// Preto e branco com tom vermelho na fase de perder dinheiro; a cor volta (com flash) em "traders profissionais".
export const PB = { t: 16.8, ate: 19.68 };
// "amanhã às 14 horas" → relógio
export const RELOGIO = { t: 39.64, ate: 41.32 };
// "são os últimos lugares" → carimbo
export const CARIMBO = { t: 41.72, ate: 42.645 };
// "comenta evento aqui abaixo" → caixa de comentário a escrever EVENTO
export const COMENTARIO = { t: 42.83, ate: 45.12 };

// Aproximações suaves (push-in) em palavras fortes, dentro de trechos longos.
export const REENQUADRAR = [9.2, 13.36, 21.68, 31.72, 33.08, 36.28, 39.16];

// Flashes de exposição (além das entradas "flash" dos planos) e tremor (só no carimbo).
export const FLASHES = [19.68];
export const TREMORES = [41.72];
// Fugas de luz (light leaks).
export const FUGAS = [5.6, 11.12, 19.68, 45.12];
