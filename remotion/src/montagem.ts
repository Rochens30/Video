import { createContext, useContext } from "react";
import curta from "./montagem_curta.json";
import { CENAS, PRINCIPAL } from "./tempo";

export type NomeCena = keyof typeof CENAS;
type Segmento = { ini: number; fim: number; saida: number; trocaZoom: boolean };

export type Montagem = {
  /** Trechos do vídeo original (segundos) que entram, por ordem. */
  segmentos: Segmento[];
  /** Janelas das cenas gráficas, em tempo do vídeo original. */
  cenas: Partial<Record<NomeCena, readonly [number, number]>>;
  duracao: number;
  /** Tempo original → tempo na montagem (um instante cortado passa para o início do trecho seguinte). */
  mapa: (t: number) => number;
  /** O instante original está dentro de algum trecho? */
  dentro: (t: number) => boolean;
};

const criar = (trechos: [number, number, number?][], cenas: Montagem["cenas"]): Montagem => {
  let saida = 0;
  const segmentos = trechos.map(([ini, fim, troca]) => {
    const s = { ini, fim, saida, trocaZoom: troca === 1 };
    saida += fim - ini;
    return s;
  });
  const mapa = (t: number) => {
    for (const s of segmentos) {
      if (t < s.ini) return s.saida;
      if (t <= s.fim) return s.saida + (t - s.ini);
    }
    return saida;
  };
  const dentro = (t: number) => segmentos.some((s) => t >= s.ini - 0.02 && t <= s.fim + 0.02);
  return { segmentos, cenas, duracao: saida, mapa, dentro };
};

export const COMPLETA = criar([[0, PRINCIPAL, 0]], CENAS);

export const CURTA = criar(curta.segmentos as [number, number, number][], {
  realidade: [14.35, 18.47],
  checklist: [21.1, 28.7],
  diario: [28.7, 31.36],
  perdas: [43.0, 46.6],
  saldo: [56.26, 60.5],
  plano: [60.5, 64.1],
});

export const MontagemContext = createContext<Montagem>(COMPLETA);
export const useMontagem = () => useContext(MontagemContext);

// Junta cenas seguidas num só bloco para o painel não fechar e reabrir entre elas (tempos já na montagem).
export const useBlocos = () => {
  const { cenas, mapa } = useMontagem();
  const xs = Object.values(cenas).map(([a, b]) => [mapa(a), mapa(b)]).sort((p, q) => p[0] - q[0]);
  const out: number[][] = [];
  for (const [a, b] of xs) {
    const ult = out[out.length - 1];
    if (ult && a - ult[1] < 0.3) ult[1] = Math.max(ult[1], b);
    else out.push([a, b]);
  }
  return out;
};
