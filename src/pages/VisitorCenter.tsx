import { useMemo, useState } from "react";
import {
  ArrowRight,
  BedDouble,
  BookOpen,
  Bus,
  Compass,
  Map,
  Mountain,
  Search,
  ShieldCheck,
  Snowflake,
  Ticket,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Инструкторы и школы",
    description: "Разберитесь в форматах обучения и рассчитайте стоимость занятия.",
    href: "/instruktory",
    keywords: "инструктор школа лыжи сноуборд ребёнок цена",
    icon: ShieldCheck,
    label: "Подобрать инструктора",
    tone: "bg-sky-100 text-sky-800",
  },
  {
    title: "Ски-пассы",
    description: "Информация о подъёмниках и калькулятор стоимости абонементов.",
    href: "/ski-passes",
    keywords: "скипасс ски-пасс подъёмник билет цена абонемент",
    icon: Ticket,
    label: "Посмотреть ски-пассы",
    tone: "bg-amber-100 text-amber-800",
  },
  {
    title: "Где остановиться",
    description: "Варианты размещения рядом с горнолыжными курортами.",
    href: "/hotels",
    keywords: "отель гостиница жильё проживание размещение",
    icon: BedDouble,
    label: "Найти жильё",
    tone: "bg-rose-100 text-rose-800",
  },
  {
    title: "Фрирайд",
    description: "Форматы катания вне трасс и важная информация о безопасности.",
    href: "/freeride",
    keywords: "фрирайд гид безопасность лавина внетрассовое катание",
    icon: Mountain,
    label: "Узнать о фрирайде",
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    title: "Карта размещения",
    description: "Посмотрите расположение объектов и выберите удобный район.",
    href: "/map",
    keywords: "карта отель расположение где находится",
    icon: Map,
    label: "Открыть карту",
    tone: "bg-violet-100 text-violet-800",
  },
  {
    title: "О справочной",
    description: "Как устроен проект и на каких принципах мы собираем информацию.",
    href: "/about",
    keywords: "информация о проекте контакты помощь",
    icon: BookOpen,
    label: "О проекте",
    tone: "bg-orange-100 text-orange-800",
  },
];

const resorts = [
  { name: "Роза Хутор", note: "Школы, инструкторы и информация для поездки" },
  { name: "Красная Поляна", note: "Курорт, услуги и полезные ссылки" },
  { name: "Газпром Поляна", note: "Лаура и Альпика — в одном разделе" },
];

const VisitorCenter = () => {
  const [query, setQuery] = useState("");
  const matchingSections = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return sections;

    return sections.filter((section) =>
      `${section.title} ${section.description} ${section.keywords}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f7f8f5] text-slate-800">
      <Header />
      <FloatingChatButton />

      <main className="pt-16 md:pt-20">
        <section className="relative overflow-hidden border-b border-sky-100 bg-gradient-to-br from-[#eaf6fb] via-[#f5f9f5] to-[#fff4e5]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-sky-200/50 blur-3xl" />

          <div className="relative container mx-auto grid gap-10 px-4 py-12 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-medium text-sky-900 shadow-sm">
                <Compass className="h-4 w-4 text-sky-700" />
                Визит-центр Красной Поляны
              </div>

              <h1 className="font-sans text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl xl:text-6xl">
                Добро пожаловать в горы
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Поможем сориентироваться в курортах, катании и поездке. Выберите, что нужно узнать, — и начните планировать отдых спокойно.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/instruktory#calculator">
                  <Button size="lg" className="w-full rounded-full bg-sky-700 px-6 text-base font-semibold text-white shadow-md shadow-sky-900/10 hover:bg-sky-800 sm:w-auto">
                    Подобрать инструктора
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#sections">
                  <Button variant="outline" size="lg" className="w-full rounded-full border-slate-300 bg-white/75 px-6 text-base text-slate-700 hover:bg-white sm:w-auto">
                    Найти информацию
                  </Button>
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2"><Snowflake className="h-4 w-4 text-sky-700" />Три курорта</span>
                <span className="inline-flex items-center gap-2"><Users className="h-4 w-4 text-sky-700" />Школы и инструкторы</span>
                <span className="inline-flex items-center gap-2"><Bus className="h-4 w-4 text-sky-700" />Полезное для поездки</span>
              </div>
            </div>

            <aside className="rounded-[28px] border border-white bg-white/90 p-5 shadow-[0_20px_60px_rgba(38,73,91,0.10)] md:p-7">
              <div className="mb-5">
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sky-700">С чего начать?</p>
                <h2 className="mt-2 font-sans text-2xl font-bold text-slate-900 md:text-3xl">Подскажем нужный раздел</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Выберите тему — собрали основное в одном месте.
                </p>
              </div>
              <div className="space-y-3">
                <Link to="/instruktory" className="group flex items-center gap-4 rounded-2xl bg-sky-50 p-4 transition-colors hover:bg-sky-100">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm"><ShieldCheck className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">Хочу научиться кататься</span>
                    <span className="mt-1 block text-sm text-slate-600">Инструкторы, школы и калькулятор</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-sky-700 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/ski-passes" className="group flex items-center gap-4 rounded-2xl bg-amber-50 p-4 transition-colors hover:bg-amber-100">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700 shadow-sm"><Ticket className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">Планирую кататься</span>
                    <span className="mt-1 block text-sm text-slate-600">Ски-пассы и горнолыжные курорты</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-amber-700 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link to="/hotels" className="group flex items-center gap-4 rounded-2xl bg-emerald-50 p-4 transition-colors hover:bg-emerald-100">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm"><BedDouble className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">Ищу, где остановиться</span>
                    <span className="mt-1 block text-sm text-slate-600">Размещение и карта района</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-emerald-700 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
                Независимая справочная. Актуальность условий и услуг лучше дополнительно проверять на сайтах курортов.
              </p>
            </aside>
          </div>
        </section>

        <section id="sections" className="scroll-mt-24 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-sky-700">Полезная информация</p>
                <h2 className="font-sans text-3xl font-bold text-slate-900 md:text-4xl">Чем можем помочь?</h2>
                <p className="mt-2 max-w-xl text-slate-600">Выберите тему или найдите нужное слово в поиске.</p>
              </div>
              <label className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                <Search className="h-4 w-4 text-sky-700" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Например: ски-пасс или отель"
                  className="w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            {matchingSections.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {matchingSections.map((section) => (
                  <Link
                    key={section.href}
                    to={section.href}
                    className="group flex min-h-[225px] flex-col rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${section.tone}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-sans text-xl font-bold text-slate-900">{section.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{section.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-800">
                      {section.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-3 font-semibold text-slate-800">По этому запросу разделов не нашлось</p>
                <p className="mt-1 text-sm text-slate-600">Попробуйте другое слово или задайте вопрос в чате.</p>
              </div>
            )}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-[#eef4f3] py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-sky-700">Три курорта — одна долина</p>
                <h2 className="font-sans text-3xl font-bold text-slate-900 md:text-4xl">Выберите, куда направиться</h2>
              </div>
              <Link to="/instruktory#schools" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-800 hover:text-sky-950">
                Школы и инструкторы <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {resorts.map((resort) => (
                <Link
                  key={resort.name}
                  to="/instruktory#schools"
                  className="group flex items-start gap-4 rounded-2xl border border-white bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-800">
                    <Mountain className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-sans text-xl font-bold text-slate-900">{resort.name}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{resort.note}</span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-800">
                      Подробнее <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="rounded-[28px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-sky-50 p-6 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-semibold text-amber-800">Мы рядом, если нужна подсказка</p>
                <h2 className="font-sans text-3xl font-bold text-slate-900 md:text-4xl">Не знаете, с чего начать?</h2>
                <p className="mt-3 leading-relaxed text-slate-600">
                  Расскажите, что планируете, — поможем сориентироваться и выбрать подходящий раздел.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/instruktory#calculator">
                  <Button size="lg" className="w-full rounded-full bg-sky-700 px-6 text-white hover:bg-sky-800 sm:w-auto">
                    Рассчитать занятие
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="w-full rounded-full border-slate-300 bg-white px-6 text-slate-700 hover:bg-slate-50 sm:w-auto">
                    О справочной
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisitorCenter;
