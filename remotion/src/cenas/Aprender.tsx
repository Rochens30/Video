import { COR, MONO } from "../estilo";
import { Cena, Ouro, useEntrada, useRel } from "../ui";

type Item = [t: number, texto: string, extra: string];

const Lista: React.FC<{ a: number; itens: Item[]; kicker: string; titulo: React.ReactNode }> = ({ a, itens, kicker, titulo }) => {
  const r = useRel(a);
  return (
    <Cena kicker={kicker} titulo={titulo}>
      <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 6 }}>
        {itens.map(([t, texto, extra], i) => <Linha key={texto} inicio={r(t)} n={i + 1} texto={texto} extra={extra} />)}
      </div>
    </Cena>
  );
};

const Linha: React.FC<{ inicio: number; n: number; texto: string; extra: string }> = ({ inicio, n, texto, extra }) => {
  const s = useEntrada(inicio, 12);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "22px 28px", borderRadius: 24, opacity: Math.min(1, s * 1.4),
      transform: `translateX(${(1 - s) * -90}px)`, filter: s < 0.8 ? `blur(${(0.8 - s) * 12}px)` : undefined,
      background: "linear-gradient(180deg, #16130E, #100E0B)", border: "2px solid rgba(217,180,90,0.3)" }}>
      <div style={{ width: 66, height: 66, borderRadius: 18, background: `${COR.positivo}22`, border: `3px solid ${COR.positivo}`, display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 30, color: COR.positivo, flexShrink: 0 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 40, color: COR.texto, lineHeight: 1.15 }}>{texto}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: COR.suave, marginTop: 6 }}>{extra}</div>
      </div>
    </div>
  );
};

/** "…como é que nós conseguimos, os erros que nós cometemos para tu não teres de cometer, e análise gráfica avançada" */
export const Aprender1: React.FC<{ a: number }> = ({ a }) => (
  <Lista a={a} kicker="AMANHÃ VAIS APRENDER" titulo={<>Aquilo que a Internet <Ouro>não te mostra</Ouro></>}
    itens={[
      [22.32, "Como chegámos a profissionais", "O CAMINHO REAL"],
      [24.16, "Os erros que nos custaram caro", "PARA NÃO OS REPETIRES"],
      [28.0, "Análise gráfica avançada", "LEITURA DE GRÁFICO"],
    ]} />
);

/** "…as metodologias que nós precisamos de fazer e as rotinas de um trader profissional, conceitos avançados de Smart Money, ICT Concepts" */
export const Aprender2: React.FC<{ a: number }> = ({ a }) => (
  <Lista a={a} kicker="E AINDA" titulo={<>O dia a dia de um <Ouro>trader profissional</Ouro></>}
    itens={[
      [30.52, "As nossas metodologias", "O QUE FAZEMOS E PORQUÊ"],
      [33.08, "As rotinas de um profissional", "ANTES, DURANTE E DEPOIS"],
      [36.28, "Smart Money · ICT Concepts", "CONCEITOS AVANÇADOS"],
    ]} />
);
