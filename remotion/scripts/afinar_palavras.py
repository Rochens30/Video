"""Afina o início de cada palavra ao ataque real do som (librosa onset strength).
O ASR dá tempos com ~80 ms de granularidade; para os cortes e títulos caírem em cima da sílaba,
procura o pico de ataque mais forte entre −120 ms e +80 ms do tempo do ASR.
Uso: python3 scripts/afinar_palavras.py public/original.mp4 src/palavras.json src/promo/inicios.json"""
import json, subprocess, sys
import librosa
import numpy as np

video, palavras, dst = sys.argv[1:4]
wav = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", "22050", "-f", "f32le", "-"], capture_output=True, check=True).stdout
y = np.frombuffer(wav, np.float32)
HOP = 220  # 10 ms
env = librosa.onset.onset_strength(y=y, sr=22050, hop_length=HOP)
t_env = librosa.frames_to_time(np.arange(len(env)), sr=22050, hop_length=HOP)
out = []
for p in json.load(open(palavras))["palavras"]:
    j = (t_env >= p["inicio"] - 0.12) & (t_env <= p["inicio"] + 0.08)
    if not np.any(j):
        out.append([p["inicio"], p["inicio"]]); continue
    k = np.argmax(np.where(j, env, -1))
    out.append([p["inicio"], round(float(t_env[k]), 3)])
json.dump(out, open(dst, "w"))
d = np.array([b - a for a, b in out])
print(f"{len(out)} palavras · desvio mediano {np.median(d)*1000:+.0f} ms · |desvio| médio {np.mean(np.abs(d))*1000:.0f} ms")
