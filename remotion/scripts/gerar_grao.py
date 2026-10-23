"""Gera 4 texturas de grão de filme (PNG cinzento, 540×960) para o look cinematográfico.
Uso: python3 scripts/gerar_grao.py public/fx"""
import sys
import numpy as np
from PIL import Image

rng = np.random.default_rng(3)
for i in range(4):
    g = rng.normal(128, 38, (960, 540)).clip(0, 255).astype(np.uint8)
    Image.fromarray(g, "L").save(f"{sys.argv[1]}/grao_{i}.png", optimize=True)
print("ok")
