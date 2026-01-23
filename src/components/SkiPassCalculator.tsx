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
  type SkiPassCategory,
  skiPassCategoryNames,
  skiPassCategoryDescriptions,
  passTypeNames,
  passTypeDescriptions,
  ageCategoryNames,
  getSkiPassPrice,
  getMultiDayPrice,
  getSeasonalPrice,
  getPeriodByDate,
  periodInfo
} from "@/data/skiPassPricing";

export function SkiPassCalculator() {
  const [skiPassCategory, setSkiPassCategory] = useState<SkiPassCategory>('single-day');
  const [passType, setPassType] = useState<PassType>('full');
  const [ageCategory, setAgeCategory] = useState<AgeCategory>('adult');
  const [date, setDate] = useState<Date>(new Date('2026-02-01'));
  const [multiDays, setMultiDays] = useState<number>(2);

  const period = getPeriodByDate(date);
  
  // Расчет цены в зависимости от типа абонемента
  let price: number | null = null;
  let totalPrice: number | null = null;
  
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
        {/* Тип абонемента (Tabs) */}
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

        {/* Итоговая стоимость */}
        {renderPriceDisplay()}

        {/* Информация о периодах - только для однодневных и многодневных */}
        {(skiPassCategory === 'single-day' || skiPassCategory === 'multi-day') && renderPeriodInfo()}
      </div>
    </Card>
  );

  // Вспомогательные функции рендера
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
          {skiPassCategory === 'seasonal' 
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
              {skiPassCategory === 'single-day' && 'Стоимость за день:'}
              {skiPassCategory === 'multi-day' && `Стоимость за ${multiDays} ${multiDays < 5 ? 'дня' : 'дней'}:`}
              {skiPassCategory === 'seasonal' && 'Стоимость сезонного абонемента:'}
            </span>
            <span className="text-2xl font-bold">
              {price.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="text-xs opacity-75 pt-2">
            <p>✓ Включает канатные дороги</p>
            <p>✓ Доступ к трассам согласно типу пасса</p>
            {passType === 'evening-laura' && <p>✓ Вечернее катание 17:00-22:00</p>}
            {skiPassCategory === 'multi-day' && <p>✓ Действует в любые {multiDays} {multiDays < 5 ? 'дня' : 'дней'} в период</p>}
            {skiPassCategory === 'seasonal' && <p>✓ Безлимитное катание весь сезон</p>}
          </div>
        </div>
      </div>
    );
  }

  function renderPeriodInfo() {
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
}
