import { useState } from "react";
import { Calculator, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { skiSchoolPricing, calculatePrice, getSeasonByDate, type Resort } from "@/data/skiSchoolPricing";

type Category = 'individual' | 'group-adult' | 'group-child';

const resortNames: Record<Resort, string> = {
  'roza-hutor': 'Роза Хутор',
  'krasnaya-polyana': 'Красная Поляна',
  'gazprom': 'Газпром (Riders)'
};

const seasonNames = {
  'roza-hutor': {
    base: 'Базовый',
    peak: 'ПИК'
  },
  'krasnaya-polyana': {
    low: 'Низкий',
    high: 'Высокий',
    peak: 'ПИК'
  },
  'gazprom': {
    winter: 'Зимний',
    peak: 'ПИК'
  }
};

const seasonDatesInfo = {
  'roza-hutor': {
    base: '12.01.26-05.02.26 и 10.03.26-30.04.26',
    peak: '26.12.25-11.01.26 и 06.02.26-09.03.26'
  },
  'krasnaya-polyana': {
    low: '01.04.26-10.05.26',
    high: '12.01.26-31.01.26 и 10.03.26-31.03.26',
    peak: '26.12.25-11.01.26 и 01.02.26-09.03.26'
  },
  'gazprom': {
    winter: '01.12.25-26.12.25, 12.01.26-13.02.26, 09.03.26-30.04.26',
    peak: '27.12.25-11.01.26 и 14.02.26-08.03.26'
  }
};

export function PriceCalculator() {
  const [resort, setResort] = useState<Resort>('roza-hutor');
  const [category, setCategory] = useState<Category>('individual');
  const [selectedId, setSelectedId] = useState<string>('rh-ind-2h-1p');
  const [date, setDate] = useState<Date>(new Date());
  const [days, setDays] = useState<number>(1);

  const filteredPrices = skiSchoolPricing.filter(p => p.category === category && p.resort === resort);
  const selectedPrice = skiSchoolPricing.find(p => p.id === selectedId);
  const pricePerDay = selectedPrice ? calculatePrice(selectedId, date) : null;
  const totalPrice = pricePerDay ? pricePerDay * days : null;
  const season = getSeasonByDate(date, resort);

  // Функция для получения сравнительных цен на других курортах
  const getComparativePrices = () => {
    if (!selectedPrice) return [];

    const comparisons: Array<{ resort: Resort; price: number | null; description: string }> = [];
    const otherResorts = (['roza-hutor', 'krasnaya-polyana', 'gazprom'] as Resort[]).filter(r => r !== resort);

    otherResorts.forEach(otherResort => {
      // Ищем наиболее похожую программу на другом курорте
      let similarPrice: typeof selectedPrice | undefined;

      if (category === 'individual') {
        // Для индивидуальных занятий сравниваем по длительности и количеству участников
        similarPrice = skiSchoolPricing.find(p => 
          p.resort === otherResort &&
          p.category === category &&
          p.duration === selectedPrice.duration &&
          p.participants === selectedPrice.participants
        );
      } else if (category === 'group-adult') {
        // Для групповых взрослых - ищем по длительности
        similarPrice = skiSchoolPricing.find(p => 
          p.resort === otherResort &&
          p.category === category &&
          p.duration === selectedPrice.duration
        );
      } else if (category === 'group-child') {
        // Для детского клуба ищем похожие программы по типу или возрасту
        similarPrice = skiSchoolPricing.find(p => 
          p.resort === otherResort &&
          p.category === category &&
          (p.type === selectedPrice.type || p.ageRange === selectedPrice.ageRange || p.duration === selectedPrice.duration)
        );
      }

      if (similarPrice) {
        const price = calculatePrice(similarPrice.id, date);
        comparisons.push({
          resort: otherResort,
          price: price,
          description: similarPrice.description || similarPrice.duration
        });
      }
    });

    return comparisons;
  };

  const comparativePrices = getComparativePrices();

  const handleResortChange = (newResort: Resort) => {
    setResort(newResort);
    const firstOption = skiSchoolPricing.find(p => p.resort === newResort && p.category === category);
    if (firstOption) setSelectedId(firstOption.id);
  };

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const firstOption = skiSchoolPricing.find(p => p.category === newCategory && p.resort === resort);
    if (firstOption) setSelectedId(firstOption.id);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-background to-glacier/5 border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">Калькулятор стоимости</h3>
          <p className="text-sm text-muted-foreground">Рассчитайте стоимость занятия</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Выбор курорта */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Курорт</Label>
          <RadioGroup value={resort} onValueChange={handleResortChange}>
            <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="roza-hutor" id="roza-hutor" />
              <Label htmlFor="roza-hutor" className="flex-1 cursor-pointer text-sm md:text-base">
                Роза Хутор
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="krasnaya-polyana" id="krasnaya-polyana" />
              <Label htmlFor="krasnaya-polyana" className="flex-1 cursor-pointer text-sm md:text-base">
                Красная Поляна
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="gazprom" id="gazprom" />
              <Label htmlFor="gazprom" className="flex-1 cursor-pointer text-sm md:text-base">
                Газпром (Riders)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Дата занятия */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Дата занятия</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                locale={ru}
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">
            Сезон: <span className="font-semibold text-foreground">
              {seasonNames[resort][season as keyof typeof seasonNames[typeof resort]]}
            </span>
          </p>
        </div>

        {/* Категория */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Тип занятия</Label>
          <RadioGroup value={category} onValueChange={(v) => handleCategoryChange(v as Category)}>
            <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual" className="flex-1 cursor-pointer text-sm md:text-base">
                Индивидуальные занятия
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="group-adult" id="group-adult" />
              <Label htmlFor="group-adult" className="flex-1 cursor-pointer text-sm md:text-base">
                Групповые занятия для взрослых
              </Label>
            </div>
            {resort === 'roza-hutor' && (
              <div className="flex items-center space-x-2 p-2 md:p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                <RadioGroupItem value="group-child" id="group-child" />
                <Label htmlFor="group-child" className="flex-1 cursor-pointer text-sm md:text-base">
                  Детский клуб «Егорка»
                </Label>
              </div>
            )}
          </RadioGroup>
        </div>

        {/* Выбор программы */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Программа</Label>
          <Select value={selectedId} onValueChange={setSelectedId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filteredPrices.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.description} — {p.duration}
                  {p.ageRange && ` (${p.ageRange})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedPrice && (
            <div className="text-sm text-muted-foreground space-y-1">
              {selectedPrice.participants && (
                <p>Участники: {selectedPrice.participants}</p>
              )}
              {selectedPrice.equipment && (
                <p className="text-green-600">✓ Оборудование предоставляется</p>
              )}
              {selectedPrice.notes && (
                <p className="text-amber-600">ℹ {selectedPrice.notes}</p>
              )}
            </div>
          )}
        </div>

        {/* Количество дней */}
        {selectedPrice && !selectedPrice.duration.includes('дня') && !selectedPrice.duration.includes('дней') && (
          <div className="space-y-3">
            <Label className="text-base font-semibold">Количество дней</Label>
            <Select value={days.toString()} onValueChange={(v) => setDays(Number(v))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 10, 14].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} {n === 1 ? 'день' : n < 5 ? 'дня' : 'дней'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Результат */}
        <div className="pt-6 border-t border-border">
          <div className="space-y-3">
            {days > 1 && pricePerDay && !selectedPrice?.duration.includes('дня') && !selectedPrice?.duration.includes('дней') && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Стоимость за 1 день</span>
                <span className="font-semibold">{pricePerDay.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground mb-1">
                  {days > 1 && !selectedPrice?.duration.includes('дня') && !selectedPrice?.duration.includes('дней') ? 'Итоговая стоимость' : 'Стоимость'}
                </p>
                <p className="text-2xl md:text-4xl font-bold text-primary">
                  {totalPrice ? `${totalPrice.toLocaleString('ru-RU')} ₽` : '—'}
                </p>
              </div>
            </div>
          </div>
          {selectedPrice && totalPrice && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">
                Сезон {seasonNames[resort][season as keyof typeof seasonNames[typeof resort]]}: {seasonDatesInfo[resort][season as keyof typeof seasonDatesInfo[typeof resort]]}
              </p>
            </div>
          )}

          {/* Сравнительная таблица с другими курортами */}
          {comparativePrices.length > 0 && totalPrice && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                <span>Сравнение с другими курортами</span>
              </h4>
              <div className="space-y-2">
                {comparativePrices.map((comp, idx) => {
                  const compTotalPrice = comp.price ? comp.price * days : null;
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 md:p-3 bg-muted/30 rounded-lg text-xs md:text-sm">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{resortNames[comp.resort]}</div>
                        <div className="text-xs text-muted-foreground truncate">{comp.description}</div>
                      </div>
                      <div className="font-bold text-sm md:text-base ml-2 flex-shrink-0">
                        {compTotalPrice ? `${compTotalPrice.toLocaleString('ru-RU')} ₽` : 'Н/Д'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                * Цены указаны для аналогичных условий (дата, категория, длительность)
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
