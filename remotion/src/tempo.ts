// Dados do vídeo atual. Tempos em segundos do ficheiro original (ver transcricoes / palavras.json).
// Vídeos anteriores: ver videos/NN-*/NOTAS.md — as cenas deles continuam em src/cenas/ como biblioteca.
export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

// "camara": há uma pessoa a falar (ecrã dividido com o painel de gráficos).
// "audio":  só voz (imagem preta) → gráficos em ecrã inteiro, avatar e onda de som.
export const MODO: "camara" | "audio" = "camara";

// Vídeo de base em public/ (modo câmara): o melhorado (ferramentas/melhorar_video.py) ou o original.
export const VIDEO_BASE = "original.mp4";
// Voz (modo áudio): extraída do original com filtro de graves + presença.
export const VOZ_BASE = "voz.wav";

// Enquadramento (modo câmara): aproximação base e ponto de ancoragem.
// Vídeo 4: orador de pé, cara a ~37 % da altura → 1,6× ancorado ao centro põe a cara como no vídeo 1.
export const ZOOM_BASE = 1.6;
export const ORIGEM_ZOOM = "45% 50%";
// Gancho: aproximação suave nos primeiros segundos (até ao 1.º corte).
export const ZOOM_GANCHO = { ate: 2.8, fator: 1.1 };

// Jump cuts do vídeo original (trocam o zoom). Vídeo 4 é um só take: os cortes vêm da montagem.
export const CORTES: number[] = [];

// B-roll: durante estes intervalos (tempo original) mostra-se outro vídeo em vez do orador (a voz continua).
export type BRoll = { t: number; dur: number; ficheiro: string; inicio: number; zoom?: [number, number]; origem?: string };
export const BROLLS: BRoll[] = [
  // gancho: 3 cortes rápidos da sala enquanto diz "É já amanhã, dia 24 de outubro"
  { t: 5.31, dur: 0.75, ficheiro: "broll/evento_2.mp4", inicio: 4.0, zoom: [1.15, 1.3] },
  { t: 6.06, dur: 0.85, ficheiro: "broll/evento_4.mp4", inicio: 0.6, zoom: [1.05, 1.2], origem: "40% 40%" },
  { t: 6.91, dur: 0.75, ficheiro: "broll/evento_3.mp4", inicio: 2.4, zoom: [1.2, 1.1], origem: "70% 35%" },
  // "nesta sala"
  { t: 8.3, dur: 0.75, ficheiro: "broll/evento_2.mp4", inicio: 9.5, zoom: [1.1, 1.25] },
  // "mais de 100 traders de todo o país"
  { t: 11.1, dur: 1.85, ficheiro: "broll/evento_5.mp4", inicio: 1.6, zoom: [1.1, 1.3], origem: "50% 60%" },
  // "nesta sala, neste evento"
  { t: 46.1, dur: 1.8, ficheiro: "broll/evento_2.mp4", inicio: 13.6, zoom: [1.1, 1.3] },
];
// Etiqueta grande por cima de um B-roll (tempo original de início, texto).
export const BROLL_TEXTOS: { t: number; dur: number; texto: string; sub?: string }[] = [
  { t: 11.1, dur: 1.85, texto: "+100", sub: "TRADERS DE TODO O PAÍS" },
];

// Cenas com gráfico (início, fim) — no modo câmara o ecrã divide-se enquanto há cena.
export const CENAS = {
  percurso: [15.85, 21.0],
  aprender1: [21.0, 29.15],
  aprender2: [29.15, 37.9],
  bilhete: [37.9, 42.7],
} as const;
// Janelas na versão curta (por defeito as mesmas).
export const CENAS_CURTA: Partial<Record<keyof typeof CENAS, readonly [number, number]>> = CENAS;

// Ícones que saltam ao lado do orador quando diz uma palavra-chave (modo câmara, fora das cenas e dos B-rolls).
export type Icone = "documento" | "visto" | "cruz" | "aviso" | "pessoas" | "grafico" | "alvo" | "balao";
export const ICONES: { t: number; icone: Icone; texto: string; cor: "ganho" | "negativo" | "destaque"; lado: "esq" | "dir" }[] = [
  { t: 9.2, icone: "pessoas", texto: "5 TRADERS PROFISSIONAIS", cor: "destaque", lado: "dir" },
  { t: 15.0, icone: "documento", texto: "A NOSSA HISTÓRIA", cor: "destaque", lado: "dir" },
  { t: 42.83, icone: "balao", texto: "COMENTA \"EVENTO\"", cor: "ganho", lado: "dir" },
];

// Modo câmara: até onde fica o cartão do gancho por cima do orador (tempo original).
export const GANCHO_FIM = 10.9;
// Etiquetas no início/fim do vídeo principal (modo câmara), ou null.
export const CHIP_INICIAL: string | null = null;
export const CHIP_FINAL: { t: number; texto: string } | null = null;

// Estrutura final: (intro) → vídeo principal → call to action.
export const INTRO = 2.8; // só na versão completa em modo câmara
export const PRINCIPAL = 47.9;
export const CTA = 6.5;
export const CTA_CURTA = 6.5;
export const SOBREPOSICAO_CTA = 0.4; // o CTA entra por cima dos últimos frames do vídeo

// Música de fundo (ficheiro em public/, com licença) ou null. Baixa debaixo da voz, sobe no CTA.
export const MUSICA: { ficheiro: string; comVoz: number; semVoz: number } | null = null;
