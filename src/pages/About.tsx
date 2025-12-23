import { Header } from "@/components/layout/Header";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { MessageCircle, CheckCircle, Clock, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const benefits = [
  {
    icon: MessageCircle,
    title: "Простой запрос — точный ответ",
    description: "Опишите что ищете своими словами. Мы уточним детали и предложим лучшие варианты.",
  },
  {
    icon: CheckCircle,
    title: "Проверенные специалисты",
    description: "Все инструкторы и гиды с сертификатами, страховкой и подтверждённым опытом.",
  },
  {
    icon: Clock,
    title: "Экономия времени",
    description: "Не нужно изучать десятки профилей. Получите подборку под ваши требования за минуты.",
  },
  {
    icon: Heart,
    title: "Индивидуальный подход",
    description: "Учитываем уровень, цели, бюджет и даже характер — чтобы вы получили максимум.",
  },
];

const howItWorks = [
  { step: 1, title: "Опишите запрос", description: "В свободной форме расскажите, что ищете" },
  { step: 2, title: "Уточняем детали", description: "Задаём 1-2 вопроса для точного подбора" },
  { step: 3, title: "Получаете рекомендацию", description: "Предлагаем лучшие варианты с ценами" },
  { step: 4, title: "Оставляете заявку", description: "Мы связываемся для финального подтверждения" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <FloatingChatButton />
      
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-frost opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                О сервисе
              </h1>
              <p className="text-lg text-muted-foreground">
                Alpine Guide — это персональный помощник для поиска инструкторов 
                и гидов на горнолыжных курортах. Никаких каталогов и фильтров — 
                просто опишите что нужно, и мы подберём.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
              Почему мы
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit) => (
                <div 
                  key={benefit.title}
                  className="flex gap-4 p-6 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-foreground mb-12 text-center">
              Как это работает
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold relative z-10">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                Наша миссия
              </h2>
              <p className="text-muted-foreground mb-4">
                Мы верим, что поиск инструктора или гида не должен быть сложным. 
                Вместо бесконечного скроллинга каталогов — простой разговор. 
                Вместо сравнения десятков профилей — персональная рекомендация.
              </p>
              <p className="text-muted-foreground">
                Каждый должен получить возможность кататься безопасно и с удовольствием, 
                независимо от опыта. А наша задача — соединить вас с подходящим специалистом.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center p-8 bg-primary/5 rounded-2xl border border-primary/20">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Готовы попробовать?
              </h2>
              <p className="text-muted-foreground mb-6">
                Задайте первый вопрос — это бесплатно и ни к чему не обязывает.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate("/")}>
                Начать диалог
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
