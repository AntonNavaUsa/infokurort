import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { SkiPassCalculator } from "@/components/SkiPassCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Mountain, Clock, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { type Resort } from "@/data/skiPassPricing";

const SkiPasses = () => {
  const [selectedResort, setSelectedResort] = useState<Resort>('gazprom');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-glacier/5 to-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero секция */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {selectedResort === 'gazprom' ? 'Ски-пассы Газпром Поляна' : 'Ски-пассы Роза Хутор'}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 bg-clip-text text-transparent">
            Абонементы на подъёмники
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {selectedResort === 'gazprom' 
              ? 'Выберите подходящий ски-пасс для катания на курорте Газпром Поляна: однодневные, многодневные или сезонные абонементы. Склоны Лаура и Альпика ждут вас!'
              : 'Выберите подходящий ски-пасс для катания на курорте Роза Хутор. Современный курорт с развитой инфраструктурой и разнообразными трассами!'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Калькулятор */}
          <div>
            <SkiPassCalculator 
              defaultResort={selectedResort}
              onResortChange={setSelectedResort}
            />
          </div>

          {/* Информация о ски-пассах */}
          <div className="space-y-6">
            {/* О курорте */}
            {selectedResort === 'gazprom' ? (
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
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-blue-600" />
                    О курорте Роза Хутор
                  </CardTitle>
                  <CardDescription>
                    Олимпийский курорт мирового уровня
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Характеристики</h4>
                    <p className="text-sm text-muted-foreground">
                      Крупнейший горнолыжный курорт России с современной инфраструктурой. 
                      102 км трасс всех уровней сложности, от зеленых до черных.
                    </p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">Зеленые трассы</Badge>
                      <Badge variant="secondary">Синие трассы</Badge>
                      <Badge variant="secondary">Красные трассы</Badge>
                      <Badge variant="secondary">Черные трассы</Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Подъемники</h4>
                    <p className="text-sm text-muted-foreground">
                      19 канатных дорог различной пропускной способности, включая гондольные 
                      и кресельные подъемники. Высота катания до 2320 метров.
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Фаст-трек «Приоритет»</h4>
                    <p className="text-sm text-muted-foreground">
                      Услуга быстрого прохода на все основные подъемники курорта. 
                      Экономьте время в очередях!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Типы абонементов */}
            {selectedResort === 'gazprom' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-blue-600" />
                    Типы абонементов
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="font-semibold text-sm mb-1 text-green-700 dark:text-green-400">Однодневные</div>
                      <div className="text-xs text-muted-foreground">
                        Абонемент на 1 день катания. Выберите дату и тип склона.
                      </div>
                    </div>

                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="font-semibold text-sm mb-1 text-blue-700 dark:text-blue-400">Многодневные (2-7 дней)</div>
                      <div className="text-xs text-muted-foreground">
                        Абонемент на несколько дней катания в любые дни периода действия. Выгоднее однодневных!
                      </div>
                    </div>

                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="font-semibold text-sm mb-1 text-purple-700 dark:text-purple-400">Сезонные</div>
                      <div className="text-xs text-muted-foreground">
                        Безлимитное катание весь сезон 2025-2026. Максимальная выгода для регулярного катания!
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <h5 className="font-semibold text-sm">Типы склонов:</h5>
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
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-blue-600" />
                    Типы ски-пассов
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="font-semibold text-sm mb-1 text-blue-700 dark:text-blue-400">Стандартный</div>
                    <div className="text-xs text-muted-foreground">
                      Доступ на все подъемники курорта (кроме Тироль). Дневное катание с 9:00 до 17:00. 
                      Смарт-карта включена в стоимость.
                    </div>
                  </div>

                  <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="font-semibold text-sm mb-1 text-green-700 dark:text-green-400">Учебный</div>
                    <div className="text-xs text-muted-foreground">
                      Для начинающих: 1 подъем на «Олимпия» + неограниченные подъемы на «Шале», 
                      «Ювента» и ленточный транспортер на учебном склоне.
                    </div>
                  </div>

                  <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="font-semibold text-sm mb-1 text-purple-700 dark:text-purple-400">Фаст-трек «Приоритет»</div>
                    <div className="text-xs text-muted-foreground">
                      Стандартный ски-пасс + быстрый проход по выделенным коридорам на все основные 
                      подъемники. Экономьте время!
                    </div>
                  </div>

                  <div className="p-3 bg-sky-500/10 rounded-lg border border-sky-500/20">
                    <div className="font-semibold text-sm mb-1 flex items-center gap-2 text-sky-700 dark:text-sky-400">
                      <Clock className="w-4 h-4" />
                      Вечерний
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Вечернее катание с 19:00 до 23:00 на учебном склоне: 1 подъем на «Олимпия» + 
                      неограниченно на «Шале», «Ювента».
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Важная информация */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {selectedResort === 'gazprom' ? (
                  <ul className="space-y-1 mt-2">
                    <li>• Детям до 6 лет — бесплатно</li>
                    <li>• Детский билет: 7-14 лет</li>
                    <li>• Молодежный: 15-25 лет</li>
                    <li>• Взрослый: от 26 лет</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 mt-2">
                    <li>• Детям до 6 лет — 1 ₽ (бесплатно)</li>
                    <li>• Взрослый тариф: с 15 лет</li>
                    <li>• Скидки: инвалиды, ветераны, студенты</li>
                    <li>• Льготы только в кассе при предъявлении документов</li>
                  </ul>
                )}
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
