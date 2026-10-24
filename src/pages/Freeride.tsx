import { Header } from "@/components/layout/Header";
import { LEAD_FORM_HREF } from "@/components/layout/nav";
import { PageHero } from "@/components/layout/PageHero";
import { photos } from "@/data/photos";
import { Shield, AlertTriangle, Mountain, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const formats = [
  {
    title: "Однодневный выход",
    description: "Знакомство с фрирайдом, безопасные маршруты для начинающих",
    price: "от 15 000 ₽",
    duration: "4-6 часов",
  },
  {
    title: "Программа на несколько дней",
    description: "Прогрессия от простого к сложному, разные зоны катания",
    price: "от 40 000 ₽",
    duration: "3-5 дней",
  },
  {
    title: "Индивидуальный гид",
    description: "Персональный маршрут, максимум внимания, гибкий график",
    price: "от 25 000 ₽/день",
    duration: "полный день",
  },
];

const levels = [
  { name: "Начальный", description: "Первый опыт вне трасс, пологие склоны, минимальный риск" },
  { name: "Средний", description: "Разнообразный рельеф, лесные участки, кулуары" },
  { name: "Продвинутый", description: "Сложный рельеф, крутые склоны, требует хорошей техники" },
  { name: "Эксперт", description: "Экстремальные маршруты, для опытных райдеров" },
];

const safetyRules = [
  "Никогда не выходите за пределы трасс без сертифицированного гида",
  "Всегда имейте при себе лавинное снаряжение (бипер, щуп, лопата)",
  "Проверяйте лавинную обстановку перед каждым выходом",
  "Слушайте указания гида и не отклоняйтесь от группы",
  "Физическая подготовка — залог безопасности и удовольствия",
];

const Freeride = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <PageHero
          icon={Mountain}
          eyebrow="Фрирайд"
          image={photos.freeride}
          title="Фрирайд в Красной Поляне"
          lead="Катание за пределами подготовленных трасс — это свобода и нетронутый снег. Но только с сертифицированным гидом и лавинным снаряжением."
        />

        {/* Why guide */}
        <section className="py-16 bg-destructive/5 border-y border-destructive/20">
          <div className="container mx-auto px-4">
            <div className="flex items-start gap-4 max-w-3xl">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Почему только с сертифицированным гидом?
                </h2>
                <p className="text-muted-foreground mb-4">
                  Фрирайд — это не просто катание. Это оценка лавинной опасности, 
                  знание рельефа, погодных условий и спасательных протоколов. 
                  Наши гиды имеют международные сертификаты и многолетний опыт.
                </p>
                <p className="text-destructive font-medium">
                  Без гида риск попасть в лавину или заблудиться крайне высок.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Форматы программ
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {formats.map((format) => (
                <div 
                  key={format.title}
                  className="p-6 bg-card rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{format.duration}</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{format.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{format.description}</p>
                  <p className="text-lg font-semibold text-primary">{format.price}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Levels */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8">
              Уровни сложности
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
              {levels.map((level, index) => (
                <div 
                  key={level.name}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{level.name}</h3>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Safety */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-8 h-8 text-sunset" />
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Правила безопасности
                </h2>
              </div>
              <ul className="space-y-4 mb-8">
                {safetyRules.map((rule) => (
                  <li key={rule} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-sunset/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-sunset" />
                    </div>
                    <span className="text-muted-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 rounded-xl bg-secondary/60 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold">Нужен гид или инструктор по фрирайду?</h2>
                <p className="mt-2 text-muted-foreground">
                  Оставьте заявку — уточним опыт, даты и формат и подберём сертифицированного специалиста.
                </p>
              </div>
              <Button asChild variant="warm" size="lg" className="h-12 shrink-0 rounded-lg px-6 font-semibold">
                <Link to={LEAD_FORM_HREF}>Оставить заявку</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Freeride;
