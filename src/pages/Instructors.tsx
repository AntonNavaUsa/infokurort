import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { PageHero } from "@/components/layout/PageHero";
import { photos } from "@/data/photos";
import { PriceCalculator } from "@/components/PriceCalculator";
import { ClientOnly, WidgetPlaceholder } from "@/components/ClientOnly";
import { InstructorLeadForm } from "@/components/InstructorLeadForm";
import { site } from "@/data/site";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Building2,
  Calculator,
  CheckCircle,
  ExternalLink,
  Gauge,
  Heart,
  Info,
  Shield,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const instructorTypes = [
  {
    icon: Building2,
    title: "Школы курортов",
    description: "Это официальные школы, работающие напрямую на территории курорта.",
    features: [
      { text: "инструкторы проходят отбор и обучение", positive: true },
      { text: "есть контроль качества и ответственность школы", positive: true },
      { text: "подходят для новичков, детей, семей", positive: true },
      { text: "стабильный и предсказуемый формат обучения", positive: true },
    ],
    note: "Если вы катаетесь впервые или хотите максимум спокойствия — это самый надёжный вариант.",
    color: "primary",
  },
  {
    icon: UserCheck,
    title: "Аккредитованные частные инструкторы",
    description: "Это независимые инструкторы, официально допущенные курортом к работе на трассах.",
    features: [
      { text: "прошли аккредитацию курорта", positive: true },
      { text: "имеют право легально проводить занятия", positive: true },
      { text: "чаще работают индивидуально", positive: true },
      { text: "гибкий подход и персональное внимание", positive: true },
    ],
    note: "Хороший вариант для тех, кто хочет индивидуальный формат, но без рисков.",
    color: "glacier",
  },
  {
    icon: AlertTriangle,
    title: "Неаккредитованные инструкторы",
    description: "Инструкторы без официального допуска курорта.",
    features: [
      { text: "не имеют права работать на трассах", positive: false },
      { text: "не несут формальной ответственности", positive: false },
      { text: "возможны штрафы, конфликты с курортом и отказ в катании", positive: false },
      { text: "клиент принимает риски на себя", positive: false },
    ],
    note: "Мы рекомендуем выбирать официальные школы или аккредитованных инструкторов.",
    color: "sunset",
    warning: true,
  },
];

const resorts = [
  {
    name: "Роза Хутор",
    sections: [
      {
        title: "Официальная школа курорта",
        items: [
          { name: "Собственная школа Роза Хутор", url: "https://rosakhutor.ru/ski-school/" },
        ],
      },
      {
        title: "Аккредитованные частные инструкторы",
        items: [
          { name: "Реестр аккредитованных инструкторов", url: "https://skiaccreditation.ru/" },
        ],
      },
    ],
  },
  {
    name: "Курорт Красная Поляна",
    sections: [
      {
        title: "Школы катания",
        items: [
          { name: "Школа «Три вершины»", url: "https://krasnayapolyanaresort.ru/kurort/uslugi/instructors/" },
          { name: "Quiksilver School", url: "https://quiksilver.school/kp" },
        ],
      },
      {
        title: "Аккредитованные частные инструкторы",
        items: [
          { name: "Реестр аккредитованных инструкторов", url: "https://skiaccreditation.ru/" },
        ],
      },
    ],
  },
  {
    name: "Газпром (Лаура / Альпика)",
    sections: [
      {
        title: "Школы катания",
        items: [
          { name: "Sammit School", url: "https://sammit.school/about" },
          { name: "Riders Project", url: "https://ridersproject.ru/" },
        ],
      },
      {
        title: "Аккредитованные частные инструкторы",
        items: [
          { name: "Аккредитованные инструкторы курорта Газпром", url: null },
        ],
      },
    ],
  },
];

const typeTone = {
  primary: { bar: "bg-primary", icon: "bg-primary text-primary-foreground", note: "text-primary" },
  glacier: { bar: "bg-glacier", icon: "bg-glacier text-white", note: "text-glacier" },
  sunset: { bar: "bg-sunset", icon: "bg-sunset text-white", note: "text-sunset" },
} as const;

const sectionLinks = [
  { href: "#formats", label: "Форматы занятий" },
  { href: "#progress", label: "Прогресс" },
  { href: "#calculator", label: "Цены" },
  { href: "#schools", label: "Школы и допуски" },
  { href: "#podbor", label: "Подбор инструктора" },
];

const lessonFormats = [
  {
    id: "individual",
    title: "Индивидуальное занятие",
    label: "Персональный темп",
    icon: Target,
    description:
      "Инструктор работает с одним учеником или небольшой компанией одного уровня: замечает ошибки и меняет упражнения по ходу занятия.",
    suitableFor: ["Первый опыт на склоне", "Возвращение после перерыва", "Работа над конкретной техникой"],
    process: ["Оценить опыт и самочувствие", "Выбрать задачу на занятие", "Практиковаться с обратной связью"],
    result: "После урока ученик понимает, что уже получается и над чем работать дальше. Конкретный результат зависит от исходного уровня, условий и регулярности занятий.",
  },
  {
    id: "group",
    title: "Групповое занятие",
    label: "Учиться вместе",
    icon: Users,
    description:
      "Группы могут формироваться по уровню и возрасту, но правила зависят от школы и программы. Это не означает, что формат бесполезен: участники учатся вместе, а занятие обычно стоит дешевле индивидуального.",
    suitableFor: ["Друзья или семья примерно одного уровня", "Уверенные новички при совпадении уровня", "Те, кому комфортна группа"],
    process: ["Уточнить уровень и возраст группы", "Сверить расписание и размер группы", "Выбрать программу и длительность"],
    result: "Размер и состав зависят от школы и конкретной программы. В прайсе Красной Поляны за сезон 2025/26 была взрослая группа на 3–6 человек; это пример, а не правило для всех курортов.",
  },
  {
    id: "children",
    title: "Занятие для ребёнка",
    label: "С учётом возраста",
    icon: Baby,
    description:
      "Детское обучение — это не просто сопровождение по склону: инструктор объясняет через короткие задания, учитывает внимание, усталость и реакцию ребёнка.",
    suitableFor: ["Первое знакомство со снегом и лыжами", "Обучение в подходящей возрастной группе", "Спокойное продолжение занятий после перерыва"],
    process: ["Познакомиться и договориться о понятной цели", "Начать с простых упражнений и удобного темпа", "Делать паузы и остановиться, если ребёнку некомфортно"],
    result: "В тарифах детских программ Розы Хутор сезона 2025/26 встречались группы 3–5, 4–5, 5–9 и 7–13 лет с длительностью от 45 минут до 3 часов. Возраст и длительность нужно подтвердить у выбранной школы на нужный сезон.",
  },
];

const learningMilestones = [
  {
    sessions: "1 занятие",
    title: "Познакомиться и освоить основы",
    description: "Привыкнуть к снаряжению и склону, разобрать базовую стойку, торможение и первые повороты — по уровню и условиям.",
  },
  {
    sessions: "Около 3 занятий",
    title: "Закрепить базовые навыки",
    description: "Повторить основные элементы и увереннее управлять скоростью на подходящем учебном склоне.",
  },
  {
    sessions: "5–7 занятий и дальше",
    title: "Развивать контроль и технику",
    description: "Ставить более точные задачи, исправлять привычные ошибки и постепенно пробовать подходящие новые условия.",
  },
];

const instructorBenefits = [
  "Раньше заметить и исправить технические ошибки",
  "Учиться в подходящем темпе, с обратной связью",
  "Осваивать правила поведения и выбор простого склона",
  "Планировать паузы и нагрузку, чтобы меньше уставать",
  "Подбирать упражнения под уровень и цель",
  "Понимать следующий шаг после занятия",
];

const Instructors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <PageHero
          icon={Users}
          eyebrow="Инструкторы и школы"
          image={photos.instructors}
          title="Инструкторы и школы катания в Красной Поляне"
          lead="В Красной Поляне работают десятки школ и инструкторов. Собрали школы курортов и объяснили, какие бывают инструкторы и чем они отличаются, чтобы выбрать безопасно и осознанно."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="warm" size="lg" className="h-12 rounded-lg px-6 font-semibold">
              <Link to={LEAD_FORM_HREF}>
                Подобрать инструктора
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-lg bg-card px-6 font-semibold">
              <a href="#calculator">
                <Calculator className="h-4 w-4" />
                Рассчитать стоимость
              </a>
            </Button>
          </div>
        </PageHero>

        {/* Коротко */}
        <section className="container mx-auto px-4 pt-10">
          <div className="max-w-3xl rounded-xl border-l-4 border-primary bg-card p-5 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Коротко</p>
            <p className="mt-2 leading-relaxed text-foreground/90">
              Самостоятельно осваивать склон можно дольше и сложнее: без обратной связи легко закрепить ошибки и выбрать неподходящую нагрузку. Инструктор помогает учиться последовательнее и безопаснее. На трассах занятия проводят школы курортов и инструкторы с нужным допуском.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: ShieldCheck, text: "Внимание к безопасности" },
                { icon: Gauge, text: "Понятная обратная связь" },
                { icon: Heart, text: "Темп под ученика" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground">
                  <Icon className="h-4 w-4" />
                  {text}
                </span>
              ))}
            </div>
          </div>
        </section>

        <nav aria-label="Разделы об инструкторах" className="sticky top-16 z-40 mt-8 border-y border-border bg-background/95 backdrop-blur">
          <div className="container mx-auto flex gap-2 overflow-x-auto px-4 py-3">
            {sectionLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Форматы обучения */}
        <section id="formats" className="scroll-mt-32 py-14 md:py-20">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold text-warm">Выберите подходящий формат</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Как проходят занятия</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Начните с уровня, цели и состава группы. Формат, доступность и условия уточняются у выбранной школы или инструктора.
            </p>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {lessonFormats.map((format) => (
                <article id={format.id} key={format.id} className="scroll-mt-36 rounded-xl border border-border bg-card p-5 shadow-soft md:p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <format.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{format.label}</p>
                      <h3 className="mt-0.5 text-lg font-bold">{format.title}</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground/80">{format.description}</p>
                  <h4 className="mt-5 text-sm font-semibold">Кому подходит</h4>
                  <ul className="mt-2 space-y-2">
                    {format.suitableFor.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <h4 className="mt-5 text-sm font-semibold">Как строится занятие</h4>
                  <ol className="mt-2 space-y-2">
                    {format.process.map((item, index) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{format.result}</p>
                  {format.id === "children" && (
                    <p className="mt-3 rounded-lg bg-secondary/70 p-3 text-sm leading-relaxed text-secondary-foreground">
                      Если ребёнок боится, не нужно заставлять продолжать: сообщите об этом инструктору, попросите начать с привыкания к снаряжению и простых упражнений. Родителю заранее стоит уточнить, как школа организует знакомство, связь и паузы.
                    </p>
                  )}
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-border bg-background p-5">
              <h3 className="font-semibold">Индивидуально или в группе?</h3>
              <div className="mt-3 grid gap-4 text-sm leading-relaxed text-muted-foreground sm:grid-cols-2">
                <p><span className="font-semibold text-foreground">Индивидуально:</span> больше внимания одному ученику, проще менять план по ходу занятия; обычно дороже.</p>
                <p><span className="font-semibold text-foreground">В группе:</span> общий темп и общение с другими участниками; обычно доступнее, если программа и уровень подходят.</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Не объединяйте в одну группу людей с сильно разным опытом без согласования: уточните у школы критерии уровня, предельный размер группы, возраст и возможность перейти в другой формат.
              </p>
            </div>
          </div>
        </section>

        {/* Прогресс */}
        <section id="progress" className="scroll-mt-32 border-y border-border bg-card py-14 md:py-20">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold text-warm">Без обещаний за один час</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Сколько занятий может понадобиться</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
              Это ориентир для планирования, а не гарантия результата: скорость обучения зависит от опыта, физической формы, условий на склоне и регулярности практики.
            </p>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {learningMilestones.map((milestone, index) => (
                <li key={milestone.sessions} className="relative rounded-xl border border-border bg-background p-5 md:p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                  <p className="mt-4 text-sm font-semibold text-primary">{milestone.sessions}</p>
                  <h3 className="mt-1 text-lg font-bold">{milestone.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{milestone.description}</p>
                </li>
              ))}
            </ol>
            <p className="mt-5 text-sm text-muted-foreground">
              Цель занятий — не «стать профи за час», а освоить навыки в безопасном темпе и понимать, что тренировать дальше.
            </p>
          </div>
        </section>

        {/* Калькулятор */}
        <section id="calculator" className="scroll-mt-32 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-start">
              <ClientOnly fallback={<WidgetPlaceholder title="Калькулятор стоимости" />}>
                <PriceCalculator />
              </ClientOnly>
              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="rounded-xl border border-signal/40 bg-signal/10 p-5">
                  <p className="flex items-center gap-2 font-semibold text-foreground">
                    <Info className="h-4 w-4 text-sunset" />
                    Важно знать
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    В калькуляторе — тарифы школ за сезон {site.pricesSeason}; цены на сезон {site.season} могут отличаться и будут обновлены после публикации прайсов. Стоимость зависит от курорта, длительности, формата, спроса и условий программы.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    Опыт инструктора, его специализация и допуск курорта также влияют на выбор и стоимость. Проверяйте квалификацию и условия ответственности непосредственно у школы или инструктора.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    В высокий сезон цены и доступность могут меняться. Итоговую стоимость подтвердит организатор до бронирования.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="font-semibold">Не хочется считать?</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Оставьте заявку — назовём цену и предложим время под ваши даты.
                  </p>
                  <Button asChild variant="warm" className="mt-4 w-full rounded-lg font-semibold">
                    <Link to={LEAD_FORM_HREF}>Подобрать инструктора</Link>
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Польза занятий */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold text-warm">Практическая польза</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Что даёт занятие с инструктором</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <ul className="grid gap-3 sm:grid-cols-2">
                {instructorBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-pine" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl border border-border bg-card p-5 md:p-6">
                <h3 className="text-lg font-bold">Самостоятельно и с обратной связью</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="font-semibold">Самостоятельно</p>
                    <p className="mt-2 leading-relaxed text-muted-foreground">Сложнее заметить ошибки и оценить, подходит ли склон вашему уровню.</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-4">
                    <p className="font-semibold">С инструктором</p>
                    <p className="mt-2 leading-relaxed text-muted-foreground">Есть наблюдение, понятные упражнения и рекомендации для следующего шага.</p>
                  </div>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                  Инструктор снижает неопределённость и помогает учиться, но не может исключить все риски катания.
                </p>
              </div>
            </div>
            <div className="mt-7">
              <Button asChild variant="warm" className="rounded-lg font-semibold">
                <Link to={LEAD_FORM_HREF}>
                  Подобрать формат под мой уровень
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Типы инструкторов */}
        <section className="border-y border-border bg-card py-14 md:py-20">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold text-warm">Перед выбором</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Какие бывают инструкторы</h2>
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {instructorTypes.map((type) => {
                const tone = typeTone[type.color as keyof typeof typeTone];
                return (
                  <article key={type.title} className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-background p-6">
                    <span className={`absolute inset-x-0 top-0 h-1 ${tone.bar}`} />
                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone.icon}`}>
                      <type.icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold">{type.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{type.description}</p>
                    <ul className="mt-4 flex-1 space-y-2">
                      {type.features.map((feature) => (
                        <li key={feature.text} className="flex items-start gap-2 text-sm">
                          {feature.positive ? (
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-pine" />
                          ) : (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-sunset" />
                          )}
                          <span className="text-foreground/85">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-5 border-t border-border pt-4 text-sm font-medium ${tone.note}`}>{type.note}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Посредники */}
        <section className="py-14 md:py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-xl border border-signal/40 bg-signal/10 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-signal text-mountain-dark">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold">Важно знать: посредники</h2>
                  <p className="mt-3 text-foreground/80">
                    В Красной Поляне также работают посредники, которые называют себя школами катания, но по факту таковыми не являются. Как правило:
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {[
                      "у них нет собственной школы на курорте",
                      "они не несут ответственность как официальная школа",
                      "занятия проводят на базе привлечённых инструкторов или договорённостей",
                    ].map((text) => (
                      <li key={text} className="flex items-start gap-2 text-sm text-foreground/80">
                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-sunset" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 rounded-lg bg-card/80 p-4 text-sm text-foreground/80">
                    <p><span className="font-semibold text-foreground">Исключение</span> — некоторые школы из других регионов, которые:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>проводят короткие групповые выездные программы</li>
                      <li>заранее согласовывают формат работы с курортами</li>
                      <li>действуют в ограниченные даты и по конкретной программе</li>
                    </ul>
                  </div>

                  <p className="mt-5 text-sm font-semibold">Заранее уточняйте:</p>
                  <ul className="mt-2 grid gap-1.5 sm:grid-cols-3">
                    {["статус школы", "наличие допуска курорта", "формат ответственности за обучение"].map((text) => (
                      <li key={text} className="flex items-center gap-2 text-sm text-foreground/80">
                        <CheckCircle className="h-4 w-4 shrink-0 text-pine" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Школы по курортам */}
        <section id="schools" className="scroll-mt-32 pb-14 md:pb-20">
          <div className="container mx-auto px-4">
            <p className="text-sm font-semibold text-warm">Первоисточники</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Школы и инструкторы по курортам</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resorts.map((resort) => (
                <div key={resort.name} className="rounded-xl border border-border bg-card p-5 md:p-6">
                  <h3 className="border-b border-border pb-3 text-lg font-bold">{resort.name}</h3>
                  <div className="mt-4 space-y-5">
                    {resort.sections.map((section) => (
                      <div key={section.title}>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{section.title}</h4>
                        <ul className="mt-2 space-y-1.5">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              {item.url ? (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline hover:underline-offset-4"
                                >
                                  {item.name}
                                  <ExternalLink className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                                </a>
                              ) : (
                                <span className="text-sm text-muted-foreground">{item.name} — ссылка уточняется</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Заявка */}
        <section id="podbor" className="scroll-mt-32 bg-[image:var(--gradient-frost)] py-14 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-sm font-semibold text-warm">Нужна помощь? Подберём</p>
                <h2 className="mt-2 text-3xl font-bold md:text-4xl">Найдём инструктора под ваш уровень и даты</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  Не нужно листать десятки сайтов: отправьте короткую заявку — определим формат и назовём цену. Новичок, ребёнок, семья или индивидуальная программа.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Подберём вариант по уровню, возрасту и цели поездки",
                    "Объясним разницу между школой курорта и аккредитованным инструктором",
                    "Только допущенные к работе на трассах инструкторы",
                  ].map((text) => (
                    <li key={text} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-pine" />
                      <span className="text-foreground/85">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <InstructorLeadForm />
            </div>
          </div>
        </section>

        {/* Дисклеймер */}
        <section className="py-8">
          <div className="container mx-auto flex max-w-3xl items-start gap-3 px-4">
            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Информация носит справочный характер. Рекомендуем пользоваться услугами официальных школ и аккредитованных инструкторов курортов.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Instructors;
