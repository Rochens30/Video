"""Segue a cara do orador (OpenCV, Haar) e grava a posição suavizada em src/promo/cara.json.
Usado pelo ReelPromo para manter a cara centrada (x = 540) e a uma altura fixa, sem saltos.
Uso: python3 scripts/seguir_cara.py public/original.mp4 src/promo/cara.json"""
import json, sys
import cv2
import numpy as np

src, dst = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS)
W, H = cap.get(cv2.CAP_PROP_FRAME_WIDTH), cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
casc = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
PASSO = 3  # analisa 1 em cada 3 frames
ts, xs, ys, hs = [], [], [], []
i = 0
while True:
    ok, fr = cap.read()
    if not ok:
        break
    if i % PASSO == 0:
        g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
        caras = casc.detectMultiScale(g, 1.1, 6, minSize=(20, 20))
        if len(caras):
            x, y, w, h = max(caras, key=lambda r: r[2] * r[3])
            ts.append(i / fps); xs.append((x + w / 2) / W); ys.append((y + h / 2) / H); hs.append(h / H)
    i += 1

ts, xs, ys, hs = map(np.array, (ts, xs, ys, hs))
# grelha regular a 10 Hz, mediana (tira deteções erradas) e depois média gaussiana (~0,6 s) para não tremer
grelha = np.arange(0, i / fps, 0.1)
def suave(v, sigma=0.6):
    med = np.array([np.median(v[(ts >= t - 0.4) & (ts <= t + 0.4)]) if np.any((ts >= t - 0.4) & (ts <= t + 0.4)) else np.nan for t in grelha])
    ok = ~np.isnan(med)
    med = np.interp(grelha, grelha[ok], med[ok])
    k = np.exp(-0.5 * (np.arange(-30, 31) * 0.1 / sigma) ** 2); k /= k.sum()
    return np.convolve(np.pad(med, 30, mode="edge"), k, mode="valid")
out = {"passo": 0.1, "x": [round(v, 4) for v in suave(xs)], "y": [round(v, 4) for v in suave(ys)], "h": [round(v, 4) for v in suave(hs, 1.0)]}
json.dump(out, open(dst, "w"))
print(f"{len(ts)} deteções em {i} frames → {len(grelha)} amostras")
