import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Mountain, Shield, Users } from "lucide-react";

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
            {/* Hero Content */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-slide-up">
                Спросите — мы подберём{" "}
                <span className="text-primary">лучшее</span> на курорте
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Инструкторы, гиды для фрирайда и персональные программы. 
                Опишите запрос — получите идеальное решение.
              </p>
            </div>

            {/* Chat Interface */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <ChatInterface />
            </div>

            {/* Trust Badges */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.3s" }}>
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
