// Tempos em segundos tirados de transcricoes/transcricao_palavras.json.
export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

// Jump cuts detetados no vídeo original (análise de frames).
export const CORTES = [4.9, 10.67, 14.33, 18.5, 24.07, 26.63, 33.57, 44.37, 51.97, 56.27, 64.1];

// Cenas com gráfico: o ecrã divide-se (gráfico em cima, orador em baixo).
export const CENAS = {
  expectativa: [5.0, 14.33],
  realidade: [14.33, 18.5],
  checklist: [18.5, 28.7],
  diario: [28.7, 33.5],
  mensal: [33.57, 37.0],
  perdas: [43.0, 46.75],
  risco: [46.75, 51.97],
  destruir: [51.97, 56.27],
  saldo: [56.27, 60.5],
  plano: [60.5, 64.1],
} as const;
