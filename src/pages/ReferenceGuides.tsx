import { ArrowRight, ExternalLink, Info, MapPinned, Mountain, Shield, TrainFront, Wrench } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { PageHero } from "@/components/layout/PageHero";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

type GuideLink = { label: string; href: string };
type GuideSection = { title: string; text: string; links?: GuideLink[] };

type GuidePage = {
  title: string;
  description: string;
  icon: typeof Info;
  sections: GuideSection[];
  links?: GuideLink[];
};

const resortLinks = {
  rosa: "https://rosakhutor.ru/ski-school/",
  polyana: "https://krasnayapolyanaresort.ru/kurort/uslugi/instructors/",
  gazprom: "https://lk-gazprom.ru",
};

const resortPages: Record<string, GuidePage> = {
  "roza-hutor": {
    title: "Роза Хутор: справка для поездки",
    description: "Официальные источники по режиму работы, тарифам, трассам, школам и услугам курорта. Проверяйте текущие условия перед поездкой.",
    icon: Mountain,
    sections: [
      { title: "Перед выездом", text: "Сверьте дату сезона, работу подъёмников и трасс, ограничения по погоде и условия допуска на склон. Эти данные меняются в течение сезона." },
      { title: "Ски-пасс и услуги", text: "Тарифы, правила возврата и состав услуг уточняйте в официальных каналах курорта. Сравнение стоимости занятий доступно в калькуляторе справочной.", links: [{ label: "Калькулятор ски-пассов", href: "/ski-passes/" }, { label: "Официальная школа", href: resortLinks.rosa }] },
      { title: "Инструкторы", text: "Сверяйте формат обучения, допуск к работе на трассах, возрастные ограничения и итоговую цену до оплаты.", links: [{ label: "Школы и инструкторы", href: "/instruktory/#schools" }, { label: "Подобрать инструктора", href: LEAD_FORM_HREF }] },
    ],
    links: [{ label: "Официальный сайт Роза Хутор", href: "https://rosakhutor.ru/" }],
  },
  "krasnaya-polyana": {
    title: "Курорт Красная Поляна: справка для поездки",
    description: "Справочная страница курорта Красная Поляна со ссылками на первоисточники. Актуальные режим работы и тарифы проверяйте перед поездкой.",
    icon: Mountain,
    sections: [
      { title: "Перед выездом", text: "Проверьте календарь работы, состояние трасс и подъёмников, погодные ограничения и правила доступа на выбранную дату." },
      { title: "Ски-пасс и услуги", text: "Тарифы, условия возврата и доступные услуги могут зависеть от сезона и даты. Используйте официальный сайт как первоисточник.", links: [{ label: "Калькулятор ски-пассов", href: "/ski-passes/" }, { label: "Официальные школы курорта", href: resortLinks.polyana }] },
      { title: "Инструкторы", text: "Уточните у школы или инструктора размер группы, программу, возрастные условия и допуск к работе на склонах.", links: [{ label: "Сравнить форматы занятий", href: "/instruktory/#formats" }, { label: "Подобрать инструктора", href: LEAD_FORM_HREF }] },
    ],
    links: [{ label: "Официальный сайт курорта Красная Поляна", href: "https://krasnayapolyanaresort.ru/" }],
  },
  gazprom: {
    title: "Газпром Поляна: справка для поездки",
    description: "Справка по курорту Газпром Поляна: первоисточники по зонам катания, режиму работы и услугам. Проверяйте данные на официальном сайте.",
    icon: Mountain,
    sections: [
      { title: "Перед выездом", text: "Сверьте актуальную работу зон катания и подъёмников, доступность трасс и возможные ограничения на выбранную дату." },
      { title: "Ски-пасс и услуги", text: "Тарифы и условия использования абонементов меняются по сезонам. Подтвердите цену и условия у курорта перед покупкой.", links: [{ label: "Калькулятор ски-пассов", href: "/ski-passes/" }, { label: "Официальный сайт Газпром Поляна", href: resortLinks.gazprom }] },
      { title: "Инструкторы", text: "Спросите, кто проводит занятие, на какой зоне, каков размер группы и включено ли что-либо кроме работы инструктора.", links: [{ label: "Школы и форматы занятий", href: "/instruktory/" }, { label: "Подобрать инструктора", href: LEAD_FORM_HREF }] },
    ],
    links: [{ label: "Официальная школа Рiders Project", href: "https://ridersproject.ru/" }],
  },
};

const guides: Record<string, GuidePage> = {
  "/kurorty/": {
    title: "Горнолыжные курорты Красной Поляны",
    description: "Три курорта в одном справочном формате: ссылки на первоисточники и подсказки, что проверить перед выездом.",
    icon: Mountain,
    sections: [
      { title: "Роза Хутор", text: "Перед поездкой проверьте актуальные трассы, режим работы и тарифы у курорта.", links: [{ label: "Справка о курорте", href: "/kurorty/roza-hutor/" }, { label: "Официальный сайт", href: "https://rosakhutor.ru/" }] },
      { title: "Курорт Красная Поляна", text: "Условия катания и доступность отдельных услуг зависят от даты и погоды.", links: [{ label: "Справка о курорте", href: "/kurorty/krasnaya-polyana/" }, { label: "Официальный сайт", href: "https://krasnayapolyanaresort.ru/" }] },
      { title: "Газпром Поляна", text: "Сверьте, какая зона и какие услуги работают в выбранный день.", links: [{ label: "Справка о курорте", href: "/kurorty/gazprom/" }, { label: "Официальный сайт", href: resortLinks.gazprom }] },
    ],
  },
  "/transport/": {
    title: "Как добраться до Красной Поляны",
    description: "Планирование дороги в Красную Поляну: проверяйте расписание, маршруты и условия поездки у перевозчиков и официальных источников.",
    icon: TrainFront,
    sections: [
      { title: "Сначала проверьте расписание", text: "Время отправления, тарифы и наличие мест меняются. Проверьте данные непосредственно перед поездкой у перевозчика; оставьте запас времени на пересадки и дорогу до места проживания.", links: [{ label: "Расписание и билеты РЖД", href: "https://www.rzd.ru/" }, { label: "Аэропорт Сочи", href: "https://aer.aero/" }] },
      { title: "Продумайте последний участок пути", text: "Уточните адрес размещения, время заселения и доступный транспорт от станции или аэропорта. Для поездки в горы учитывайте багаж, зимние условия и возможные изменения дорожной обстановки.", links: [{ label: "Карта жилья", href: "/map/" }, { label: "Варианты размещения", href: "/hotels/" }] },
      { title: "Проверьте сообщения в день выезда", text: "При неблагоприятной погоде или дорожных ограничениях сверяйтесь с сообщениями перевозчика и официальных служб. Не ориентируйтесь на сохранённые прошлогодние расписания." },
    ],
  },
  "/parking/": {
    title: "Парковки на курортах Красной Поляны",
    description: "Что проверить перед поездкой на автомобиле: расположение парковки, режим работы, доступность мест, тариф и правила въезда.",
    icon: MapPinned,
    sections: [
      { title: "Проверьте условия на нужную дату", text: "Количество мест, тарифы, режим работы и правила бронирования могут меняться. Уточните их на сайте выбранного курорта перед выездом." },
      { title: "Сверьте адрес и маршрут", text: "Проверьте, к какой зоне катания относится парковка и как от неё добраться до нужного входа. Не полагайтесь на старые схемы и отметки из сторонних приложений." },
      { title: "Планируйте запасной вариант", text: "В дни высокого спроса оставьте время на поиск места и проверьте альтернативный способ добраться до курорта." },
    ],
    links: [{ label: "Роза Хутор", href: "https://rosakhutor.ru/" }, { label: "Красная Поляна", href: "https://krasnayapolyanaresort.ru/" }, { label: "Газпром Поляна", href: resortLinks.gazprom }],
  },
  "/rental/": {
    title: "Прокат горнолыжного снаряжения",
    description: "Как подготовиться к прокату лыж или сноуборда и что уточнить у пункта проката до оплаты.",
    icon: Wrench,
    sections: [
      { title: "Назовите параметры заранее", text: "Сообщите рост, вес, размер обуви, уровень катания и дисциплину. Для детского снаряжения уточните наличие подходящего размера и требования к сопровождению взрослого." },
      { title: "Проверьте, что входит в комплект", text: "Уточните, включены ли ботинки, шлем и защита, можно ли менять снаряжение в течение дня, как работают залог и возврат." },
      { title: "Перед выходом на склон", text: "Попросите настроить крепления под ваши параметры и проверьте фиксацию ботинок. Если снаряжение давит, болтается или повреждено — попросите заменить его до начала катания." },
    ],
    links: [{ label: "Официальные услуги курортов", href: "/kurorty/" }, { label: "Занятия с инструктором", href: "/instruktory/" }],
  },
  "/help/": {
    title: "Безопасность и экстренная помощь в горах",
    description: "Базовая памятка о безопасности на курорте. При непосредственной угрозе жизни звоните 112 и следуйте инструкциям экстренных служб.",
    icon: Shield,
    sections: [
      { title: "При непосредственной опасности", text: "Позвоните по единому номеру 112. Сообщите, что произошло, точное место или ближайший ориентир, число пострадавших и свой контакт. Следуйте указаниям диспетчера." },
      { title: "На склоне", text: "Следуйте правилам курорта и указателям, не выходите за закрытые ограждения и не покидайте обозначенные трассы без подготовки и сопровождения. При происшествии обратитесь к сотрудникам курорта или спасателям." },
      { title: "Подготовьтесь заранее", text: "Сохраните номер 112, зарядите телефон и сообщите близким маршрут. Номера служб курорта, точки первой помощи и актуальные правила уточняйте на официальном сайте выбранного курорта.", links: [{ label: "МЧС России", href: "https://mchs.gov.ru/" }, { label: "Курорты и официальные сайты", href: "/kurorty/" }] },
    ],
  },
  "/partners/": {
    title: "Партнёрам",
    description: "Инфокурорт развивает независимую справочную и рассматривает полезные для гостей предложения с прозрачными условиями.",
    icon: Info,
    sections: [
      { title: "Принципы сотрудничества", text: "Партнёрские предложения должны быть понятны посетителю, не маскироваться под независимую рекомендацию и не подменять факты о курортах." },
      { title: "Какие предложения рассматриваем", text: "Размещение, трансферы, прокат и услуги инструкторов или гидов. Для публикации необходимы проверяемые сведения о поставщике, условиях услуги, стоимости и разрешениях, если они требуются." },
      { title: "Связаться", text: "На сайте пока не указаны проверенные контакты для партнёрских обращений. До их публикации не отправляйте персональные или платёжные данные через форму подбора инструктора." },
    ],
    links: [{ label: "О принципах справочной", href: "/about/" }],
  },
};

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function GuideLinkList({ links }: { links: GuideLink[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-3">
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          {isExternal(link.href) ? (
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
              {link.label}<ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link to={link.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
              {link.label}<ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function ReferenceGuides() {
  const { pathname } = useLocation();
  const normalizedPath = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const resortSlug = normalizedPath.startsWith("/kurorty/") ? normalizedPath.split("/")[2] : undefined;
  const guide = resortSlug ? resortPages[resortSlug] : guides[normalizedPath];
  const title = guide?.title ?? "Справка для поездки";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <PageHero
          icon={guide?.icon ?? Info}
          eyebrow="Справочная Красной Поляны"
          title={title}
          lead={guide?.description ?? "Страница не найдена."}
          updated={site.contentUpdated}
        />
        {guide ? (
          <div className="container mx-auto grid gap-8 px-4 py-10 md:py-14">
            <div className="rounded-xl border-l-4 border-primary bg-card p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Важно</p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                Режим работы, цены, доступность услуг и правила меняются. Эта страница помогает подготовиться, но актуальные условия подтверждайте у первоисточника перед поездкой.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {guide.sections.map((section) => (
                <article key={section.title} className="rounded-xl border border-border bg-card p-5 md:p-6">
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.text}</p>
                  {section.links && <GuideLinkList links={section.links} />}
                </article>
              ))}
            </div>
            {guide.links && (
              <section className="rounded-xl border border-border bg-secondary/50 p-5 md:p-6">
                <h2 className="font-bold">Первоисточники</h2>
                <GuideLinkList links={guide.links} />
              </section>
            )}
            <section className="rounded-xl border border-border bg-card p-5 md:flex md:items-center md:justify-between md:gap-6 md:p-6">
              <div>
                <h2 className="text-xl font-bold">Нужна помощь с выбором занятия?</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Укажите курорт, даты и уровень — подскажем, какой формат стоит рассмотреть.</p>
              </div>
              <Button asChild variant="warm" className="mt-4 shrink-0 rounded-lg font-semibold md:mt-0">
                <Link to={LEAD_FORM_HREF}>Подобрать инструктора<ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </section>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-12">
            <Link to="/kurorty/" className="text-primary hover:underline">Перейти к справке о курортах</Link>
          </div>
        )}
      </main>
    </div>
  );
}
