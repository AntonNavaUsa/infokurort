import { ArrowRight, Baby, Building2, Mountain, Target, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { InstructorLeadForm } from "@/components/InstructorLeadForm";
import { PageHero } from "@/components/layout/PageHero";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

type InstructorTopic = {
  title: string;
  lead: string;
  icon: typeof Users;
  highlights: string[];
  questions: Array<{ question: string; answer: string }>;
  source?: { label: string; href: string };
};

const topics: Record<string, InstructorTopic> = {
  "/instruktory/roza-hutor/": {
    title: "Инструктор на Розе Хутор",
    lead: "Перед записью уточните, где встречается инструктор, какой формат занятия доступен в ваши даты и есть ли у специалиста допуск курорта.",
    icon: Mountain,
    highlights: ["Сверьте расписание и доступность на конкретные даты", "Уточните, включён ли ски-пасс в стоимость занятия", "Проверьте формат ответственности и правила переноса"],
    questions: [{ question: "Где посмотреть школы курорта?", answer: "На официальном сайте курорта и в справочном разделе инструкторов собраны ссылки на школы и реестр аккредитации." }, { question: "Сколько стоит занятие?", answer: `Калькулятор показывает опубликованные тарифы сезона ${site.pricesSeason}. Итоговую стоимость на нужную дату подтвердит школа или инструктор.` }],
    source: { label: "Официальная школа Роза Хутор", href: "https://rosakhutor.ru/ski-school/" },
  },
  "/instruktory/krasnaya-polyana/": {
    title: "Инструктор на курорте Красная Поляна",
    lead: "Сравните школьные программы и частный формат, а условия допуска, расписание и стоимость проверьте у организатора до бронирования.",
    icon: Mountain,
    highlights: ["Спросите размер группы и требования к уровню", "Уточните продолжительность и место встречи", "Сравните занятие и пакет, если он есть в актуальном прайсе"],
    questions: [{ question: "Можно ли записаться в группу?", answer: "Наличие мест и критерии формирования групп зависят от конкретной программы и даты. Уточните это у школы." }, { question: "Сколько стоят занятия?", answer: `Калькулятор на сайте использует прайсы сезона ${site.pricesSeason}; он не заменяет подтверждение цены организатором.` }],
    source: { label: "Школы курорта Красная Поляна", href: "https://krasnayapolyanaresort.ru/kurort/uslugi/instructors/" },
  },
  "/instruktory/gazprom/": {
    title: "Инструктор на Газпром Поляне",
    lead: "На курорте есть разные зоны и форматы катания. До оплаты уточните, где пройдёт занятие и подходит ли программа вашему уровню.",
    icon: Mountain,
    highlights: ["Сверьте зону катания и место встречи", "Проверьте актуальную стоимость на нужную дату", "Уточните правила допуска частного инструктора"],
    questions: [{ question: "Как выбрать зону занятия?", answer: "Опишите свой уровень и цель школе или инструктору — они подтвердят доступные зоны и подходящий формат." }, { question: "Где посмотреть расписание и тариф?", answer: "Актуальные расписание, доступность и условия проверяйте на сайте курорта или выбранной школы." }],
    source: { label: "Официальный сайт Газпром Поляна", href: "https://lk-gazprom.ru" },
  },
  "/instruktory/individualnye-zanyatiya/": {
    title: "Индивидуальные занятия с инструктором",
    lead: "Персональный формат подходит, когда важно заниматься в своём темпе, получить обратную связь и выбрать конкретную цель вместе с инструктором.",
    icon: Target,
    highlights: ["Для первого знакомства со склоном", "Для возвращения после перерыва", "Для работы над техникой и конкретными задачами"],
    questions: [{ question: "Сколько человек можно взять на занятие?", answer: "Условия по числу участников устанавливает школа или инструктор. Уточните, комфортно ли участникам заниматься вместе с учётом различий в уровне." }, { question: "Нужен ли пакет занятий?", answer: "Нет универсального числа уроков. Начните с цели и одного занятия, затем обсудите прогресс и следующий шаг." }],
  },
  "/instruktory/gruppovye-zanyatiya/": {
    title: "Групповые занятия на лыжах и сноуборде",
    lead: "Группа может быть полезным форматом, если совпадают уровень, возраст и цель участников. Размер и правила набора зависят от школы и программы.",
    icon: Users,
    highlights: ["Уточните максимальный размер группы", "Спросите, как проверяют уровень до занятия", "Сверьте расписание, длительность и правила отмены"],
    questions: [{ question: "Группы формируют по уровню?", answer: "Это зависит от программы. До оплаты уточните критерии, число участников и что происходит, если группа не набирается." }, { question: "Подойдёт ли группа семье?", answer: "Спросите, могут ли участники разного возраста и опыта заниматься вместе или лучше выбрать несколько занятий." }],
  },
  "/instruktory/dlya-rebenka/": {
    title: "Инструктор для ребёнка",
    lead: "Для ребёнка важны подходящий возрасту формат, спокойное знакомство со снаряжением и возможность сделать паузу, если он устал или тревожится.",
    icon: Baby,
    highlights: ["Сообщите возраст и предыдущий опыт", "Уточните длительность, размер и возраст группы", "Спросите, как школа действует, если ребёнок боится или устал"],
    questions: [{ question: "Как проходит первое занятие?", answer: "Попросите школу описать знакомство, правила безопасности, формат связи с родителем и условия пауз. Программа зависит от возраста и опыта ребёнка." }, { question: "Что делать, если ребёнок боится?", answer: "Не заставляйте продолжать. Сообщите инструктору, остановитесь и обсудите, можно ли спокойно привыкнуть к снаряжению или завершить занятие." }],
  },
  "/instruktory/bronirovanie/": {
    title: "Как забронировать занятие с инструктором",
    lead: "Чтобы подобрать занятие, подготовьте даты, курорт, возраст и опыт участников. Доступность, цену и правила отмены подтвердите до оплаты.",
    icon: Building2,
    highlights: ["Выберите курорт и даты", "Опишите, кто будет учиться, дисциплину и уровень", "Подтвердите итоговую цену, место встречи и условия переноса"],
    questions: [{ question: "Заявка подтверждает бронирование?", answer: "Нет. Заявка на сайте — запрос на подбор. Бронирование считается подтверждённым только после ответа организатора и согласования условий." }, { question: "Когда нужно платить?", answer: "Порядок и способы оплаты зависят от школы или инструктора. Не переводите средства до подтверждения получателя, услуги и условий возврата." }],
  },
};

export default function InstructorTopics() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const topic = topics[normalizedPath];

  if (!topic) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero icon={topic.icon} eyebrow="Инструкторы" title={topic.title} lead={topic.lead}>
          <Button asChild variant="warm" className="rounded-lg font-semibold">
            <Link to={LEAD_FORM_HREF}>Запросить доступность и цену<ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </PageHero>
        <div className="container mx-auto grid gap-8 px-4 py-10 md:py-14">
          <section className="grid gap-4 md:grid-cols-3">
            {topic.highlights.map((highlight, index) => (
              <article key={highlight} className="rounded-xl border border-border bg-card p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                <p className="mt-3 text-sm font-medium leading-relaxed">{highlight}</p>
              </article>
            ))}
          </section>
          <section className="grid gap-4 md:grid-cols-2">
            {topic.questions.map((item) => (
              <article key={item.question} className="rounded-xl border border-border bg-card p-5">
                <h2 className="font-bold">{item.question}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </section>
          <div className="rounded-lg border border-signal/40 bg-signal/10 p-4 text-sm leading-relaxed">
            Тарифы в калькуляторе относятся к сезону {site.pricesSeason}; высокосезонные цены и доступность могут отличаться. Подтвердите цену и условия у организатора до оплаты.
            <Link to="/instruktory/#calculator" className="ml-1 font-semibold text-primary hover:underline">Открыть калькулятор</Link>
          </div>
          {topic.source && (
            <a href={topic.source.href} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">
              {topic.source.label}
            </a>
          )}
          <section id="request" className="scroll-mt-24 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-bold">Уточнить доступность</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">Оставьте запрос. Отправка формы не означает подтверждённую бронь — дождитесь ответа и согласуйте условия.</p>
            </div>
            <InstructorLeadForm />
          </section>
        </div>
      </main>
    </div>
  );
}
