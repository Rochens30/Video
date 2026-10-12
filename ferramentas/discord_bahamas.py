"""Monta no Discord a estrutura do Bahamas (cargos, categorias, canais e permissões).

Uso:
  python3 ferramentas/discord_bahamas.py --simular         # mostra o que vai ser criado, sem tocar no Discord
  python3 ferramentas/discord_bahamas.py ID_DO_SERVIDOR    # aplica no servidor

Precisa da variável DISCORD_BOT_TOKEN. O bot tem de estar no servidor com: Gerir Cargos, Gerir Canais,
Ver Canais, Enviar Mensagens, Ler Histórico, Adicionar Reações, Anexar Ficheiros, Inserir Links, Ligar e Falar.
Pode correr várias vezes: o que já existe (mesmo nome) não é criado de novo nem alterado.
"""
import json, os, sys, time, urllib.error, urllib.parse, urllib.request

API = "https://discord.com/api/v10"

# Bits de permissão do Discord.
VER, ENVIAR, REACOES, LINKS, ANEXOS, HISTORICO = 1 << 10, 1 << 11, 1 << 6, 1 << 14, 1 << 15, 1 << 16
LIGAR, FALAR, GERIR_CANAIS = 1 << 20, 1 << 21, 1 << 4
MEMBRO = VER | ENVIAR | REACOES | LINKS | ANEXOS | HISTORICO | LIGAR | FALAR

BASE, GERENCIA, PRIMOS = "🌴 Bahamas", "💼 Gerência Bahamas", "🌵 Los Primos"
# De cima para baixo. Os cargos novos entram no fundo da lista, por isso criar por esta ordem deixa-os ordenados.
CARGOS = [  # (nome, cor, mencionável)
    (GERENCIA, 0xF1C40F, True),
    ("🛡️ Segurança Bahamas", 0xE74C3C, True),
    ("🍸 Barman Bahamas", 0x3498DB, True),
    ("🎧 DJ Bahamas", 0x9B59B6, True),
    (BASE, 0x1ABC9C, True),
    (PRIMOS, 0, False),  # sem cor e sem menções, para ficar discreto
]

TEXTO, VOZ, CATEGORIA = 0, 2, 4
ESTRUTURA = [  # (categoria, cargo que dá acesso, [(canal, tipo, só a gerência escreve)])
    ("⋆｡°✩ 🌴 BAHAMAS ✩°｡⋆", BASE, [
        ("╭・🎉・eventos", TEXTO, True),
        ("├・💬・chat", TEXTO, False),
        ("├・🎶・playlist", TEXTO, False),
        ("╰・📸・fotos", TEXTO, False),
        ("╰ 🎶 Bahamas Lounge", VOZ, False),
    ]),
    ("⋆｡°✩ 💼 NEGÓCIOS ✩°｡⋆", BASE, [
        ("╭・🤝・parcerias", TEXTO, True),
        ("├・👕・roupa", TEXTO, False),
        ("╰・📦・encomendas", TEXTO, False),
    ]),
    ("⋆｡°✩ 🌵 LOS PRIMOS ✩°｡⋆", PRIMOS, [
        ("╭・🧥・roupa", TEXTO, False),
        ("├・🎒・inventário", TEXTO, False),
        ("├・📷・fotos", TEXTO, False),
        ("╰・🤝・parcerias", TEXTO, False),
    ]),
]


def pedido(metodo, caminho, corpo=None):
    req = urllib.request.Request(
        API + caminho, method=metodo,
        data=json.dumps(corpo).encode() if corpo is not None else None,
        headers={"Authorization": "Bot " + TOKEN, "Content-Type": "application/json",
                 "User-Agent": "DiscordBot (bahamas-setup, 1.0)",
                 "X-Audit-Log-Reason": urllib.parse.quote("Estrutura Bahamas")})
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read() or b"null")
    except urllib.error.HTTPError as e:
        if e.code == 429:  # limite de pedidos: espera o que o Discord pedir e tenta de novo
            time.sleep(json.loads(e.read()).get("retry_after", 1) + 0.1)
            return pedido(metodo, caminho, corpo)
        sys.exit(f"Erro {e.code} em {metodo} {caminho}: {e.read().decode()}")


def permissoes(servidor, bot, cargos, acesso, so_gerencia):
    membro = {"id": cargos[acesso], "type": 0, "allow": str(MEMBRO), "deny": "0"}
    p = [{"id": servidor, "type": 0, "allow": "0", "deny": str(VER)},  # @everyone tem o id do servidor
         membro,
         {"id": bot, "type": 1, "allow": str(VER | GERIR_CANAIS), "deny": "0"}]  # o bot continua a ver o que esconde
    if so_gerencia:
        membro["allow"], membro["deny"] = str(MEMBRO & ~ENVIAR), str(ENVIAR)
        p.append({"id": cargos[GERENCIA], "type": 0, "allow": str(ENVIAR), "deny": "0"})
    return p


if "--simular" in sys.argv:
    print("CARGOS (de cima para baixo):")
    for nome, cor, mencionavel in CARGOS:
        print(f"  {nome:24} cor {'#%06X' % cor if cor else 'nenhuma':8} mencionável: {'sim' if mencionavel else 'não'}")
    for cat, acesso, canais in ESTRUTURA:
        print(f"\n{cat}   (só vê quem tem {acesso})")
        for nome, tipo, so_ger in canais:
            print(f"  {'🔊' if tipo == VOZ else '#'} {nome}{'   (só a Gerência escreve)' if so_ger else ''}")
    sys.exit()

if len(sys.argv) < 2 and not os.environ.get("DISCORD_GUILD_ID"):
    sys.exit(__doc__)
SERVIDOR = sys.argv[1] if len(sys.argv) > 1 else os.environ["DISCORD_GUILD_ID"]
TOKEN = os.environ.get("DISCORD_BOT_TOKEN") or sys.exit("Falta a variável DISCORD_BOT_TOKEN.")

bot = pedido("GET", "/users/@me")["id"]
existentes = {r["name"]: r["id"] for r in pedido("GET", f"/guilds/{SERVIDOR}/roles")}
cargos = {}
for nome, cor, mencionavel in CARGOS:
    if nome in existentes:
        cargos[nome] = existentes[nome]
        print(f"= cargo já existe: {nome}")
        continue
    cargos[nome] = pedido("POST", f"/guilds/{SERVIDOR}/roles", {
        "name": nome, "color": cor, "hoist": False, "mentionable": mencionavel, "permissions": "0"})["id"]
    print(f"+ cargo: {nome}")

todos = pedido("GET", f"/guilds/{SERVIDOR}/channels")


def procura(nome, tipo, pai=None):
    # O Discord guarda os nomes dos canais de texto em minúsculas.
    return next((c["id"] for c in todos if c["type"] == tipo and c.get("parent_id") == pai
                 and c["name"].lower() == nome.lower()), None)


for cat, acesso, canais in ESTRUTURA:
    cat_id = procura(cat, CATEGORIA)
    if cat_id:
        print(f"= categoria já existe: {cat}")
    else:
        cat_id = pedido("POST", f"/guilds/{SERVIDOR}/channels", {
            "name": cat, "type": CATEGORIA,
            "permission_overwrites": permissoes(SERVIDOR, bot, cargos, acesso, False)})["id"]
        print(f"+ categoria: {cat}")
    for nome, tipo, so_ger in canais:
        if procura(nome, tipo, cat_id):
            print(f"  = canal já existe: {nome}")
            continue
        pedido("POST", f"/guilds/{SERVIDOR}/channels", {
            "name": nome, "type": tipo, "parent_id": cat_id,
            "permission_overwrites": permissoes(SERVIDOR, bot, cargos, acesso, so_ger)})
        print(f"  + canal: {nome}")

print("\nFeito. Agora: tira o bot do servidor e faz 'Reset Token' no portal do Discord.")
