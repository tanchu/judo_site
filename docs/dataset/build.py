import json, re

def slug(n): return re.sub(r'[^a-z]+', '-', n.lower()).strip('-')

T = {}
def add(name, ru, en, cat, group=None, gokyo=None, s=None):
    sl = s or slug(name)
    assert sl not in T, sl
    T[sl] = {"slug": sl, "name": name, "translation": {"ru": ru, "en": en}, "category": cat}
    if group: T[sl]["group"] = group
    if gokyo: T[sl]["gokyo"] = gokyo

# --- Nage-waza ---
N = "nage-waza"
rows = [
 ("O-soto-gari","Большой наружный отхват","Major outer reap","ashi-waza",1),
 ("O-goshi","Большой бросок через бедро","Major hip throw","koshi-waza",1),
 ("O-uchi-gari","Большой зацеп изнутри","Major inner reap","ashi-waza",1),
 ("Seoi-nage","Бросок через спину","Shoulder throw","te-waza",1),
 ("De-ashi-harai","Боковая подсечка под выставленную ногу","Advancing foot sweep","ashi-waza",1),
 ("Hiza-guruma","Подсечка в колено","Knee wheel","ashi-waza",1),
 ("Sasae-tsurikomi-ashi","Передняя подсечка под выставленную ногу","Supporting lift-pull foot throw","ashi-waza",1),
 ("Uki-goshi","Бросок скручиванием вокруг бедра","Floating hip throw","koshi-waza",1),
 ("Ko-soto-gari","Задняя подсечка","Minor outer reap","ashi-waza",2),
 ("Ko-uchi-gari","Подсечка изнутри","Minor inner reap","ashi-waza",2),
 ("Koshi-guruma","Бросок через бедро с захватом шеи","Hip wheel","koshi-waza",2),
 ("Tsurikomi-goshi","Бросок через бедро с захватом отворота","Lift-pull hip throw","koshi-waza",2),
 ("Okuri-ashi-harai","Боковая подсечка в темп шагов","Sliding foot sweep","ashi-waza",2),
 ("Tai-otoshi","Передняя подножка","Body drop","te-waza",2),
 ("Harai-goshi","Подхват бедром под две ноги","Sweeping hip throw","koshi-waza",2),
 ("Uchi-mata","Подхват изнутри под одну ногу","Inner thigh throw","ashi-waza",2),
 ("Ko-soto-gake","Зацеп снаружи","Minor outer hook","ashi-waza",3),
 ("Tsuri-goshi","Бросок через бедро с захватом пояса","Lifting hip throw","koshi-waza",3),
 ("Yoko-otoshi","Боковая подножка с падением","Side drop","yoko-sutemi-waza",3),
 ("Ashi-guruma","Бросок через ногу скручиванием","Leg wheel","ashi-waza",3),
 ("Hane-goshi","Подсад бедром и голенью изнутри","Spring hip throw","koshi-waza",3),
 ("Harai-tsurikomi-ashi","Передняя подсечка под отставленную ногу","Lift-pull foot sweep","ashi-waza",3),
 ("Tomoe-nage","Бросок через голову с упором стопой в живот","Circle throw","ma-sutemi-waza",3),
 ("Kata-guruma","Бросок через плечи («мельница»)","Shoulder wheel","te-waza",3),
 ("Sumi-gaeshi","Бросок через голову подсадом голенью","Corner reversal","ma-sutemi-waza",4),
 ("Tani-otoshi","Задняя подножка с падением","Valley drop","yoko-sutemi-waza",4),
 ("Hane-makikomi","Подсад бедром и голенью с захватом руки под плечо в падении","Springing wraparound throw","yoko-sutemi-waza",4),
 ("Sukui-nage","Бросок подхватом ног сзади («черпак»)","Scooping throw","te-waza",4),
 ("Utsuri-goshi","Обратный бросок через бедро с подсадом","Hip shift","koshi-waza",4),
 ("O-guruma","Большое колесо через ногу","Large wheel","ashi-waza",4),
 ("Soto-makikomi","Бросок вращением с захватом руки под плечо","Outer wraparound throw","yoko-sutemi-waza",4),
 ("Uki-otoshi","Бросок выведением из равновесия вперёд","Floating drop","te-waza",4),
 ("O-soto-guruma","Отхват под две ноги","Major outer wheel","ashi-waza",5),
 ("Uki-waza","Передняя подножка с падением","Floating technique","yoko-sutemi-waza",5),
 ("Yoko-wakare","Подножка через туловище с падением","Side separation","yoko-sutemi-waza",5),
 ("Yoko-guruma","Бросок через грудь вращением","Side wheel","yoko-sutemi-waza",5),
 ("Ushiro-goshi","Подсад опрокидыванием назад","Rear hip throw","koshi-waza",5),
 ("Ura-nage","Бросок через грудь прогибом","Rear throw","ma-sutemi-waza",5),
 ("Sumi-otoshi","Бросок выведением из равновесия назад","Corner drop","te-waza",5),
 ("Yoko-gake","Боковая подсечка с падением","Side hook","yoko-sutemi-waza",5),
 # вне Gokyo
 ("Ippon-seoi-nage","Бросок через спину с захватом одной руки","One-arm shoulder throw","te-waza",None),
 ("O-soto-gaeshi","Контрприём от большого наружного отхвата","Major outer reap counter","ashi-waza",None),
 ("O-uchi-gaeshi","Контрприём от большого зацепа изнутри","Major inner reap counter","ashi-waza",None),
 ("Tsubame-gaeshi","Контрподсечка «ласточка»","Swallow counter","ashi-waza",None),
 ("Uchi-mata-sukashi","Уклон от подхвата изнутри со скручиванием","Inner thigh slip","te-waza",None),
 ("Harai-makikomi","Подхват бедром с захватом руки под плечо в падении","Sweeping wraparound throw","yoko-sutemi-waza",None),
 ("Te-guruma","Боковой переворот","Hand wheel","te-waza",None),
 ("Tawara-gaeshi","Бросок через голову с обратным захватом туловища","Rice-bale reversal","ma-sutemi-waza",None),
]
for n, ru, en, g, k in rows: add(n, ru, en, N, g, k)

# --- Katame-waza ---
K = "katame-waza"
for n, ru, en in [
 ("Hon-kesa-gatame","Удержание сбоку","Scarf hold"),
 ("Kuzure-kesa-gatame","Удержание сбоку с захватом из-под руки","Modified scarf hold"),
 ("Makura-kesa-gatame","Удержание сбоку с опорой головы на бедро","Pillow scarf hold"),
 ("Ushiro-kesa-gatame","Обратное удержание сбоку","Reverse scarf hold"),
 ("Kata-gatame","Удержание с фиксацией плеча головой","Shoulder hold"),
 ("Kami-shiho-gatame","Удержание со стороны головы","Upper four-corner hold"),
 ("Kuzure-kami-shiho-gatame","Удержание со стороны головы с захватом руки","Modified upper four-corner hold"),
 ("Yoko-shiho-gatame","Удержание поперёк","Side four-corner hold"),
 ("Kuzure-yoko-shiho-gatame","Вариант удержания поперёк","Modified side four-corner hold"),
 ("Tate-shiho-gatame","Удержание верхом","Straight four-corner hold"),
 ("Kuzure-tate-shiho-gatame","Вариант удержания верхом","Modified straight four-corner hold"),
]: add(n, ru, en, K, "osaekomi-waza")
for n, ru, en in [
 ("Hadaka-jime","Удушение сзади плечом и предплечьем","Naked choke"),
 ("Okuri-eri-jime","Удушение сзади двумя отворотами","Sliding collar choke"),
 ("Kata-ha-jime","Удушение сзади отворотом с выключением руки","Single-wing choke"),
 ("Nami-juji-jime","Удушение спереди скрещивая руки, ладони вниз","Normal cross choke"),
 ("Gyaku-juji-jime","Удушение спереди скрещивая руки, ладони вверх","Reverse cross choke"),
 ("Kata-juji-jime","Удушение спереди скрещивая руки, одна ладонь вверх, другая вниз","Half cross choke"),
 ("Sankaku-jime","Удушение ногами «треугольник»","Triangle choke"),
 ("Tsukkomi-jime","Удушение спереди отворотом толчком","Thrust choke"),
]: add(n, ru, en, K, "shime-waza")
for n, ru, en in [
 ("Ude-hishigi-juji-gatame","Рычаг локтя захватом руки между ног","Cross armlock"),
 ("Ude-garami","Узел локтя","Entangled armlock"),
 ("Ude-gatame","Рычаг локтя с захватом руки на плечо","Straight arm crush"),
 ("Hiza-gatame","Рычаг локтя при помощи колена","Knee armlock"),
 ("Waki-gatame","Рычаг локтя захватом руки под плечо","Armpit armlock"),
 ("Hara-gatame","Рычаг локтя через живот","Stomach armlock"),
 ("Ashi-gatame","Рычаг локтя при помощи ноги","Leg armlock"),
]: add(n, ru, en, K, "kansetsu-waza")

# --- Ne-waza: переходы и уходы ---
D = "ne-waza-drill"
for s, name, ru, en in [
 ("turnover-all-fours-to-kesa","Turnover from all fours into kesa-gatame","Переворот с четверенек в удержание сбоку","Turnover from all fours into scarf hold"),
 ("turnover-facedown-to-kami-shiho","Turnover from face-down into kami-shiho-gatame","Переворот лежащего на животе в удержание со стороны головы","Turnover from face-down into upper four-corner hold"),
 ("arm-turnover","Arm turnover","Переворот захватом руки (уке на животе)","Arm turnover (uke face-down)"),
 ("belt-turnover","Belt turnover","Переворот захватом пояса (уке на животе)","Belt turnover (uke face-down)"),
 ("nogare-kesa-gatame","Nogare from kesa-gatame","Уход с удержания сбоку","Escape from scarf hold"),
 ("nogare-yoko-shiho-gatame","Nogare from yoko-shiho-gatame","Уход с удержания поперёк","Escape from side four-corner hold"),
 ("nogare-kami-shiho-gatame","Nogare from kami-shiho-gatame","Уход с удержания со стороны головы","Escape from upper four-corner hold"),
 ("nogare-tate-shiho-gatame","Nogare from tate-shiho-gatame","Уход с удержания верхом","Escape from straight four-corner hold"),
 ("nogare-kata-gatame","Nogare from kata-gatame","Уход с удержания с фиксацией плеча","Escape from shoulder hold"),
 ("guard-pass","Guard pass","Проход ног (гарда)","Guard pass"),
 ("guard-pass-to-hold","Guard pass into a hold-down","Проход ног с выходом на удержание","Guard pass into a hold-down"),
 ("guard-pass-to-submission","Guard pass into an armlock or choke","Проход ног с выходом на болевой или удушение","Guard pass into an armlock or choke"),
 ("turnover-to-choke","Turnover finishing with a choke","Переворот с выходом на удушение","Turnover finishing with a choke"),
 ("turnover-to-armlock","Turnover finishing with an armlock","Переворот с выходом на болевой","Turnover finishing with an armlock"),
 ("guard-defense-finish","Guard defense with a finish","Защита из положения снизу с завершением","Guard defense with a finish"),
]: add(name, ru, en, D, s=s)

# --- Ukemi ---
for n, ru, en, s in [
 ("Ushiro-ukemi","Страховка при падении назад","Backward breakfall",None),
 ("Yoko-ukemi","Страховка при падении на бок","Side breakfall",None),
 ("Zenpo-kaiten-ukemi (mae-mawari-ukemi)","Страховка кувырком вперёд","Forward rolling breakfall","zenpo-kaiten-ukemi"),
 ("Mae-ukemi","Страховка при падении вперёд","Forward breakfall",None),
]: add(n, ru, en, "ukemi", s=s)

# --- Основы ---
for n, ru, en, s in [
 ("Ritsurei and zarei","Поклон стоя и поклон на коленях","Standing and kneeling bow","rei"),
 ("Kumi-kata","Захваты","Gripping",None),
 ("Kuzushi","Выведение из равновесия","Off-balancing",None),
 ("Obi","Завязывание пояса","Tying the belt",None),
 ("Shisei","Стойки","Postures",None),
 ("Shintai","Передвижения","Movement",None),
 ("Fusegi (ne-waza)","Защита в партере","Defense on the ground","fusegi-ne-waza"),
 ("Fusegi (tachi-waza)","Защита в стойке","Defense standing","fusegi-tachi-waza"),
 ("Tai-sabaki","Повороты и перемещения тела","Body turning",None),
 ("Happo-no-kuzushi","Выведение из равновесия в 8 направлениях","Off-balancing in 8 directions",None),
 ("Kuzushi, tsukuri, kake","Три фазы броска: выведение, вход, завершение","Three phases of a throw: off-balance, entry, execution","kuzushi-tsukuri-kake"),
 ("Nogare","Уходы с удержаний","Escapes",None),
]: add(n, ru, en, "basics", s=s)

# --- Детальный контент: первый пояс ---
DETAILS = {
 "o-soto-gari": (["Тяните уке на себя и в сторону, чтобы весь его вес встал на одну ногу (на пятку).",
   "Шагните опорной ногой рядом со стопой уке, грудь прижмите к его груди, корпус наклоните вперёд.",
   "Махом ноги назад отхватите нагруженную ногу под колено и, продолжая наклон, бросьте уке на спину."],
   "Атака с дистанции с отклонённым назад корпусом: уке сохраняет равновесие и легко контратакует."),
 "o-goshi": (["Тяните уке вперёд-вверх, поднимая его на носки.",
   "Разворачиваясь спиной, обхватите рукой поясницу уке и поставьте таз ниже его пояса, колени согнуты.",
   "Выпрямляя ноги, поднимите уке на бедро и проверните вперёд тягой за рукав."],
   "Вход на прямых ногах и с тазом сбоку: уке остаётся стоять, а не оказывается на бедре."),
 "o-uchi-gari": (["Толкайте уке назад и по диагонали, нагружая ногу, которую будете атаковать.",
   "Подшагните между его ног, грудь прижмите к груди, атакующую ногу заведите изнутри за голень.",
   "Круговым движением отведите ногу уке в сторону и продолжайте давление корпусом вперёд-вниз до падения."],
   "Зацеп одной ногой без давления корпусом: уке просто переставляет ногу."),
 "seoi-nage": (["Тяните уке вперёд-вверх за рукав и отворот, поднимая на носки.",
   "Развернитесь спиной на согнутых ногах, локоть руки на отвороте заведите под подмышку уке, спина плотно к его груди.",
   "Выпрямляя ноги и наклоняясь вперёд, прокатите уке через спину, продолжая тягу за рукав."],
   "Потеря тяги при повороте: между спиной и грудью уке остаётся зазор, и бросок превращается в силовое перетягивание."),
 "ushiro-ukemi": (["Из приседа или стойки прижмите подбородок к груди и округлите спину.",
   "Перекатитесь назад с таза на лопатки, не касаясь ковра головой.",
   "В момент касания спиной хлопните прямыми руками по татами под углом около 30–45° к корпусу."],
   "Запрокинутая голова и удар затылком; опора на локти вместо хлопка всей рукой."),
 "yoko-ukemi": (["Вынесите одну ногу вперёд-в сторону перед опорной и опускайтесь на согнутой опорной ноге.",
   "Перекатитесь на бок с бедра на спину, подбородок прижат, свободная рука на поясе.",
   "Одноимённой рукой хлопните по татами под углом 30–45° к корпусу, ноги слегка разведены."],
   "Падение на локоть или выставленную прямую руку; хлопок слишком далеко от корпуса."),
 "zenpo-kaiten-ukemi": (["Из стойки с шагом вперёд поставьте руки на ковёр, ведущая рука дугой, пальцы направлены к себе.",
   "Перекатитесь по линии кисть — предплечье — плечо — спина по диагонали — противоположное бедро.",
   "Завершите хлопком свободной руки и выходом в положение лёжа на боку или в стойку."],
   "Кувырок через голову по прямой вместо диагонали через плечо; рука подламывается в локте."),
 "mae-ukemi": (["Падая вперёд, держите корпус прямым, голову поверните в сторону.",
   "Выставьте перед лицом предплечья, ладони развёрнуты к ковру, локти слегка разведены.",
   "Приземлитесь одновременно на ладони и предплечья, опираясь на них и на носки; живот и колени ковра не касаются."],
   "Приземление на прямые руки или на колени и живот."),
 "rei": (["Ritsurei: пятки вместе, руки вдоль бёдер, наклон корпуса примерно на 30° с прямой спиной, пауза и возврат.",
   "Zarei: опуститесь сначала на левое колено, затем на правое, сядьте на пятки (сэйдза), спина прямая.",
   "Положите ладони на ковёр перед коленями, поклонитесь, не отрывая таз от пяток; вставайте с правой ноги."],
   "Поспешный поклон с опущенной головой и согнутой спиной; неверный порядок постановки ног в zarei."),
 "kumi-kata": (["Одной рукой возьмите рукав уке в районе локтя (хикитэ — тянущая рука).",
   "Другой рукой возьмите отворот на уровне ключицы (цуритэ — поднимающая рука).",
   "Держите захват пальцами без напряжения в плечах, локти опущены; уметь показать правый и левый захват."],
   "Напряжённые прямые руки: так невозможно ни вывести из равновесия, ни почувствовать движение партнёра."),
 "kuzushi": (["Определите направление, в котором у уке нет опоры (например, вперёд на носки или назад на пятки).",
   "Работайте всем телом — шагом и поворотом корпуса, а не только руками.",
   "Доведите уке до положения, когда его вес вышел за площадь опоры, и только тогда начинайте вход."],
   "Попытка бросить без выведения — одной силой рук по устойчиво стоящему партнёру."),
 "obi": (["Приложите середину пояса к животу, обведите концы вокруг талии, перекрестив на спине, и выведите вперёд.",
   "Один конец проведите снизу под оба витка и вытяните вверх.",
   "Завяжите плоский узел: верхний конец накладывается на нижний и продевается в петлю; концы равной длины смотрят в стороны."],
   "Перекрученные витки на спине и концы разной длины; узел, который развязывается при первом захвате."),
 "hon-kesa-gatame": (["Сядьте сбоку от уке, бедро плотно к его боку; его ближнюю руку зажмите под своей подмышкой.",
   "Второй рукой обхватите шею уке, грудью придавите его грудь.",
   "Ноги широко разведите: ближняя вперёд, дальняя назад; голову держите низко."],
   "Высоко поднятый корпус и узко поставленные ноги: уке легко перекатывает тори через себя."),
 "yoko-shiho-gatame": (["Лягте грудью поперёк груди уке под прямым углом к нему.",
   "Одну руку проведите под шеей к дальнему отвороту, вторую — между ног к поясу или штанам.",
   "Колени подтяните к боку уке или вытяните ноги и опустите таз, прижимая его весом к ковру."],
   "Высокий таз и вес на собственных коленях: уке возвращает колено и ставит ноги между собой и тори."),
 "kami-shiho-gatame": (["Расположитесь со стороны головы уке, грудью накройте его грудь.",
   "Обе руки проведите под плечами уке и возьмите пояс с двух сторон, локти прижмите к его бокам.",
   "Таз опустите, ноги разведите (или подтяните колени), голову поверните набок и прижмите к его животу."],
   "Слабый захват пояса и разведённые локти: уке проворачивается и выходит на живот."),
 "turnover-all-fours-to-kesa": (["Встаньте сбоку от уке, стоящего на четвереньках, проведите руки под его грудью к дальней руке.",
   "Захватите дальнюю руку у локтя и потяните под него, одновременно толкая грудью вперёд.",
   "Когда уке перекатится на спину, сразу сядьте бедром к его боку и возьмите hon-kesa-gatame."],
   "Пауза после переворота: уке успевает повернуться обратно на живот до фиксации удержания."),
 "turnover-facedown-to-kami-shiho": (["Со стороны головы уке, лежащего на животе, захватите его пояс и дальнюю руку или плечо.",
   "Поднимая и проворачивая плечо, переверните уке на спину, сами оставаясь со стороны головы.",
   "Не теряя контакта грудью, проведите руки под плечами к поясу и зафиксируйте kami-shiho-gatame."],
   "Переворот одной силой рук без подсада корпусом; потеря контакта в момент, когда уке оказывается на спине."),
}
for sl, (steps, mistake) in DETAILS.items():
    T[sl]["steps"] = {"ru": steps}
    T[sl]["commonMistake"] = {"ru": mistake}

# --- Программа по поясам (система CBJ, как в референсе) ---
B = [
 ("blue","Blue","Синий","8 kyu",["o-soto-gari","o-goshi","o-uchi-gari","seoi-nage","ushiro-ukemi","yoko-ukemi","zenpo-kaiten-ukemi","mae-ukemi","rei","kumi-kata","kuzushi","obi","combo:o-uchi-gari>o-soto-gari","hon-kesa-gatame","yoko-shiho-gatame","kami-shiho-gatame","turnover-all-fours-to-kesa","turnover-facedown-to-kami-shiho"]),
 ("yellow","Yellow","Жёлтый","6 kyu",["de-ashi-harai","hiza-guruma","sasae-tsurikomi-ashi","uki-goshi","shisei","shintai","fusegi-ne-waza","combo:de-ashi-harai>o-soto-gari","combo:hiza-guruma>o-soto-gari","combo:seoi-nage>o-uchi-gari","counter:o-soto-gari<o-soto-gaeshi","counter:hiza-guruma<o-uchi-gari","kata-gatame","kuzure-kesa-gatame","kuzure-kami-shiho-gatame","kuzure-yoko-shiho-gatame","arm-turnover","nogare-kesa-gatame"]),
 ("orange","Orange","Оранжевый","4 kyu",["ko-soto-gari","ko-uchi-gari","koshi-guruma","tsurikomi-goshi","okuri-ashi-harai","tai-otoshi","harai-goshi","uchi-mata","tai-sabaki","happo-no-kuzushi","kuzushi-tsukuri-kake","fusegi-tachi-waza","nogare","combo:o-uchi-gari>tai-otoshi","combo:sasae-tsurikomi-ashi>o-soto-gari","combo:ko-uchi-gari>seoi-nage","combo:uchi-mata>ko-uchi-gari","combo:harai-goshi>o-soto-gari","counter:de-ashi-harai<tsubame-gaeshi","counter:o-uchi-gari<o-uchi-gaeshi","counter:koshi-guruma<tani-otoshi","counter:tai-otoshi<harai-goshi","tate-shiho-gatame","makura-kesa-gatame","ushiro-kesa-gatame","belt-turnover","nogare-yoko-shiho-gatame"]),
 ("green","Green","Зелёный","3 kyu",["ko-soto-gake","tsuri-goshi","yoko-otoshi","ashi-guruma","hane-goshi","harai-tsurikomi-ashi","tomoe-nage","kata-guruma","combo:ko-uchi-gari>hane-goshi","combo:de-ashi-harai>tai-otoshi","combo:sasae-tsurikomi-ashi>o-uchi-gari>ko-uchi-gari","counter:uchi-mata<uchi-mata-sukashi","counter:harai-goshi<ushiro-goshi","counter:ko-soto-gake<tomoe-nage","counter:koshi-guruma<utsuri-goshi","kata:uki-otoshi","kata:seoi-nage","kata:kata-guruma","kuzure-tate-shiho-gatame","nogare-kami-shiho-gatame","nogare-tate-shiho-gatame","nogare-kata-gatame","guard-pass"]),
 ("purple","Purple","Фиолетовый","2 kyu",["sumi-gaeshi","tani-otoshi","hane-makikomi","sukui-nage","utsuri-goshi","o-guruma","soto-makikomi","uki-otoshi","combo:ippon-seoi-nage>ko-uchi-gari","combo:hiza-guruma>ko-soto-gake","combo:uchi-mata>o-uchi-gari","combo:o-soto-gari>o-soto-guruma","counter:tai-otoshi<o-soto-gari","counter:o-soto-gari<sukui-nage","counter:hane-goshi<tani-otoshi","counter:tomoe-nage<ko-soto-gari","kata:uki-goshi","kata:harai-goshi","kata:tsurikomi-goshi","hon-kesa-gatame","kuzure-kesa-gatame","makura-kesa-gatame","ushiro-kesa-gatame","kata-gatame","kami-shiho-gatame","kuzure-kami-shiho-gatame","yoko-shiho-gatame","kuzure-yoko-shiho-gatame","hadaka-jime","okuri-eri-jime","ude-hishigi-juji-gatame","ude-garami","guard-pass-to-hold","guard-pass-to-submission"]),
 ("brown","Brown","Коричневый","1 kyu",["o-soto-guruma","uki-waza","yoko-wakare","yoko-guruma","ushiro-goshi","ura-nage","sumi-otoshi","yoko-gake","combo:harai-goshi>harai-makikomi","combo:hane-goshi>o-uchi-gari","combo:de-ashi-harai>ko-uchi-gari>o-uchi-gari","combo:ushiro-goshi>utsuri-goshi","counter:tai-otoshi<yoko-guruma","counter:o-soto-gari<te-guruma|sukui-nage","counter:kata-guruma<tawara-gaeshi","counter:hane-goshi<utsuri-goshi","counter:ko-soto-gake<uchi-mata","kata:okuri-ashi-harai","kata:sasae-tsurikomi-ashi","kata:uchi-mata","kata-ha-jime","nami-juji-jime","gyaku-juji-jime","kata-juji-jime","sankaku-jime","tsukkomi-jime","ude-gatame","hiza-gatame","waki-gatame","hara-gatame","ashi-gatame","turnover-to-choke","turnover-to-armlock","guard-defense-finish"]),
]
EXPECT = {"blue":18,"yellow":18,"orange":27,"green":23,"purple":34,"brown":34}

def chk(s):
    assert s in T, "unknown slug: " + s
    return s

belts = []
for bid, en, ru, kyu, items in B:
    out = []
    for it in items:
        if it.startswith("combo:"):
            out.append({"type": "combination", "sequence": [chk(x) for x in it[6:].split(">")]})
        elif it.startswith("counter:"):
            a, c = it[8:].split("<")
            out.append({"type": "counter", "attack": chk(a), "counter": [chk(x) for x in c.split("|")]})
        elif it.startswith("kata:"):
            out.append({"type": "kata", "kata": "nage-no-kata", "technique": chk(it[5:])})
        else:
            out.append({"type": "technique", "technique": chk(it)})
    assert len(out) == EXPECT[bid], (bid, len(out))
    belts.append({"id": bid, "name": {"en": en, "ru": ru}, "grade": kyu, "items": out})

used = set()
for b in belts:
    for i in b["items"]:
        for k in ("technique", "attack"):
            if k in i: used.add(i[k])
        used.update(i.get("sequence", [])); used.update(i.get("counter", []))
unused = set(T) - used
assert not unused, unused

total = sum(len(b["items"]) for b in belts)
data = {
 "meta": {"version": "0.1", "beltSystem": "CBJ (как в референсе, заменяемый конфиг)",
          "totalBeltItems": total, "uniqueTechniques": len(T),
          "detailedTechniques": len(DETAILS),
          "note": "steps = [kuzushi, tsukuri, kake] для бросков; для остальных — три шага выполнения. Тексты собственные, требуют вычитки тренером."},
 "techniques": list(T.values()),
 "belts": belts,
}
import sys
json.dump(data, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(total, len(T), len(DETAILS), {b["id"]: len(b["items"]) for b in belts})
