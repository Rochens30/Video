"""Sintetiza os efeitos sonoros "cinematográficos" (whoosh, impacto, queda) e o clique de rato.

Gerados de raiz, sem samples de terceiros: podem ser usados sem restrições.
Uso: python3 scripts/sintetizar_sfx.py public/sfx
"""
import math, sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
out = sys.argv[1]

def guarda(nome, x, pico=0.89):
    x = x / (np.max(np.abs(x)) + 1e-9) * pico
    # fade de 5 ms nas pontas para evitar cliques
    n = int(0.005 * SR); x[:n] *= np.linspace(0, 1, n); x[-n:] *= np.linspace(1, 0, n)
    with wave.open(f"{out}/{nome}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def passa_banda(x, freqs, q=1.2):
    """Filtro de estado variável com frequência central a variar amostra a amostra."""
    low = band = 0.0; y = np.empty_like(x); damp = 1 / q
    for i, (s, fc) in enumerate(zip(x, freqs)):
        f = 2 * math.sin(math.pi * min(fc, SR / 6) / SR)
        low += f * band; high = s - low - damp * band; band += f * high
        y[i] = band
    return y

def passa_baixo(x, fc):
    a = math.exp(-2 * math.pi * fc / SR); y = np.empty_like(x); z = 0.0
    for i, s in enumerate(x):
        z = (1 - a) * s + a * z; y[i] = z
    return y

def env(n, ataque, pico_em=None):
    t = np.linspace(0, 1, n); p = pico_em or ataque
    return np.where(t < p, (t / p) ** 2, ((1 - t) / (1 - p)) ** 1.6)

def glide(f0, f1, n):  # exponencial
    return f0 * (f1 / f0) ** np.linspace(0, 1, n)

def whoosh(dur, f0, f1, pico):
    n = int(dur * SR); x = rng.standard_normal(n)
    y = passa_banda(x, glide(f0, f1, n), q=1.6) * env(n, pico)
    return y

# Whoosh de entrada e saída do painel
guarda("whoosh_in", whoosh(0.55, 250, 4000, 0.65))
guarda("whoosh_out", whoosh(0.5, 3500, 220, 0.35))

# Impacto (carimbo "NÃO EXISTE"): grave com descida de tom + transiente de ruído
n = int(0.9 * SR); t = np.arange(n) / SR
fase = 2 * np.pi * np.cumsum(glide(120, 42, n)) / SR
grave = np.sin(fase) * np.exp(-t / 0.22)
clique = passa_baixo(rng.standard_normal(n), 2500) * np.exp(-t / 0.012) * 3
# camada média (200-800 Hz) para se ouvir em altifalantes de telemóvel
corpo = np.sin(2 * np.pi * np.cumsum(glide(320, 140, n)) / SR) * np.exp(-t / 0.09) * 0.8
estalo = passa_banda(rng.standard_normal(n), np.full(n, 900.0), q=1.0) * np.exp(-t / 0.05) * 1.5
guarda("impacto", np.tanh(1.8 * (grave + clique + corpo + estalo)))

# Queda da conta: sub drop longo com ronco
n = int(1.6 * SR); t = np.arange(n) / SR
fase = 2 * np.pi * np.cumsum(glide(180, 28, n)) / SR
sub = np.sin(fase) * np.exp(-t / 0.6)
ronco = passa_baixo(rng.standard_normal(n), 160) * np.exp(-t / 0.4) * 6
estalo = passa_baixo(rng.standard_normal(n), 3000) * np.exp(-t / 0.02) * 2
# tom a cair bem audível (700 → 90 Hz), com 2.º harmónico
cai = glide(700, 90, n)
tom = (np.sin(2 * np.pi * np.cumsum(cai) / SR) + 0.4 * np.sin(4 * np.pi * np.cumsum(cai) / SR)) * np.exp(-t / 0.7) * 0.6
guarda("queda", np.tanh(1.5 * (sub + ronco + estalo + tom)))



# Clique de rato: microinterruptor = transiente seco + ressonâncias do plástico (2–9 kHz) a decair em poucos ms.
# "Clic" ao carregar e "clac" mais suave e agudo ao soltar, ~85 ms depois.
def estalido(n, freqs, tau, ganho, brilho=1.0):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for k, fr in enumerate(freqs):
        y += np.sin(2 * np.pi * fr * brilho * t + rng.random() * 6.28) * np.exp(-t / (tau * (1 - 0.15 * k))) / (1 + 0.6 * k)
    ruido = passa_banda(rng.standard_normal(n), np.full(n, 4500.0 * brilho), q=0.8) * np.exp(-t / 0.0015) * 2.5
    corpo = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.012) * 0.35
    return (y + ruido + corpo) * ganho

for v, (brilho, atraso) in enumerate([(0.82, 0.085), (0.88, 0.078)]):
    n = int(0.22 * SR)
    clique = np.zeros(n)
    carregar = estalido(int(0.05 * SR), [3200, 5600, 8300], 0.0045, 1.0, brilho)
    soltar = estalido(int(0.05 * SR), [3600, 6200, 9100], 0.0035, 0.45, brilho)
    i = int(atraso * SR)
    clique[: len(carregar)] += carregar
    clique[i : i + len(soltar)] += soltar
    guarda(f"clique_rato_{v + 1}", clique, pico=0.85)
print("ok")
