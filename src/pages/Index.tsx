import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Mountain, Shield, Users, Calendar } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <main className="pt-20 md:pt-24">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 gradient-frost opacity-50" />
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-glacier/10 rounded-full blur-3xl" />
          
          <div className="relative container mx-auto px-4 py-12 md:py-20">
            {/* Resort Opening Dates - Featured */}
            <div className="max-w-5xl mx-auto mb-12 animate-slide-up">
              <div className="bg-gradient-to-br from-primary/10 via-glacier/5 to-sunset/5 border-2 border-primary/20 rounded-2xl p-8 md:p-10 shadow-xl">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Даты открытия курортов</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl bg-background/80 border-2 border-primary/30 shadow-lg hover:shadow-xl transition-shadow">
                    <p className="font-semibold text-xl text-foreground mb-3">Красная Поляна</p>
                    <p className="text-2xl text-primary font-bold">26 декабря 2025</p>
                  </div>
                  <div className="p-6 rounded-xl bg-background/80 border-2 border-glacier/30 shadow-lg hover:shadow-xl transition-shadow">
                    <p className="font-semibold text-xl text-foreground mb-3">Роза Хутор</p>
                    <p className="text-2xl text-glacier font-bold">29 декабря 2025</p>
                  </div>
                  <div className="p-6 rounded-xl bg-background/80 border-2 border-sunset/30 shadow-lg hover:shadow-xl transition-shadow">
                    <p className="font-semibold text-xl text-foreground mb-3">Газпром</p>
                    <p className="text-lg text-sunset font-semibold">Ориентировочно<br/>29-30 декабря</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Спросите — мы подберём{" "}
                <span className="text-primary">лучшее</span> на курорте
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: "0.2s" }}>
                Инструкторы, гиды для фрирайда и персональные программы. 
                Опишите запрос — получите идеальное решение.
              </p>
            </div>

            {/* Chat Interface */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <ChatInterface />
            </div>

            {/* Trust Badges */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Проверенные гиды</p>
                  <p className="text-sm text-muted-foreground">Все с сертификатами</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30">
                <div className="w-12 h-12 rounded-full bg-glacier/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-glacier" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Индивидуальный подбор</p>
                  <p className="text-sm text-muted-foreground">Под ваши цели</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30">
                <div className="w-12 h-12 rounded-full bg-sunset/10 flex items-center justify-center flex-shrink-0">
                  <Mountain className="w-6 h-6 text-sunset" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Все курорты</p>
                  <p className="text-sm text-muted-foreground">Красная Поляна и другие</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
