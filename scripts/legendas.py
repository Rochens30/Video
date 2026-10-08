"""Gera legendas .ass (3 estilos) a partir de transcricoes/transcricao_palavras.json.

Uso: python3 scripts/legendas.py transcricoes/transcricao_palavras.json exemplos/
Os ficheiros .ass assumem um vídeo 1080x1920 (vertical).
"""
import json, re, sys

src, out = sys.argv[1], sys.argv[2]
W = json.load(open(src))["palavras"]

# Palavras-chave que ganham destaque (comparação sem pontuação e em minúsculas).
CHAVE = {"consistência", "perdes", "garantidos", "traders", "normal", "risco", "critério",
         "registar", "controlas", "estratégia", "perdas", "arriscar", "loss", "destruir",
         "saldo", "plano", "consistente"}
AMARELO, VERDE, BRANCO = "&H0000D4FF&", "&H0066FF33&", "&H00FFFFFF&"   # BGR
Y = 1150  # ~60% da altura: abaixo da cara, acima da zona tapada pela interface do Reels/TikTok

def limpa(w): return re.sub(r"[^\wà-ú]", "", w.lower())
def t(x):
    cs = int(round(x * 100)); h, cs = divmod(cs, 360000); m, cs = divmod(cs, 6000); s, cs = divmod(cs, 100)
    return f"{h}:{m:02}:{s:02}.{cs:02}"

def cabecalho(estilos):
    return ("[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\nWrapStyle: 0\n"
            "ScaledBorderAndShadow: yes\n\n[V4+ Styles]\n"
            "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, "
            "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, "
            "Alignment, MarginL, MarginR, MarginV, Encoding\n" + estilos +
            "\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n")

def fim_visivel(i, extra=0.25):
    """Mantém a legenda até à palavra seguinte se a pausa for curta (evita piscar)."""
    nxt = W[i + 1]["inicio"] if i + 1 < len(W) else W[i]["fim"] + 0.5
    return nxt if nxt - W[i]["fim"] < 0.35 else W[i]["fim"] + extra

def grupos(max_pal, max_chars):
    g, cur = [], []
    for i, w in enumerate(W):
        cur.append(i)
        txt = " ".join(W[k]["palavra"] for k in cur)
        pausa = i + 1 < len(W) and W[i + 1]["inicio"] - w["fim"] > 0.3
        if len(cur) >= max_pal or len(txt) >= max_chars or w["palavra"][-1] in ".,:?!" or pausa:
            g.append(cur); cur = []
    if cur: g.append(cur)
    return g

# 1) Palavra a palavra, estilo "Hormozi": uma palavra de cada vez, grande, com pop.
ev = []
for i, w in enumerate(W):
    cor = AMARELO if limpa(w["palavra"]) in CHAVE else BRANCO
    txt = re.sub(r"[.,:]$", "", w["palavra"]).upper()
    ev.append(f"Dialogue: 0,{t(w['inicio'])},{t(fim_visivel(i))},Pop,,0,0,0,,"
              f"{{\\pos(540,{Y})\\c{cor}\\fscx75\\fscy75\\t(0,90,\\fscx105\\fscy105)\\t(90,150,\\fscx100\\fscy100)}}{txt}")
open(f"{out}/1_palavra_a_palavra.ass", "w").write(cabecalho(
    "Style: Pop,Montserrat Black,118,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,9,4,5,60,60,0,1\n")
    + "\n".join(ev) + "\n")

# 2) Karaoke: 3-4 palavras no ecrã, a palavra dita no momento fica a verde.
ev = []
for g in grupos(4, 20):
    for j, i in enumerate(g):
        ini = W[i]["inicio"] if j else W[g[0]]["inicio"]
        fim = W[g[j + 1]]["inicio"] if j + 1 < len(g) else fim_visivel(g[-1])
        partes = []
        for k in g:
            p = W[k]["palavra"].upper()
            partes.append(f"{{\\c{VERDE}}}{p}{{\\c{BRANCO}}}" if k == i else p)
        ev.append(f"Dialogue: 0,{t(ini)},{t(fim)},Kara,,0,0,0,,{{\\pos(540,{Y})}}" + " ".join(partes))
open(f"{out}/2_karaoke.ass", "w").write(cabecalho(
    "Style: Kara,Montserrat ExtraBold,76,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,7,3,5,90,90,0,1\n")
    + "\n".join(ev) + "\n")

# 3) Clássico: frases curtas (até 2 linhas) numa caixa semitransparente.
ev = []
for g in grupos(9, 42):
    txt = " ".join(W[k]["palavra"] for k in g)
    if len(txt) > 24:  # parte em 2 linhas equilibradas
        pal = txt.split(); corte = min(range(1, len(pal)), key=lambda c: abs(len(" ".join(pal[:c])) - len(txt) / 2))
        txt = " ".join(pal[:corte]) + "\\N" + " ".join(pal[corte:])
    ev.append(f"Dialogue: 0,{t(W[g[0]]['inicio'])},{t(fim_visivel(g[-1]))},Classico,,0,0,0,,{{\\pos(540,{Y})}}{txt}")
open(f"{out}/3_classico.ass", "w").write(cabecalho(
    "Style: Classico,Montserrat ExtraBold,58,&H00FFFFFF,&H00FFFFFF,&H64000000,&H64000000,0,0,0,0,100,100,0,0,3,14,0,5,90,90,0,1\n")
    + "\n".join(ev) + "\n")
print("ok")
