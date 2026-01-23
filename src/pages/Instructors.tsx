import { Header } from "@/components/layout/Header";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { PriceCalculator } from "@/components/PriceCalculator";
import { 
  Building2, 
  UserCheck, 
  AlertTriangle, 
  MessageCircle, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Shield
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

const Instructors = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChatButton />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-frost opacity-50" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Инструкторы и школы катания в Красной Поляне
              </h1>
              <p className="text-lg text-muted-foreground">
                В Красной Поляне работают десятки школ и инструкторов.
                Мы собрали все официальные школы курортов и объяснили, какие бывают инструкторы 
                и в чём между ними разница, чтобы вы могли выбрать безопасно и осознанно.
              </p>
            </div>
          </div>
        </section>

        {/* Price Calculator */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <PriceCalculator />
          </div>
        </section>

        {/* Instructor Types */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-10">
              Какие бывают инструкторы
            </h2>
            <div className="grid gap-8">
              {instructorTypes.map((type) => (
                <div 
                  key={type.title}
                  className={`p-6 md:p-8 bg-card rounded-xl border ${
                    type.warning 
                      ? "border-sunset/30 bg-sunset/5" 
                      : "border-border/50"
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                      type.color === "primary" ? "bg-primary/10" :
                      type.color === "glacier" ? "bg-glacier/10" :
                      "bg-sunset/10"
                    }`}>
                      <type.icon className={`w-7 h-7 ${
                        type.color === "primary" ? "text-primary" :
                        type.color === "glacier" ? "text-glacier" :
                        "text-sunset"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{type.description}</p>
                      <ul className="space-y-2 mb-4">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            {feature.positive ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-sunset mt-0.5 flex-shrink-0" />
                            )}
                            <span className="text-muted-foreground">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                      <p className={`text-sm font-medium ${
                        type.warning ? "text-sunset" : "text-primary"
                      }`}>
                        {type.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Warning about intermediaries */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto p-6 md:p-8 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                    Важно знать
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    В Красной Поляне также работает некоторое количество посредников, которые называют себя 
                    школами катания, но по факту таковыми не являются.
                  </p>
                  
                  <p className="text-sm font-medium text-foreground mb-2">Как правило:</p>
                  <ul className="space-y-1 mb-6">
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-sunset mt-0.5 flex-shrink-0" />
                      <span>у них нет собственной школы на курорте</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-sunset mt-0.5 flex-shrink-0" />
                      <span>они не несут ответственность как официальная школа</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="w-4 h-4 text-sunset mt-0.5 flex-shrink-0" />
                      <span>занятия проводят на базе привлечённых инструкторов или договорённостей</span>
                    </li>
                  </ul>

                  <div className="p-4 bg-background/50 rounded-lg border border-border/30 mb-6">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">⚠️ Исключение составляют</span> некоторые школы из других регионов, которые:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>• проводят короткие групповые выездные программы</li>
                      <li>• заранее согласовывают формат работы с курортами</li>
                      <li>• действуют в ограниченные даты и по конкретной программе</li>
                    </ul>
                  </div>

                  <p className="text-sm font-medium text-foreground mb-2">Мы рекомендуем заранее уточнять:</p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>статус школы</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>наличие допуска курорта</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>формат ответственности за обучение</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resorts */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-10">
              Школы и инструкторы по курортам
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resorts.map((resort) => (
                <div 
                  key={resort.name}
                  className="p-4 md:p-6 bg-card rounded-xl border border-border/50"
                >
                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6 pb-3 md:pb-4 border-b border-border/50">
                    {resort.name}
                  </h3>
                  <div className="space-y-6">
                    {resort.sections.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                          {section.title}
                        </h4>
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              {item.url ? (
                                <a 
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group"
                                >
                                  <span className="text-sm">{item.name}</span>
                                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                                </a>
                              ) : (
                                <span className="text-sm text-muted-foreground">{item.name}</span>
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

        {/* CTA */}
        <section className="py-12 md:py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center p-6 md:p-8 bg-primary/5 rounded-2xl border border-primary/20">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                Не знаете, что выбрать?
              </h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Уровень катания, цели, даты, дети или взрослые — всё это важно.
                Мы поможем подобрать подходящую школу или инструктора именно под вашу задачу.
              </p>
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                👉 Задать вопрос в чате
              </Button>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-start gap-3 max-w-3xl mx-auto">
              <Shield className="w-4 h-4 text-muted-foreground/60 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground/60">
                Информация носит справочный характер.
                Мы рекомендуем пользоваться услугами официальных школ и аккредитованных инструкторов курортов.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Instructors;
