"""Análise técnica de um vídeo antes de editar: formato, jump cuts, pausas, volume e folhas de frames.

Uso: python3 ferramentas/analisar_video.py VIDEO.mp4 PASTA_SAIDA
Gera: analise.json (cortes, pausas, loudness) e frames_*.png (1 frame a cada 2 s) para ver com o Read.
"""
import json, os, re, subprocess, sys
import numpy as np


def corre(args):
    return subprocess.run(args, capture_output=True, text=True)


def main(video, saida):
    os.makedirs(saida, exist_ok=True)
    info = json.loads(corre(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate",
                             "-of", "json", video]).stdout)
    # jump cuts: picos da diferença de luminância entre frames consecutivos (YDIF)
    stats = os.path.join(saida, "_stats.txt")
    corre(["ffmpeg", "-v", "error", "-i", video, "-vf", f"signalstats,metadata=print:file={stats}", "-f", "null", "-"])
    t, ydif = [], []
    for l in open(stats):
        m = re.search(r"pts_time:([\d.]+)", l)
        if m: t.append(float(m.group(1))); ydif.append(0.0); continue
        m = re.search(r"lavfi\.signalstats\.YDIF=([\d.]+)", l)
        if m and ydif: ydif[-1] = float(m.group(1))
    os.remove(stats)
    med = float(np.median(ydif)) if ydif else 0
    cortes = [round(a, 2) for a, d in zip(t, ydif) if d > max(4 * med, 3)]
    err = corre(["ffmpeg", "-hide_banner", "-i", video, "-af", "silencedetect=n=-40dB:d=0.15,ebur128", "-f", "null", "-"]).stderr
    pausas = list(zip(map(float, re.findall(r"silence_start: ([\d.]+)", err)), map(float, re.findall(r"silence_end: ([\d.]+)", err))))
    lufs = re.findall(r"^\s+I:\s+([-\d.]+) LUFS", err, re.M)
    corre(["ffmpeg", "-v", "error", "-y", "-i", video, "-vf",
           "fps=0.5,scale=240:-2,drawtext=text='%{pts\\:hms}':x=5:y=5:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6,tile=6x3",
           f"{saida}/frames_%02d.png"])
    res = {"info": info, "jump_cuts_s": cortes, "pausas_s": pausas, "loudness_lufs": float(lufs[-1]) if lufs else None}
    json.dump(res, open(f"{saida}/analise.json", "w"), indent=1)
    v = next(s for s in info["streams"] if s["codec_type"] == "video")
    print(f"{v['width']}x{v['height']} · {float(info['format']['duration']):.1f}s · {res['loudness_lufs']} LUFS")
    print(f"{len(cortes)} jump cuts: {cortes}")
    print(f"{len(pausas)} pausas > 0,15 s · folhas de frames em {saida}/frames_*.png")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
