"""Transcreve um vídeo com o tempo de cada palavra (português).

Combina dois modelos locais (sherpa-onnx, descarregados das releases do GitHub na 1.ª vez):
  - Whisper turbo  → melhor TEXTO (acerta "saldo", "arriscar", "traders"…)
  - Parakeet TDT v3 → TEMPOS por palavra (resolução 80 ms)
O texto do Whisper é alinhado com os tempos do Parakeet; depois os tempos são afinados
com as pausas reais do áudio (silencedetect). REVÊ SEMPRE o texto final: os dois modelos
erram palavras técnicas e o resultado tem de ser corrigido à mão em `palavras.json`.

Uso:
  pip install sherpa-onnx numpy
  python3 ferramentas/transcrever.py VIDEO.mp4 PASTA_SAIDA
Gera: transcricao_palavras.json / .srt / .md e silencios.txt
"""
import difflib, json, os, re, subprocess, sys, tarfile, urllib.request, wave
import numpy as np

MODELOS = os.environ.get("REEL_MODELOS", os.path.expanduser("~/.cache/reel-modelos"))
BASE = "https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models"
PARAKEET = "sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8"
WHISPER = "sherpa-onnx-whisper-turbo"
SR = 16000


def garante_modelo(nome):
    pasta = os.path.join(MODELOS, nome)
    if not os.path.isdir(pasta):
        os.makedirs(MODELOS, exist_ok=True)
        tgz = os.path.join(MODELOS, nome + ".tar.bz2")
        print(f"A descarregar {nome}…", flush=True)
        urllib.request.urlretrieve(f"{BASE}/{nome}.tar.bz2", tgz)
        with tarfile.open(tgz) as t:
            t.extractall(MODELOS)
        os.remove(tgz)
    return pasta


def extrai_audio(video, wav):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", video, "-ac", "1", "-ar", str(SR), wav], check=True)
    w = wave.open(wav)
    return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768


def silencios(video, limiar="-40dB", minimo=0.12):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", video, "-af", f"silencedetect=n={limiar}:d={minimo}", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    ini = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]
    fim = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(ini, fim))


def parakeet(audio):
    import sherpa_onnx
    d = garante_modelo(PARAKEET)
    r = sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=f"{d}/encoder.int8.onnx", decoder=f"{d}/decoder.int8.onnx", joiner=f"{d}/joiner.int8.onnx",
        tokens=f"{d}/tokens.txt", model_type="nemo_transducer", num_threads=os.cpu_count() or 4)
    s = r.create_stream(); s.accept_waveform(SR, audio); r.decode_stream(s)
    res = s.result
    palavras = []
    for tok, t0, dur in zip(res.tokens, res.timestamps, res.durations):
        if tok.startswith(" ") or not palavras:
            palavras.append([tok.strip(), t0, t0 + dur])
        else:
            palavras[-1][0] += tok; palavras[-1][2] = t0 + dur
    return palavras


def whisper(audio, cortes):
    import sherpa_onnx
    d = garante_modelo(WHISPER)
    r = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{d}/turbo-encoder.int8.onnx", decoder=f"{d}/turbo-decoder.int8.onnx", tokens=f"{d}/turbo-tokens.txt",
        language="pt", task="transcribe", num_threads=os.cpu_count() or 4)
    texto = []
    for a, b in zip(cortes, cortes[1:]):  # o Whisper só aceita blocos ≤ 30 s
        s = r.create_stream(); s.accept_waveform(SR, audio[int(a * SR):int(b * SR)]); r.decode_stream(s)
        texto.append(s.result.text.strip())
    return " ".join(texto).split()


def blocos_ate_30s(pk, dur):
    """Corta em fins de frase do Parakeet, com blocos de 12–28 s."""
    cortes = [0.0]
    for i, w in enumerate(pk[:-1]):
        if w[0][-1:] in ".?!" and pk[i + 1][1] - cortes[-1] > 12:
            cortes.append(pk[i + 1][1])
    cortes.append(dur)
    return cortes


def alinha(pk, final):
    norm = lambda w: re.sub(r"[^\wà-ú]", "", w.lower())
    A = [norm(w[0]) for w in pk]; B = [norm(w) for w in final]
    tempos = [None] * len(final)

    def espalha(t0, t1, idx):
        L = [len(final[j]) for j in idx]; tot = sum(L) or 1; t = t0
        for j, l in zip(idx, L):
            d = (t1 - t0) * l / tot; tempos[j] = (t, t + d); t += d

    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
        if op == "equal" or (op == "replace" and i2 - i1 == j2 - j1):
            for k in range(j2 - j1): tempos[j1 + k] = (pk[i1 + k][1], pk[i1 + k][2])
        elif op == "replace":
            espalha(pk[i1][1], pk[i2 - 1][2], range(j1, j2))
        elif op == "insert":
            p = max(j1 - 1, 0)
            if tempos[p] is None: tempos[p] = (pk[min(i1, len(pk) - 1)][1],) * 2
            espalha(tempos[p][0], tempos[p][1], range(p, j2))
    return [{"palavra": w, "inicio": round(t[0], 2), "fim": round(t[1], 2)} for w, t in zip(final, tempos)]


def afina(W, sil):
    for s0, s1 in sil:
        for w in W:
            if s0 - 0.08 < w["fim"] <= s1 + 0.08 and s0 - w["inicio"] >= 0.08: w["fim"] = round(s0, 2)
            if s0 - 0.08 <= w["inicio"] < s1 and w["fim"] - s1 >= 0.08: w["inicio"] = round(s1, 2)
    return W


def main(video, saida):
    os.makedirs(saida, exist_ok=True)
    wav = os.path.join(saida, "_audio.wav")
    audio = extrai_audio(video, wav); dur = len(audio) / SR
    pk = parakeet(audio)
    final = whisper(audio, blocos_ate_30s(pk, dur))
    sil = silencios(video)
    W = afina(alinha(pk, final), sil)
    os.remove(wav)
    json.dump({"fonte": os.path.basename(video), "duracao_s": round(dur, 2), "idioma": "pt", "palavras": W},
              open(f"{saida}/transcricao_palavras.json", "w"), ensure_ascii=False, indent=1)
    ts = lambda x: "%02d:%02d:%02d,%03d" % (x // 3600, x % 3600 // 60, x % 60, round(x % 1 * 1000) % 1000)
    open(f"{saida}/transcricao_palavras.srt", "w").write(
        "".join(f"{i}\n{ts(w['inicio'])} --> {ts(w['fim'])}\n{w['palavra']}\n\n" for i, w in enumerate(W, 1)))
    md = ["# Transcrição com tempo de cada palavra\n", "## Texto\n", " ".join(w["palavra"] for w in W) + "\n",
          "## Palavra a palavra\n", "| # | Início (s) | Fim (s) | Palavra |", "|---:|---:|---:|---|"]
    md += [f"| {i} | {w['inicio']:.2f} | {w['fim']:.2f} | {w['palavra']} |" for i, w in enumerate(W, 1)]
    open(f"{saida}/transcricao_palavras.md", "w").write("\n".join(md) + "\n")
    open(f"{saida}/silencios.txt", "w").write("".join(f"{a} {b}\n" for a, b in sil))
    print(" ".join(w["palavra"] for w in W))
    print(f"\n{len(W)} palavras → {saida}/  (revê o texto e corrige à mão o que estiver mal)")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
