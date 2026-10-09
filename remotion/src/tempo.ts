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

// Enquadramento (modo câmara): aproximação base e ponto de ancoragem (onde está a cara).
// Vídeo 3: plano largo em 720p → 1,5× centrado na cara (≈32 % da altura) deixa a cara do tamanho do vídeo 1.
export const ZOOM_BASE = 1.5;
export const ORIGEM_ZOOM = "50% 32%";
// Gancho: aproximação suave nos primeiros segundos (até ao 1.º corte de frase).
export const ZOOM_GANCHO = { ate: 2.8, fator: 1.1 };

// Jump cuts do vídeo original (trocam o zoom). Vídeo 3 é um só take: os cortes vêm da montagem.
export const CORTES: number[] = [];

// Cenas com gráfico (início, fim) — no modo câmara o ecrã divide-se enquanto há cena.
export const CENAS = {
  posicao: [7.4, 14.9],
  rr: [15.7, 23.3],
  numeros: [48.7, 71.3],
} as const;
// Janelas na versão curta (por defeito as mesmas).
export const CENAS_CURTA: Partial<Record<keyof typeof CENAS, readonly [number, number]>> = CENAS;

// Ícones que saltam ao lado do orador quando diz uma palavra-chave (modo câmara, fora das cenas).
export type Icone = "documento" | "visto" | "cruz" | "aviso" | "pessoas" | "grafico" | "alvo";
export const ICONES: { t: number; icone: Icone; texto: string; cor: "ganho" | "negativo" | "destaque"; lado: "esq" | "dir" }[] = [
  { t: 1.84, icone: "alvo", texto: "60% DE ACERTO", cor: "ganho", lado: "esq" },
  { t: 4.32, icone: "grafico", texto: "CONTA A DESCER", cor: "negativo", lado: "dir" },
  { t: 29.44, icone: "documento", texto: "NO PAPEL ✓", cor: "ganho", lado: "esq" },
  { t: 32.08, icone: "cruz", texto: "NA PRÁTICA ✕", cor: "negativo", lado: "dir" },
  { t: 41.2, icone: "pessoas", texto: "A MAIORIA", cor: "destaque", lado: "esq" },
  { t: 43.36, icone: "aviso", texto: "SEM SE APERCEBER", cor: "negativo", lado: "dir" },
];

// Modo câmara: até onde fica o cartão do gancho por cima do orador (tempo original).
export const GANCHO_FIM = 6.66;
// Etiquetas no início/fim do vídeo principal (modo câmara), ou null.
export const CHIP_INICIAL: string | null = null;
export const CHIP_FINAL: { t: number; texto: string } | null = null;

// Estrutura final: (intro) → vídeo principal → call to action.
export const INTRO = 2.8; // só na versão completa em modo câmara
export const PRINCIPAL = 71.3;
// Vídeo 3: o CTA começa com a conta final (o áudio acaba em "ganhámos 3R"), por isso é mais longo.
export const CTA = 8.0;
export const CTA_CURTA = 8.0;
export const SOBREPOSICAO_CTA = 0.4; // o CTA entra por cima dos últimos frames do vídeo
