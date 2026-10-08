"""Compõe e sintetiza uma música de fundo lo-fi (90 BPM, Lá menor), sem samples externos.

Uso: python3 scripts/sintetizar_musica.py public/musica.wav 78
"""
import sys, wave
import numpy as np

SR = 44100
saida, DUR = sys.argv[1], float(sys.argv[2])
BPM = 90
BEAT = 60 / BPM
BAR = 4 * BEAT
n = int(DUR * SR)
t = np.arange(n) / SR
rng = np.random.default_rng(3)

def hz(midi): return 440 * 2 ** ((midi - 69) / 12)

# Progressão Am7 – Fmaj7 – Cmaj7 – G6 (um acorde por compasso)
ACORDES = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 55, 59, 64], [55, 59, 62, 64]]
BAIXOS = [45, 41, 36, 43]

def lowpass_fft(x, fc, ordem=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** (2 * ordem)), len(x))

def highpass_fft(x, fc, ordem=4):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X * (1 - 1 / np.sqrt(1 + (f / fc) ** (2 * ordem))), len(x))

def saw(freq, tt): return 2 * ((freq * tt) % 1) - 1

pad = np.zeros(n); baixo = np.zeros(n); pluck = np.zeros(n); kick = np.zeros(n); hats = np.zeros(n); snare = np.zeros(n)
nbar = int(np.ceil(DUR / BAR))
for b in range(nbar):
    i0 = int(b * BAR * SR); i1 = min(n, int((b + 1) * BAR * SR) + int(0.3 * SR))
    if i0 >= n: break
    tt = t[i0:i1] - b * BAR
    k = b % 4
    # Pad: 3 serras desafinadas por nota, ataque lento
    env = np.minimum(1, tt / 0.6) * np.where(tt > BAR, np.exp(-(tt - BAR) / 0.1), 1)
    for m in ACORDES[k]:
        for d in (-0.08, 0, 0.08):
            pad[i0:i1] += saw(hz(m + d), tt + rng.random()) * env * 0.06
    # Baixo: seno + um pouco de 2.º harmónico, nos tempos 1 e 3
    for beat in (0, 2):
        s = beat * BEAT; e = tt - s; on = e >= 0
        envb = np.where(on, np.exp(-np.clip(e, 0, None) / 0.9), 0)
        f0 = hz(BAIXOS[k])
        baixo[i0:i1] += (np.sin(2 * np.pi * f0 * e) + 0.25 * np.sin(4 * np.pi * f0 * e)) * envb * 0.2
    # Pluck: arpejo em colcheias com notas do acorde (oitava acima)
    notas = ACORDES[k] + [ACORDES[k][1] + 12]
    padrao = [0, 2, 1, 3, 4, 2, 3, 1]
    for j, p in enumerate(padrao):
        e = tt - j * BEAT / 2; on = e >= 0
        envp = np.where(on, np.exp(-np.clip(e, 0, None) / 0.18), 0)
        f0 = hz(notas[p] + 12)
        pluck[i0:i1] += np.sin(2 * np.pi * f0 * e) * envp * (0.16 if j % 2 == 0 else 0.11)
    # Bateria lo-fi: bombo em 1 e 3 (e 3.5), tarola suave em 2 e 4, chimbal em colcheias
    for s in (0, 2 * BEAT, 2.5 * BEAT):
        e = tt - s; on = (e >= 0) & (e < 1.0)
        fk = 50 + 70 * np.exp(-np.clip(e, 0, None) / 0.03)
        kick[i0:i1] += np.where(on, np.sin(2 * np.pi * np.cumsum(np.where(on, fk, 0)) / SR) * np.exp(-np.clip(e, 0, None) / 0.15), 0) * 0.4
    for s in (BEAT, 3 * BEAT):
        e = tt - s; on = e >= 0
        snare[i0:i1] += np.where(on, rng.standard_normal(len(tt)) * np.exp(-np.clip(e, 0, None) / 0.07), 0) * 0.28
    for j in range(8):
        e = tt - j * BEAT / 2; on = e >= 0
        hats[i0:i1] += np.where(on, rng.standard_normal(len(tt)) * np.exp(-np.clip(e, 0, None) / 0.025), 0) * (0.22 if j % 2 else 0.14)

pad = highpass_fft(lowpass_fft(pad, 1800), 160, 2)
pluck = lowpass_fft(pluck, 3500)
snare = lowpass_fft(highpass_fft(snare, 900), 5000)
hats = highpass_fft(hats, 5000)
# "Sidechain": o pad baixa ligeiramente em cada bombo (respiração típica do lo-fi)
fase_beat = (t % (2 * BEAT)) / (2 * BEAT)
pump = 0.75 + 0.25 * np.minimum(1, fase_beat * 6)
mix = pad * pump + baixo + pluck + kick + snare + hats
# Saturação suave + leve ruído de vinil
mix = np.tanh(mix * 1.2) + lowpass_fft(rng.standard_normal(n), 4000) * 0.004
# Fade in / out
fade = np.minimum(1, t / 1.0) * np.minimum(1, (DUR - t) / 2.5)
mix = mix * fade
mix = mix / np.max(np.abs(mix)) * 0.89
estereo = np.stack([mix, np.roll(mix, int(0.012 * SR)) * 0.97], axis=1)  # largura leve (efeito Haas)
with wave.open(saida, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((estereo * 32767).astype(np.int16).tobytes())
print("ok", DUR, "s")
