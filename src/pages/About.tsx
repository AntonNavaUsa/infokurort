import { Link } from "react-router-dom";
import { ArrowRight, Ban, CalendarCheck, Info, Link2, Scale, Tag, UserCheck } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { PageHero } from "@/components/layout/PageHero";
import { photos } from "@/data/photos";
import { Button } from "@/components/ui/button";

const principles = [
  {
    icon: Scale,
    title: "Нейтрально ко всем курортам",
    description: "Роза Хутор, Красная Поляна и Газпром описаны в одном формате. Не составляем рейтинги «лучших» и не выделяем любимчиков.",
  },
  {
    icon: Link2,
    title: "Ссылки на первоисточники",
    description: "Цены, правила и списки школ сверяем с официальными сайтами курортов и реестрами и ставим ссылку рядом.",
  },
  {
    icon: CalendarCheck,
    title: "Дата обновления",
    description: "На страницах видно, когда справку обновляли и к какому сезону относятся цены в калькуляторах.",
  },
  {
    icon: Tag,
    title: "Открыто о партнёрах",
    description: "Если виджет или ссылка партнёрские, это подписано. Заявки на инструктора обрабатываем сами.",
  },
];

const steps = [
  { title: "Заявка", description: "Курорт, даты, кто учится и уровень — около двух минут" },
  { title: "Ответ", description: "Свяжемся по телефону или в Telegram, предложим время и назовём цену" },
  { title: "Занятие", description: "С аккредитованным инструктором, допущенным к работе на трассах" },
  { title: "Отзыв", description: "После занятия попросим оценку — она поможет следующим гостям" },
];

const notDoing = [
  "не называем себя официальным сайтом курортов и не используем их фирменный стиль",
  "не продаём ски-пассы — покупка на сайтах и в кассах курортов",
  "не рекомендуем инструкторов без допуска курорта",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <PageHero
          icon={Info}
          eyebrow="О справочной"
          image={photos.about}
          title="Справочная Красной Поляны"
          lead="Инфокурорт — независимый информационный сервис: три курорта в одном формате, факты и правила вместо рекламы. Справка бесплатна, а если нужна помощь с инструктором — подберём."
        />

        {/* Кто ведёт справочную */}
        <section className="container mx-auto px-4 py-14 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold text-warm">Кто ведёт справочную</p>
              <h2 className="mt-2 text-3xl font-bold">Справка о курортах и занятиях</h2>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <UserCheck className="h-5 w-5" />
                </span>
                <p className="leading-relaxed text-foreground/85">
                  Инфокурорт — независимый информационный сервис, не связанный с администрациями курортов. Мы собираем ссылки на первоисточники и помогаем разобраться в форматах занятий. Допуск, квалификацию и условия работы конкретного инструктора нужно проверять у школы или в соответствующем реестре.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Принципы */}
        <section className="border-y border-border bg-card py-14 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold">Как мы собираем информацию</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {principles.map((principle) => (
                <div key={principle.title} className="flex gap-4 rounded-xl border border-border bg-background p-5">
                  <principle.icon className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                  <div>
                    <h3 className="font-semibold">{principle.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Подбор */}
        <section className="container mx-auto px-4 py-14 md:py-16">
          <h2 className="text-3xl font-bold">Как работает подбор инструктора</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-border bg-card p-5">
                <span className="tabular flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Чего мы не делаем */}
        <section className="container mx-auto px-4 pb-14 md:pb-20">
          <div className="grid gap-6 rounded-xl bg-secondary/60 p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <h2 className="text-2xl font-bold">Чего мы не делаем</h2>
              <ul className="mt-4 space-y-2">
                {notDoing.map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-foreground/85">
                    <Ban className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button asChild variant="warm" size="lg" className="h-12 rounded-lg px-6 font-semibold">
              <Link to={LEAD_FORM_HREF}>
                Подобрать инструктора
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Фотографии на сайте — с{" "}
            <a href="https://commons.wikimedia.org/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
              Wikimedia Commons
            </a>
            , обрезаны и сжаты. Автор и лицензия указаны на каждом снимке.
          </p>
        </section>
      </main>
    </div>
  );
};

export default About;
