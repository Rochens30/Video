"""Gera src/montagem_curta.json: os trechos do vídeo original que entram na versão de ~45 s.

1. Escolhe frases inteiras (por índice de palavra na transcrição).
2. Dentro de cada frase, encurta as pausas longas (> PAUSA_MAX) para ficar com ritmo mais rápido.
Uso: python3 scripts/montar_curta.py
"""
import json

W = json.load(open("src/palavras.json"))["palavras"]
SIL = [tuple(map(float, l.split())) for l in open("scripts/silencios.txt") if len(l.split()) == 2]

def idx(palavra, depois=0.0):
    return next(i for i, w in enumerate(W) if w["palavra"].startswith(palavra) and w["inicio"] >= depois)

# Frases mantidas: (primeira palavra, tempo mínimo) → (última palavra, tempo mínimo)
FRASES = [
    # Vídeo 3 ("60% de acerto"): tudo até "ganhámos 3R." (o resto da gravação é um engano).
    # (Vídeo 1: ver videos/01-consistencia/NOTAS.md · vídeo 2: videos/02-lucro-erro/NOTAS.md)
    (("Acertas", 0), ("R.", 71)),
]
PAUSA_MAX = 0.20  # pausas maiores do que isto são encurtadas
MARGEM = 0.05     # silêncio que fica de cada lado de um corte

def silencio_em(t):
    return next(((a, b) for a, b in SIL if a - 0.05 <= t <= b + 0.05), None)

segmentos = []
for (p0, t0), (p1, t1) in FRASES:
    i0, i1 = idx(p0, t0), idx(p1, t1)
    ini, fim = W[i0]["inicio"], W[i1]["fim"]
    s = silencio_em(ini - 0.02)  # se a frase começa logo a seguir a um silêncio, corta a meio dele
    ini = max(s[1] - MARGEM, s[0]) if s else max(0, ini - 0.06)
    s = silencio_em(fim + 0.02)
    fim = min(s[0] + MARGEM + 0.05, s[1]) if s else fim + 0.1
    # pausas longas dentro da frase
    cortes = [(a + MARGEM, b - MARGEM) for a, b in SIL if a > ini + 0.2 and b < fim - 0.2 and b - a > PAUSA_MAX]
    pos = ini
    fim_frase = lambda t: any(w["fim"] <= t + 0.15 and w["fim"] >= t - 0.6 and w["palavra"][-1] in ".?!" for w in W)
    for a, b in cortes:
        segmentos.append([round(pos, 3), round(a, 3), 1 if fim_frase(a) else 0]); pos = b
    segmentos.append([round(pos, 3), round(fim, 3), 1])  # 1 = fim de frase (troca de zoom)

dur = sum(b - a for a, b, _ in segmentos)
json.dump({"segmentos": segmentos}, open("src/montagem_curta.json", "w"), indent=1)
print(f"{len(segmentos)} segmentos, {dur:.2f} s de vídeo principal")
for a, b, z in segmentos: print(f"  {a:6.2f} – {b:6.2f}  ({b-a:4.2f}s){'  ← fim de frase' if z else ''}")
