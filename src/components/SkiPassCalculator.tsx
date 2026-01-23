import { useState } from "react";
import { Calculator, Calendar as CalendarIcon, Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  type AgeCategory,
  type PassType,
  type RosaPassType,
  type SkiPassCategory,
  type Resort,
  resortNames,
  skiPassCategoryNames,
  skiPassCategoryDescriptions,
  passTypeNames,
  passTypeDescriptions,
  rosaPassTypeNames,
  rosaPassTypeDescriptions,
  ageCategoryNames,
  getSkiPassPrice,
  getMultiDayPrice,
  getSeasonalPrice,
  getPeriodByDate,
  getRosaHutorPrice,
  getRosaPeriodByDate,
  periodInfo
} from "@/data/skiPassPricing";

export function SkiPassCalculator() {
  const [resort, setResort] = useState<Resort>('gazprom');
  const [skiPassCategory, setSkiPassCategory] = useState<SkiPassCategory>('single-day');
  const [passType, setPassType] = useState<PassType>('full');
  const [rosaPassType, setRosaPassType] = useState<RosaPassType>('standard');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('adult');
  const [date, setDate] = useState<Date>(new Date('2026-02-01'));
  const [multiDays, setMultiDays] = useState<number>(2);

  const period = resort === 'gazprom' ? getPeriodByDate(date) : getRosaPeriodByDate(date);
  
  // Расчет цены в зависимости от типа абонемента
  let price: number | null = null;
  let totalPrice: number | null = null;
  
  if (resort === 'gazprom') {
    if (skiPassCategory === 'single-day') {
      price = getSkiPassPrice(date, passType, ageCategory);
      totalPrice = price;
    } else if (skiPassCategory === 'multi-day') {
      price = getMultiDayPrice(date, passType, multiDays);
      totalPrice = price;
    } else if (skiPassCategory === 'seasonal') {
      price = getSeasonalPrice(passType, ageCategory);
      totalPrice = price;
    }
  } else if (resort === 'rosa-khutor') {
    // Роза Хутор поддерживает только однодневные ски-пассы
    price = getRosaHutorPrice(date, rosaPassType);
    totalPrice = price;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-500/5 via-background to-sky-400/5 border-2 border-blue-500/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold text-foreground">Калькулятор ски-пассов</h3>
          <p className="text-sm text-muted-foreground">Рассчитайте стоимость абонемента</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Выбор курорта */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Курорт</Label>
          <RadioGroup value={resort} onValueChange={(value) => setResort(value as Resort)}>
            {(Object.keys(resortNames) as Resort[]).map((res) => (
              <div
                key={res}
                className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <RadioGroupItem value={res} id={res} />
                <Label htmlFor={res} className="flex-1 cursor-pointer font-semibold">
                  {resortNames[res]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Тип абонемента (Tabs) - только для Газпрома */}
        {resort === 'gazprom' ? (
          <Tabs value={skiPassCategory} onValueChange={(value) => setSkiPassCategory(value as SkiPassCategory)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single-day">Однодневные</TabsTrigger>
              <TabsTrigger value="multi-day">Многодневные</TabsTrigger>
              <TabsTrigger value="seasonal">Сезонные</TabsTrigger>
            </TabsList>

            {/* Контент для каждого типа */}
            <TabsContent value="single-day" className="space-y-6 mt-6">
              {renderPassTypeSelector()}
              {renderAgeCategorySelector()}
              {renderDateSelector()}
            </TabsContent>

            <TabsContent value="multi-day" className="space-y-6 mt-6">
              {renderPassTypeSelector()}
              {renderDateSelector()}
              {renderMultiDaysSelector()}
            </TabsContent>

            <TabsContent value="seasonal" className="space-y-6 mt-6">
              {renderPassTypeSelector()}
              {renderAgeCategorySelector()}
            </TabsContent>
          </Tabs>
        ) : (
          /* Роза Хутор - только однодневные */
          <div className="space-y-6">
            {renderRosaPassTypeSelector()}
            {renderDateSelector()}
          </div>
        )}

        {/* Итоговая стоимость */}
        {renderPriceDisplay()}

        {/* Информация о периодах */}
        {renderPeriodInfo()}
      </div>
    </Card>
  );

  // Вспомогательные функции рендера
  function renderRosaPassTypeSelector() {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          Тип ски-пасса
        </Label>
        <RadioGroup value={rosaPassType} onValueChange={(value) => setRosaPassType(value as RosaPassType)}>
          {(Object.keys(rosaPassTypeNames) as RosaPassType[]).map((type) => (
            <div
              key={type}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={type} id={`rosa-${type}`} className="mt-1" />
              <Label htmlFor={`rosa-${type}`} className="flex-1 cursor-pointer">
                <div className="font-semibold text-sm">{rosaPassTypeNames[type]}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {rosaPassTypeDescriptions[type]}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  function renderPassTypeSelector() {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          Тип ски-пасса
        </Label>
        <RadioGroup value={passType} onValueChange={(value) => setPassType(value as PassType)}>
          {(Object.keys(passTypeNames) as PassType[]).filter(type => type !== 'cross-country').map((type) => (
            <div
              key={type}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <RadioGroupItem value={type} id={type} className="mt-1" />
              <Label htmlFor={type} className="flex-1 cursor-pointer">
                <div className="font-semibold text-sm">{passTypeNames[type]}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {passTypeDescriptions[type]}
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  function renderAgeCategorySelector() {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Категория</Label>
        <Select value={ageCategory} onValueChange={(value) => setAgeCategory(value as AgeCategory)}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ageCategoryNames) as AgeCategory[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {ageCategoryNames[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          До 6 лет - бесплатно
        </p>
      </div>
    );
  }

  function renderDateSelector() {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <CalendarIcon className="w-4 h-4" />
          {skiPassCategory === 'single-day' ? 'Дата катания' : 'Дата начала действия'}
        </Label>
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
              onSelect={(newDate) => newDate && setDate(newDate)}
              initialFocus
              locale={ru}
            />
          </PopoverContent>
        </Popover>
        {period && (
          <div className="text-sm p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <span className="font-medium">Период:</span>{' '}
            {format(new Date(period.start), 'd.MM.yy', { locale: ru })} -{' '}
            {format(new Date(period.end), 'd.MM.yy', { locale: ru })}
          </div>
        )}
      </div>
    );
  }

  function renderMultiDaysSelector() {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Количество дней</Label>
        <Select value={multiDays.toString()} onValueChange={(value) => setMultiDays(parseInt(value))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[2, 3, 4, 5, 6, 7].map((d) => (
              <SelectItem key={d} value={d.toString()}>
                {d} {d < 5 ? 'дня' : 'дней'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Абонемент действует в любые {multiDays} {multiDays < 5 ? 'дня' : 'дней'} в период
        </p>
      </div>
    );
  }

  function renderPriceDisplay() {
    if (!price) {
      return (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          {resort === 'gazprom' && skiPassCategory === 'seasonal' 
            ? 'Для выбранного типа пасса нет доступных тарифов.'
            : 'Для выбранной даты нет доступных тарифов. Пожалуйста, выберите дату в сезоне 2026 года.'}
        </div>
      );
    }

    return (
      <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg text-white">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">
              {resort === 'gazprom' && skiPassCategory === 'single-day' && 'Стоимость за день:'}
              {resort === 'gazprom' && skiPassCategory === 'multi-day' && `Стоимость за ${multiDays} ${multiDays < 5 ? 'дня' : 'дней'}:`}
              {resort === 'gazprom' && skiPassCategory === 'seasonal' && 'Стоимость сезонного абонемента:'}
              {resort === 'rosa-khutor' && 'Стоимость за день:'}
            </span>
            <span className="text-2xl font-bold">
              {price.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="text-xs opacity-75 pt-2">
            <p>✓ Включает канатные дороги</p>
            <p>✓ Доступ к трассам согласно типу пасса</p>
            {resort === 'gazprom' && passType === 'evening-laura' && <p>✓ Вечернее катание 17:00-22:00</p>}
            {resort === 'gazprom' && skiPassCategory === 'multi-day' && <p>✓ Действует в любые {multiDays} {multiDays < 5 ? 'дня' : 'дней'} в период</p>}
            {resort === 'gazprom' && skiPassCategory === 'seasonal' && <p>✓ Безлимитное катание весь сезон</p>}
            {resort === 'rosa-khutor' && rosaPassType === 'evening' && <p>✓ Вечернее катание 19:00-23:00</p>}
            {resort === 'rosa-khutor' && rosaPassType === 'standard' && <p>✓ Смарт-карта включена в стоимость</p>}
            {resort === 'rosa-khutor' && rosaPassType === 'fast-track' && <p>✓ Быстрый проход на все подъемники</p>}
          </div>
        </div>
      </div>
    );
  }

  function renderPeriodInfo() {
    // Для Газпром - показываем только для однодневных и многодневных
    if (resort === 'gazprom' && (skiPassCategory === 'single-day' || skiPassCategory === 'multi-day')) {
      return (
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3 text-sm">Ценовые периоды сезона 2025-2026:</h4>
          <div className="space-y-2">
            {periodInfo.map((info, idx) => (
              <div key={idx} className="text-xs p-2 bg-muted/50 rounded">
                <span className="font-medium">{info.period}</span>
                <span className="text-muted-foreground ml-2">— {info.description}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Для Роза Хутор - показываем периоды
    if (resort === 'rosa-khutor') {
      return (
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-3 text-sm">Ценовые периоды сезона 2025-2026:</h4>
          <div className="space-y-2">
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">01.01.26 - 31.01.26</span>
              <span className="text-muted-foreground ml-2">— Начало сезона</span>
            </div>
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">01.02.26 - 19.02.26</span>
              <span className="text-muted-foreground ml-2">— Высокий сезон</span>
            </div>
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">20.02.26 - 23.02.26</span>
              <span className="text-muted-foreground ml-2">— Пиковые выходные</span>
            </div>
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">24.02.26 - 09.03.26</span>
              <span className="text-muted-foreground ml-2">— Высокий сезон</span>
            </div>
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">10.03.26 - 31.03.26</span>
              <span className="text-muted-foreground ml-2">— Весеннее катание</span>
            </div>
            <div className="text-xs p-2 bg-muted/50 rounded">
              <span className="font-medium">01.04.26 - 12.04.26</span>
              <span className="text-muted-foreground ml-2">— Закрытие сезона</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
