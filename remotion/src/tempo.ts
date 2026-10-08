// Dados do vídeo atual. Tempos em segundos do ficheiro original (ver transcricoes / palavras.json).
// Vídeo 1 ("Consistência"): ver videos/01-consistencia/ — as cenas dele continuam em src/cenas/ como biblioteca.
export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

// "camara": há uma pessoa a falar (ecrã dividido com o painel de gráficos).
// "audio":  só voz (imagem preta) → gráficos em ecrã inteiro, avatar e onda de som.
export const MODO: "camara" | "audio" = "audio";

// Vídeo de base em public/ (modo câmara): o melhorado (ferramentas/melhorar_video.py) ou o original.
export const VIDEO_BASE = "original.mp4";
// Voz (modo áudio): extraída do original com filtro de graves + presença.
export const VOZ_BASE = "voz.wav";

// Jump cuts do vídeo original (modo câmara: trocam o zoom). Vídeo 2 é só áudio.
export const CORTES: number[] = [];

// Cenas com gráfico (início, fim) — no modo áudio cobrem o vídeo todo, uma a seguir à outra.
export const CENAS = {
  gancho: [0, 2.9],
  lucroErro: [2.9, 6.25],
  sorte: [6.25, 8.6],
  cerebro: [8.6, 16.95],
  habito: [16.95, 23.5],
  regra: [23.5, 30.3],
  matriz: [30.3, 35.18],
} as const;
// Janelas na versão curta (por defeito as mesmas).
export const CENAS_CURTA: Partial<Record<keyof typeof CENAS, readonly [number, number]>> = CENAS;

// Modo câmara: até onde fica o cartão do gancho por cima do orador (tempo original).
export const GANCHO_FIM = 4.85;
// Etiquetas no início/fim do vídeo principal (modo câmara), ou null. Vídeo 1: "CONSISTÊNCIA ≠ GANHAR SEMPRE" / "… = SEGUIR O PLANO".
export const CHIP_INICIAL: string | null = null;
export const CHIP_FINAL: { t: number; texto: string } | null = null;

// Estrutura final: (intro) → vídeo principal → call to action.
export const INTRO = 2.8; // só na versão completa em modo câmara
export const PRINCIPAL = 35.18;
export const CTA = 6.0;
export const SOBREPOSICAO_CTA = 0.4; // o CTA entra por cima dos últimos frames do vídeo
