import json, sys
src = json.load(open(sys.argv[1], encoding="utf-8"))
old = {t["slug"]: t for t in src["techniques"]}

# переименования под официальное написание Кодокана / IJF
REN = {"hon-kesa-gatame": ("kesa-gatame", "Kesa-gatame", ["Hon-kesa-gatame"]),
       "kata-ha-jime": ("kataha-jime", "Kataha-jime", ["Kata-ha-jime"]),
       "ude-hishigi-juji-gatame": ("juji-gatame", "Juji-gatame", ["Ude-hishigi-juji-gatame"]),
       "tsukkomi-jime": ("tsukkomi-jime", "Tsukkomi-jime", ["Tsukomi-jime"])}
for o, (s, n, al) in REN.items():
    t = old.pop(o); t["slug"] = s; t["name"] = n; t["aliases"] = al; old[s] = t

def new(name, ru, en, cat, group):
    s = name.lower()
    old[s] = {"slug": s, "name": name, "translation": {"ru": ru, "en": en}, "category": cat, "group": group}

N, K = "nage-waza", "katame-waza"
for name, ru, en, g in [
 ("Seoi-otoshi","Бросок через спину с опусканием на колено","Shoulder drop","te-waza"),
 ("Obi-otoshi","Опрокидывание захватом пояса","Belt drop","te-waza"),
 ("Yama-arashi","«Горная буря»","Mountain storm","te-waza"),
 ("Obi-tori-gaeshi","Переворот захватом пояса","Belt-grab reversal","te-waza"),
 ("Morote-gari","Бросок захватом двух ног","Two-hand reap","te-waza"),
 ("Kuchiki-taoshi","Бросок захватом одной ноги","One-hand drop","te-waza"),
 ("Kibisu-gaeshi","Бросок захватом пятки","Heel trip","te-waza"),
 ("Ko-uchi-gaeshi","Контрприём от подсечки изнутри","Minor inner reap counter","te-waza"),
 ("Sode-tsurikomi-goshi","Бросок через бедро с захватом рукава","Sleeve lift-pull hip throw","koshi-waza"),
 ("O-soto-otoshi","Задняя подножка","Major outer drop","ashi-waza"),
 ("Hane-goshi-gaeshi","Контрприём от подсада бедром и голенью","Spring hip throw counter","ashi-waza"),
 ("Harai-goshi-gaeshi","Контрприём от подхвата бедром","Sweeping hip throw counter","ashi-waza"),
 ("Uchi-mata-gaeshi","Контрприём от подхвата изнутри","Inner thigh throw counter","ashi-waza"),
 ("Hikikomi-gaeshi","Бросок через голову с втягиванием","Pulling-in reversal","ma-sutemi-waza"),
 ("Uchi-makikomi","Бросок вращением внутрь с захватом руки","Inner wraparound throw","yoko-sutemi-waza"),
 ("Daki-wakare","Бросок с обхватом туловища сзади","Rear trunk turnover","yoko-sutemi-waza"),
 ("Uchi-mata-makikomi","Подхват изнутри с падением","Inner thigh wraparound throw","yoko-sutemi-waza"),
 ("Ko-uchi-makikomi","Подсечка изнутри с захватом ноги в падении","Minor inner wraparound throw","yoko-sutemi-waza"),
 ("O-soto-makikomi","Отхват с падением","Major outer wraparound throw","yoko-sutemi-waza"),
 ("Kani-basami","«Ножницы»","Scissors throw","yoko-sutemi-waza"),
 ("Kawazu-gake","Обвив ноги","One-leg entanglement","yoko-sutemi-waza"),
]: new(name, ru, en, N, g)
for name, ru, en, g in [
 ("Uki-gatame","«Плавающее» удержание","Floating hold","osaekomi-waza"),
 ("Ura-gatame","Обратное удержание спиной к уке","Back hold","osaekomi-waza"),
 ("Katate-jime","Удушение одной рукой","One-hand choke","shime-waza"),
 ("Ryote-jime","Удушение двумя руками","Two-hand choke","shime-waza"),
 ("Sode-guruma-jime","Удушение рукавом","Sleeve wheel choke","shime-waza"),
 ("Do-jime","Сдавливание туловища ногами","Trunk strangle","shime-waza"),
 ("Te-gatame","Рычаг локтя руками","Hand armlock","kansetsu-waza"),
 ("Sankaku-gatame","Рычаг локтя из «треугольника»","Triangular armlock","kansetsu-waza"),
 ("Ashi-garami","Узел ноги","Leg entanglement","kansetsu-waza"),
]: new(name, ru, en, K, g)

OFFICIAL = {
 "te-waza": "seoi-nage ippon-seoi-nage seoi-otoshi tai-otoshi kata-guruma sukui-nage obi-otoshi uki-otoshi sumi-otoshi yama-arashi obi-tori-gaeshi morote-gari kuchiki-taoshi kibisu-gaeshi uchi-mata-sukashi ko-uchi-gaeshi",
 "koshi-waza": "uki-goshi o-goshi koshi-guruma tsurikomi-goshi sode-tsurikomi-goshi harai-goshi tsuri-goshi hane-goshi utsuri-goshi ushiro-goshi",
 "ashi-waza": "de-ashi-harai okuri-ashi-harai o-soto-otoshi hiza-guruma uchi-mata tsubame-gaeshi sasae-tsurikomi-ashi ko-soto-gake o-soto-gaeshi o-soto-gari ashi-guruma o-uchi-gaeshi o-uchi-gari harai-tsurikomi-ashi hane-goshi-gaeshi ko-soto-gari o-guruma harai-goshi-gaeshi ko-uchi-gari o-soto-guruma uchi-mata-gaeshi",
 "ma-sutemi-waza": "tomoe-nage sumi-gaeshi hikikomi-gaeshi tawara-gaeshi ura-nage",
 "yoko-sutemi-waza": "yoko-otoshi tani-otoshi hane-makikomi soto-makikomi uchi-makikomi yoko-wakare yoko-guruma yoko-gake daki-wakare uchi-mata-makikomi harai-makikomi ko-uchi-makikomi o-soto-makikomi uki-waza kani-basami kawazu-gake",
 "osaekomi-waza": "kesa-gatame kuzure-kesa-gatame ushiro-kesa-gatame kata-gatame kami-shiho-gatame kuzure-kami-shiho-gatame yoko-shiho-gatame tate-shiho-gatame uki-gatame ura-gatame",
 "shime-waza": "nami-juji-jime gyaku-juji-jime kata-juji-jime hadaka-jime okuri-eri-jime kataha-jime katate-jime ryote-jime sode-guruma-jime tsukkomi-jime sankaku-jime do-jime",
 "kansetsu-waza": "ude-garami juji-gatame ude-gatame hiza-gatame waki-gatame hara-gatame ashi-gatame te-gatame sankaku-gatame ashi-garami",
}
COUNT = {"te-waza":16,"koshi-waza":10,"ashi-waza":21,"ma-sutemi-waza":5,"yoko-sutemi-waza":16,"osaekomi-waza":10,"shime-waza":12,"kansetsu-waza":10}
PROHIBITED = {"do-jime": "запрещён в соревнованиях и рандори", "kani-basami": "запрещён",
              "kawazu-gake": "запрещён", "ashi-garami": "запрещён в соревнованиях"}

official = []
for g, names in OFFICIAL.items():
    sl = names.split()
    assert len(sl) == COUNT[g], (g, len(sl))
    for s in sl:
        t = old.pop(s)
        assert t["group"] == g, (s, t["group"], g)
        if s in PROHIBITED: t["prohibited"] = PROHIBITED[s]
        official.append(t)
assert len(official) == 100 and len({t["slug"] for t in official}) == 100
gokyo = {k: [t["slug"] for t in official if t.get("gokyo") == k] for k in range(1, 6)}
assert all(len(v) == 8 for v in gokyo.values()), gokyo

fundamentals = [t for t in old.values() if t["category"] in ("ukemi", "basics")]
supplementary = [t for t in old.values() if t["category"] not in ("ukemi", "basics")]
detailed = sum(1 for t in official + fundamentals + supplementary if "steps" in t)

data = {
 "meta": {"version": "0.2",
   "basis": "Официальная классификация Кодокана / IJF: 68 nage-waza + 32 katame-waza",
   "counts": {"official": 100, "fundamentals": len(fundamentals), "supplementary": len(supplementary), "withSteps": detailed},
   "note": "Пояса не привязаны: требования по поясам задаются национальными федерациями и подключаются отдельным слоем (syllabi). steps = [kuzushi, tsukuri, kake] для бросков. Тексты собственные, требуют вычитки тренером."},
 "gokyoNoWaza": [{"group": k, "techniques": v} for k, v in gokyo.items()],
 "techniques": official,
 "fundamentals": fundamentals,
 "supplementary": supplementary,
 "syllabi": [],
}
json.dump(data, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(len(official), len(fundamentals), len(supplementary), detailed, [t["slug"] for t in supplementary])
