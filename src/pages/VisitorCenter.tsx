import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Calculator,
  CalendarCheck,
  Link2,
  Map,
  MessageCircleQuestion,
  Mountain,
  Scale,
  Search,
  ShieldCheck,
  Tag,
  Ticket,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { InstructorLeadForm } from "@/components/InstructorLeadForm";
import { Photo, PhotoCredit } from "@/components/Photo";
import { photos } from "@/data/photos";
import { formatRuDate, site } from "@/data/site";

const quickAnswers = [
  {
    question: "Как выбрать инструктора?",
    answer: "Школа курорта, аккредитованный частный инструктор или без допуска — разница в праве работать на трассах и в ответственности.",
    href: "/instruktory/",
    keywords: "инструктор школа выбрать какой частный",
  },
  {
    question: "Сколько стоит занятие с инструктором?",
    answer: `Калькулятор считает по курорту, дате и формату. Сейчас в нём цены сезона ${site.pricesSeason}.`,
    href: "/instruktory/#calculator",
    keywords: "цена стоимость сколько стоит инструктор занятие урок калькулятор",
  },
  {
    question: "Инструктор для ребёнка",
    answer: "Подберём занятие под возраст и уровень — оставьте короткую заявку.",
    href: LEAD_FORM_HREF,
    keywords: "ребёнок ребенок дети детский сын дочь семья",
  },
  {
    question: "Как проверить аккредитацию инструктора?",
    answer: "По реестру аккредитованных инструкторов — ссылки собраны в разделе по курортам.",
    href: "/instruktory/#schools",
    keywords: "аккредитация аккредитованный проверить реестр допуск",
  },
  {
    question: "Сколько стоит ски-пасс?",
    answer: "Калькулятор абонементов для Роза Хутор и Газпром: один день, несколько дней, сезон.",
    href: "/ski-passes/",
    keywords: "ски-пасс скипасс ски пасс подъёмник подъемник абонемент билет цена",
  },
  {
    question: "Можно ли кататься вне трасс?",
    answer: "Только с сертифицированным гидом и лавинным снаряжением. Разобрали правила и риски.",
    href: "/freeride/",
    keywords: "фрирайд вне трасс целина гид лавина бэккантри",
  },
  {
    question: "Где остановиться в Красной Поляне?",
    answer: "Отели и апартаменты рядом со склонами — поиск через партнёрский виджет Яндекс Путешествий.",
    href: "/hotels/",
    keywords: "жильё жилье отель гостиница апартаменты где жить остановиться",
  },
  {
    question: "Жильё на карте",
    answer: "Посмотрите, что находится рядом с подъёмниками и в каком районе.",
    href: "/map/",
    keywords: "карта район рядом расположение где находится",
  },
  {
    question: "Кто ведёт справочную?",
    answer: "Аккредитованный инструктор и сертифицированный гид. Рассказываем, как собираем информацию.",
    href: "/about/",
    keywords: "кто вы о проекте справочная контакты доверие",
  },
];

const suggestions = ["инструктор для ребёнка", "ски-пасс", "аккредитация", "вне трасс", "где жить"];

const desks = [
  { title: "Инструкторы и школы", text: "Кто имеет право учить на трассах и как выбрать", href: "/instruktory/", icon: Users },
  { title: "Калькулятор занятий", text: "Стоимость урока по курорту, дате и формату", href: "/instruktory/#calculator", icon: Calculator },
  { title: "Ски-пассы", text: "Абонементы на подъёмники и их стоимость", href: "/ski-passes/", icon: Ticket },
  { title: "Фрирайд", text: "Катание вне трасс: гиды и безопасность", href: "/freeride/", icon: Mountain },
  { title: "Где жить", text: "Отели и апартаменты рядом со склонами", href: "/hotels/", icon: BedDouble },
  { title: "Карта жилья", text: "Районы и расстояние до подъёмников", href: "/map/", icon: Map },
];

const resorts = [
  {
    name: "Роза Хутор",
    photo: photos.rozaKhutor,
    note: "Школа курорта, детский клуб, аккредитованные частные инструкторы.",
    links: [
      { label: "Школы и инструкторы", href: "/instruktory/#schools" },
      { label: "Ски-пасс", href: "/ski-passes/" },
    ],
  },
  {
    name: "Красная Поляна",
    photo: photos.krasnayaPolyana,
    note: "Школы «Три вершины» и Quiksilver, аккредитованные частные инструкторы.",
    links: [
      { label: "Школы и инструкторы", href: "/instruktory/#schools" },
      { label: "Калькулятор занятий", href: "/instruktory/#calculator" },
    ],
  },
  {
    name: "Газпром",
    photo: photos.gazprom,
    note: "Лаура и Альпика: школы Sammit и Riders Project, частные инструкторы.",
    links: [
      { label: "Школы и инструкторы", href: "/instruktory/#schools" },
      { label: "Ски-пасс", href: "/ski-passes/" },
    ],
  },
];

const principles = [
  { icon: Scale, title: "Нейтрально", text: "Три курорта в одном формате, без любимчиков и рейтингов «лучших»." },
  { icon: Link2, title: "Со ссылками", text: "Официальные сайты курортов и реестры — рядом с каждым фактом." },
  { icon: CalendarCheck, title: "С датой", text: "На страницах видно, когда справку обновляли и к какому сезону относятся цены." },
  { icon: Tag, title: "Открыто", text: "Партнёрские виджеты подписаны. Заявки на инструктора обрабатываем сами." },
];

const VisitorCenter = () => {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase().replace(/ё/g, "е");
    if (!normalized) return [];
    const words = normalized.split(/\s+/).filter((word) => word.length > 1);
    return quickAnswers
      .map((item) => {
        const haystack = `${item.question} ${item.answer} ${item.keywords}`.toLocaleLowerCase().replace(/ё/g, "е");
        const score = words.filter((word) => haystack.includes(word.slice(0, Math.max(4, word.length - 2)))).length;
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item }) => item);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Первый экран: ночные горы и стойка справочной */}
        <section className="relative overflow-hidden bg-mountain-dark text-white">
          <img
            src={photos.hero.src}
            srcSet={photos.hero.srcSet}
            sizes="100vw"
            width={photos.hero.width}
            height={photos.hero.height}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
          />
          {/* Затемнение: текст слева читается, горы справа видны */}
          <div className="absolute inset-0 bg-gradient-to-b from-mountain-dark/90 via-mountain-dark/80 to-mountain-dark/60 lg:bg-gradient-to-r lg:from-mountain-dark lg:via-mountain-dark/85 lg:to-mountain-dark/25" />
          <div className="bg-contours absolute inset-0 opacity-60" />

          <div className="container relative mx-auto grid gap-10 px-4 pb-24 pt-12 md:pb-36 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Готовим справку к сезону {site.season}
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
                Справочная Красной&nbsp;Поляны
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/75">
                Роза Хутор, Красная Поляна и Газпром — в одном формате. Инструкторы, ски-пассы, жильё и правила: коротко, по делу, со ссылками на первоисточники.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to={LEAD_FORM_HREF}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-semibold text-mountain-dark transition-colors hover:bg-white/90"
                >
                  Подобрать инструктора
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/instruktory/#calculator"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/25 px-6 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Calculator className="h-4 w-4" />
                  Рассчитать занятие
                </Link>
              </div>
            </div>

            {/* Стойка: поиск по вопросам */}
            <div className="rounded-2xl bg-card p-5 text-foreground shadow-elevated md:p-6 lg:self-start">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <MessageCircleQuestion className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold leading-tight">Спросите справочную</p>
                  <p className="text-xs text-muted-foreground">Короткий ответ и ссылка на нужный раздел</p>
                </div>
              </div>

              <label className="mt-5 flex h-12 items-center gap-3 rounded-lg border border-input bg-background px-4 focus-within:border-primary focus-within:shadow-glow">
                <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                <span className="sr-only">Вопрос</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Например: ски-пасс или инструктор"
                  className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/80"
                />
              </label>

              {query.trim() === "" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuery(suggestion)}
                      className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              ) : matches.length > 0 ? (
                <ul className="mt-3 divide-y divide-border">
                  {matches.map((item) => (
                    <li key={item.question}>
                      <Link to={item.href} className="group flex items-start gap-3 py-3">
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-foreground group-hover:text-primary">{item.question}</span>
                          <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{item.answer}</span>
                        </span>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-4 rounded-lg bg-muted/60 p-4 text-sm">
                  <p className="font-medium">Готового ответа пока нет.</p>
                  <p className="mt-1 text-muted-foreground">
                    Напишите вопрос в заявке —{" "}
                    <Link to={LEAD_FORM_HREF} className="font-medium text-primary underline-offset-4 hover:underline">ответим лично</Link>.
                  </p>
                </div>
              )}

              <p className="mt-5 flex items-center gap-1.5 border-t border-border pt-4 text-xs text-muted-foreground">
                <CalendarCheck className="h-3.5 w-3.5" />
                Справка обновлена {formatRuDate(site.contentUpdated)}
              </p>
            </div>
          </div>

          <svg viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-x-0 bottom-0 h-6 w-full md:h-10">
            <path d="M0 40 C240 16 420 30 720 20 C1020 10 1200 28 1440 14 V40 H0Z" className="fill-background" />
          </svg>
          <PhotoCredit photo={photos.hero} className="absolute bottom-8 right-3 md:bottom-12 md:right-4" />
        </section>

        {/* Разделы как указатели визит-центра */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-primary">Разделы справочной</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Куда пройти</h2>
            </div>
            <p className="max-w-md text-muted-foreground">Каждый раздел начинается с короткого ответа, дальше — подробности и ссылки на первоисточники.</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {desks.map((desk) => (
              <Link
                key={desk.href}
                to={desk.href}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft md:p-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <desk.icon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">{desk.title}</span>
                  <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">{desk.text}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>

        {/* Курорты в одинаковом формате */}
        <section className="border-y border-border bg-card">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <p className="text-sm font-semibold text-primary">Три курорта — одна долина</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Курорты</h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {resorts.map((resort) => (
                <article key={resort.name} className="flex flex-col overflow-hidden rounded-xl border border-border bg-background">
                  <Photo photo={resort.photo} sizes="(min-width: 768px) 33vw, 100vw" className="aspect-[16/10]" />
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-xl font-bold">{resort.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{resort.note}</p>
                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
                      {resort.links.map((link) => (
                        <Link key={link.label} to={link.href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
                          {link.label}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Инструктор за 2 минуты */}
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-semibold text-primary">Нужна помощь? Подберём</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">Инструктор за&nbsp;2&nbsp;минуты</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                Ответьте на несколько вопросов — свяжемся, предложим время и назовём цену занятия.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  { icon: UserCheck, text: "Справочную ведёт аккредитованный инструктор и сертифицированный гид" },
                  { icon: ShieldCheck, text: "Только допущенные к работе на трассах инструкторы и школы" },
                  { icon: Users, text: "Если даты заняты — посоветуем аккредитованного коллегу" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed text-foreground/85">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <InstructorLeadForm />
          </div>
        </section>

        {/* Почему справочной можно доверять */}
        <section className="bg-secondary/60">
          <div className="container mx-auto px-4 py-14 md:py-16">
            <h2 className="text-2xl font-bold md:text-3xl">Как устроена справочная</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((principle) => (
                <div key={principle.title}>
                  <principle.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-semibold">{principle.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
                </div>
              ))}
            </div>
            <Link to="/about/" className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
              О справочной и о том, кто её ведёт
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisitorCenter;
