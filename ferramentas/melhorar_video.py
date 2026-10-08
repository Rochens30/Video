"""Melhora a qualidade de um vídeo de baixa resolução antes da edição.

Imagem: super-resolução com IA (Real-ESRGAN "realesr-general-x4v3", BSD-3) a correr em ONNX no CPU —
        os pesos .pth são lidos sem PyTorch e convertidos para um grafo ONNX. Depois reduz-se para a
        resolução final (1080×1920) com Lanczos, e aplica-se uma correção de cor suave.
Som:    filtro de graves + um pouco de presença na voz (medir antes: se a voz já for limpa, não comprimir nem reduzir ruído).

A IA demora ~7 s por frame num CPU de 4 núcleos, por isso só se processam as frames usadas na montagem
(INTERVALOS.json = lista de [início, fim] em segundos) e o processo é retomável.

Uso:
  pip install onnx onnxruntime opencv-python-headless numpy
  python3 ferramentas/melhorar_video.py teste  ENTRADA.mp4 SEGUNDO comparacao.png   # 1 frame, antes | depois
  python3 ferramentas/melhorar_video.py frames ENTRADA.mp4 PASTA_FRAMES INTERVALOS.json
  python3 ferramentas/melhorar_video.py montar ENTRADA.mp4 PASTA_FRAMES SAIDA.mp4
"""
import os, pickle, subprocess, sys, time, urllib.request, zipfile
import numpy as np

MODELOS = os.environ.get("REEL_MODELOS", os.path.expanduser("~/.cache/reel-modelos"))
URL = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.5.0/realesr-general-x4v3.pth"


# ---------- leitura de .pth sem PyTorch ----------
class _Storage:
    def __init__(self, dtype): self.dtype = dtype

class _Unpickler(pickle.Unpickler):
    DT = {"FloatStorage": np.float32, "HalfStorage": np.float16, "LongStorage": np.int64}

    def __init__(self, f, zf, pref):
        super().__init__(f); self.zf, self.pref = zf, pref

    def find_class(self, mod, name):
        if name in self.DT: return _Storage(self.DT[name])
        if name == "_rebuild_tensor_v2":
            def rebuild(storage, offset, size, stride, *a):
                arr = storage
                n = int(np.prod(size)) if size else 1
                flat = arr[offset:offset + max(n, 1) + (sum((s - 1) * st for s, st in zip(size, stride)) if size else 0)]
                return np.lib.stride_tricks.as_strided(flat, shape=size, strides=[st * flat.itemsize for st in stride]).copy()
            return rebuild
        if mod == "collections" and name == "OrderedDict":
            import collections; return collections.OrderedDict
        return super().find_class(mod, name)

    def persistent_load(self, pid):
        _, storage, key, *_ = pid
        raw = self.zf.read(f"{self.pref}/data/{key}")
        return np.frombuffer(raw, dtype=storage.dtype)


def carrega_pth(caminho):
    zf = zipfile.ZipFile(caminho)
    pkl = next(n for n in zf.namelist() if n.endswith("data.pkl"))
    pref = pkl.rsplit("/", 1)[0]
    import io
    sd = _Unpickler(io.BytesIO(zf.read(pkl)), zf, pref).load()
    return sd.get("params", sd)


# ---------- grafo ONNX do SRVGGNetCompact ----------
def constroi_onnx(sd, caminho):
    import onnx
    from onnx import helper, numpy_helper, TensorProto
    nos, inits = [], []
    convs = sorted({int(k.split(".")[1]) for k in sd if k.startswith("body.")})
    x = "entrada"
    for i in convs:
        p = f"body.{i}"
        if f"{p}.weight" not in sd: continue
        w = sd[f"{p}.weight"].astype(np.float32)
        if w.ndim == 4:  # conv 3x3
            b = sd[f"{p}.bias"].astype(np.float32)
            inits += [numpy_helper.from_array(w, f"{p}.w"), numpy_helper.from_array(b, f"{p}.b")]
            nos.append(helper.make_node("Conv", [x, f"{p}.w", f"{p}.b"], [f"{p}.o"], pads=[1, 1, 1, 1]))
        else:  # PReLU (64,) → (64,1,1)
            inits.append(numpy_helper.from_array(w.reshape(-1, 1, 1), f"{p}.w"))
            nos.append(helper.make_node("PRelu", [x, f"{p}.w"], [f"{p}.o"]))
        x = f"{p}.o"
    nos.append(helper.make_node("DepthToSpace", [x], ["ps"], blocksize=4, mode="CRD"))
    inits.append(numpy_helper.from_array(np.array([1, 1, 4, 4], np.float32), "esc"))
    nos.append(helper.make_node("Resize", ["entrada", "", "esc"], ["base"], mode="nearest"))
    nos.append(helper.make_node("Add", ["ps", "base"], ["saida"]))
    g = helper.make_graph(nos, "srvgg", [helper.make_tensor_value_info("entrada", TensorProto.FLOAT, [1, 3, None, None])],
                          [helper.make_tensor_value_info("saida", TensorProto.FLOAT, [1, 3, None, None])], inits)
    m = helper.make_model(g, opset_imports=[helper.make_opsetid("", 17)], ir_version=8)
    onnx.save(m, caminho)


def sessao():
    import onnxruntime as ort
    os.makedirs(MODELOS, exist_ok=True)
    pth = os.path.join(MODELOS, "realesr-general-x4v3.pth")
    onx = os.path.join(MODELOS, "realesr-general-x4v3.onnx")
    if not os.path.exists(pth): urllib.request.urlretrieve(URL, pth)
    if not os.path.exists(onx): constroi_onnx(carrega_pth(pth), onx)
    op = ort.SessionOptions(); op.intra_op_num_threads = os.cpu_count() or 4
    return ort.InferenceSession(onx, op, providers=["CPUExecutionProvider"])


def super_resolucao(sess, rgb):
    x = rgb.astype(np.float32).transpose(2, 0, 1)[None] / 255
    y = sess.run(None, {"entrada": x})[0][0]
    return (np.clip(y, 0, 1).transpose(1, 2, 0) * 255).round().astype(np.uint8)


def para_final(rgb4x, w=1080, h=1920):
    import cv2
    return cv2.resize(rgb4x, (w, h), interpolation=cv2.INTER_AREA)


COR = "eq=contrast=1.03:saturation=1.05"
# A voz original (lapela) já tem ~33 dB de relação voz/ruído: redução de ruído e compressão PIORAVAM-na (24 dB).
# Fica só um filtro de graves e +2 dB de presença (clareza no telemóvel).
VOZ = "highpass=f=75,equalizer=f=3500:t=q:w=1.2:g=2"
MISTURA = 0.6  # 60 % IA + 40 % original ampliado: nitidez da IA sem pele "de plástico"


def info(entrada):
    w, h, fps = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate",
                                "-of", "csv=p=0", entrada], capture_output=True, text=True).stdout.strip().split(",")
    a, b = fps.split("/")
    return int(w), int(h), fps, float(a) / float(b)


def frames(entrada):
    w, h, _, _ = info(entrada)
    le = subprocess.Popen(["ffmpeg", "-v", "error", "-i", entrada, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    while True:
        buf = le.stdout.read(w * h * 3)
        if len(buf) < w * h * 3: break
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    le.wait()


def ampliado(rgb):
    import cv2
    return cv2.resize(rgb, (1080, 1920), interpolation=cv2.INTER_LANCZOS4)


def melhora(sess, rgb):
    ia = para_final(super_resolucao(sess, rgb)).astype(np.float32)
    return np.clip(MISTURA * ia + (1 - MISTURA) * ampliado(rgb), 0, 255).round().astype(np.uint8)


def processa(entrada, pasta, intervalos):
    """Passa pela IA só as frames dentro dos intervalos (segundos). Retomável: salta as que já existem."""
    import cv2
    os.makedirs(pasta, exist_ok=True)
    _, _, _, fps = info(entrada)
    dentro = lambda n: any(a - 0.2 <= n / fps <= b + 0.2 for a, b in intervalos)
    total = sum(1 for n in range(int(max(b for _, b in intervalos) * fps) + 10) if dentro(n))
    sess, feitos, t0 = sessao(), 0, time.time()
    for n, rgb in enumerate(frames(entrada)):
        alvo = f"{pasta}/{n:06d}.jpg"
        if not dentro(n) or os.path.exists(alvo): continue
        cv2.imwrite(alvo + ".tmp.jpg", cv2.cvtColor(melhora(sess, rgb), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 97])
        os.replace(alvo + ".tmp.jpg", alvo)
        feitos += 1
        if feitos % 20 == 0:
            ja = len([f for f in os.listdir(pasta) if f.endswith(".jpg") and not f.endswith(".tmp.jpg")])
            print(f"{ja}/{total} frames · {(time.time() - t0) / feitos:.1f} s/frame", flush=True)
    print("frames prontas")


def monta(entrada, pasta, saida):
    """Junta as frames melhoradas (as restantes são só ampliadas) + cor + voz tratada."""
    import cv2
    _, _, fps_txt, _ = info(entrada)
    escreve = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", "1080x1920", "-r", fps_txt, "-i", "-",
                                "-i", entrada, "-map", "0:v", "-map", "1:a", "-vf", COR, "-af", VOZ,
                                "-c:v", "libx264", "-preset", "slow", "-crf", "15", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", saida],
                               stdin=subprocess.PIPE)
    ia = 0
    for n, rgb in enumerate(frames(entrada)):
        f = f"{pasta}/{n:06d}.jpg"
        if os.path.exists(f):
            out = cv2.cvtColor(cv2.imread(f), cv2.COLOR_BGR2RGB); ia += 1
        else:
            out = ampliado(rgb)
        escreve.stdin.write(out.tobytes())
    escreve.stdin.close(); escreve.wait()
    print(f"Pronto: {saida} ({ia} frames com IA)")


def teste(entrada, seg, saida_png):
    import cv2
    p = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(seg), "-i", entrada, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                       capture_output=True, check=True).stdout
    w, h, _, _ = info(entrada)
    rgb = np.frombuffer(p, np.uint8).reshape(h, w, 3)
    sess = sessao(); t = time.time(); depois = melhora(sess, rgb); dt = time.time() - t
    cv2.imwrite(saida_png, cv2.cvtColor(np.hstack([ampliado(rgb), depois]), cv2.COLOR_RGB2BGR))
    print(f"1 frame em {dt:.1f} s → {saida_png} (antes | depois)")


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "teste": teste(sys.argv[2], float(sys.argv[3]), sys.argv[4])
    elif cmd == "frames":
        import json
        processa(sys.argv[2], sys.argv[3], json.load(open(sys.argv[4])))
    elif cmd == "montar": monta(sys.argv[2], sys.argv[3], sys.argv[4])
    else: sys.exit(__doc__)
