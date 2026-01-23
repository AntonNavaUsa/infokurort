import { Header } from "@/components/layout/Header";
import { SkiPassCalculator } from "@/components/SkiPassCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Mountain, Clock, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SkiPasses = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-glacier/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero секция */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Ски-пассы Газпром Поляна</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
            Абонементы на подъёмники
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Выберите подходящий ски-пасс для катания на курорте Газпром Поляна. 
            Склоны Лаура и Альпика ждут вас!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Калькулятор */}
          <div>
            <SkiPassCalculator />
          </div>

          {/* Информация о ски-пассах */}
          <div className="space-y-6">
            {/* О курорте */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-blue-600" />
                  О курорте Газпром Поляна
                </CardTitle>
                <CardDescription>
                  Современный горнолыжный курорт в Красной Поляне
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Склон Лаура</h4>
                  <p className="text-sm text-muted-foreground">
                    Центральная зона катания с разнообразными трассами различной сложности. 
                    Идеально подходит для всех уровней подготовки.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Синие трассы</Badge>
                    <Badge variant="secondary">Красные трассы</Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Склон Альпика</h4>
                  <p className="text-sm text-muted-foreground">
                    Верхняя зона катания с панорамными видами и более сложными трассами. 
                    Отлично подходит для опытных лыжников.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">Красные трассы</Badge>
                    <Badge variant="secondary">Черные трассы</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Типы абонементов */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-blue-600" />
                  Типы абонементов
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <div className="font-semibold text-sm mb-1">Газпром Поляна</div>
                    <div className="text-xs text-muted-foreground">
                      Полный доступ к склонам Лаура и Альпика. Дневное катание.
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <div className="font-semibold text-sm mb-1">Склон Лаура</div>
                    <div className="text-xs text-muted-foreground">
                      Доступ к канатным дорогам и трассам склона Лаура.
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <div className="font-semibold text-sm mb-1">Склон Альпика</div>
                    <div className="text-xs text-muted-foreground">
                      Доступ к канатным дорогам и трассам склона Альпика.
                    </div>
                  </div>

                  <div className="p-3 bg-sky-500/5 rounded-lg border border-sky-500/10">
                    <div className="font-semibold text-sm mb-1 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Вечерняя Лаура
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Вечернее катание на склоне Лаура (17:00-22:00)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Важная информация */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <ul className="space-y-1 mt-2">
                  <li>• Детям до 6 лет — бесплатно</li>
                  <li>• Детский билет: 7-14 лет</li>
                  <li>• Молодежный: 15-25 лет</li>
                  <li>• Взрослый: от 26 лет</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>

        {/* Дополнительная информация */}
        <Card className="bg-gradient-to-br from-blue-500/5 to-sky-500/5">
          <CardHeader>
            <CardTitle>Полезная информация</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                График работы
              </h4>
              <p className="text-sm text-muted-foreground">
                Канатные дороги работают согласно расписанию курорта. 
                Дневное катание обычно с 9:00 до 17:00.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-600" />
                Как приобрести
              </h4>
              <p className="text-sm text-muted-foreground">
                Ски-пассы можно приобрести в кассах курорта или онлайн на официальном сайте.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Условия использования
              </h4>
              <p className="text-sm text-muted-foreground">
                Абонемент действует в соответствии с выбранным периодом и типом катания.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SkiPasses;
