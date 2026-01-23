// Типы для категорий возраста
export type AgeCategory = 'adult' | 'youth' | 'child';

// Типы склонов
export type PassType = 'full' | 'laura' | 'alpika' | 'evening-laura' | 'cross-country';

// Периоды действия
export interface PricePeriod {
  start: string;
  end: string;
  prices: {
    [key in PassType]?: {
      adult: number;
      youth: number;
      child: number;
    };
  };
}

// Структура данных для ски-пассов Газпром
export const gazpromSkiPassPricing: PricePeriod[] = [
  {
    start: '2026-01-12',
    end: '2026-01-31',
    prices: {
      full: { adult: 4100, youth: 3600, child: 2550 },
      alpika: { adult: 2550, youth: 2050, child: 1550 },
      laura: { adult: 3100, youth: 2550, child: 2050 },
      'evening-laura': { adult: 2550, youth: 2050, child: 1550 }
    }
  },
  {
    start: '2026-02-01',
    end: '2026-03-15',
    prices: {
      full: { adult: 4600, youth: 4100, child: 3100 },
      alpika: { adult: 3100, youth: 2550, child: 2050 },
      laura: { adult: 3600, youth: 3100, child: 2550 },
      'evening-laura': { adult: 3100, youth: 2550, child: 2050 }
    }
  },
  {
    start: '2026-03-16',
    end: '2026-03-31',
    prices: {
      full: { adult: 4100, youth: 3600, child: 2550 },
      alpika: { adult: 2550, youth: 2050, child: 1550 },
      laura: { adult: 3100, youth: 2550, child: 2050 },
      'evening-laura': { adult: 2550, youth: 2050, child: 1550 }
    }
  },
  {
    start: '2026-04-01',
    end: '2026-05-10',
    prices: {
      full: { adult: 3600, youth: 3100, child: 2050 },
      alpika: { adult: 2050, youth: 1550, child: 1050 },
      laura: { adult: 2550, youth: 2050, child: 1550 },
      'evening-laura': { adult: 2050, youth: 1550, child: 1050 }
    }
  }
];

// Названия типов пасс
export const passTypeNames: Record<PassType, string> = {
  full: 'Газпром Поляна (Лаура + Альпика)',
  laura: 'Склон Лаура',
  alpika: 'Склон Альпика',
  'evening-laura': 'Вечерняя Лаура',
  'cross-country': 'Беговые лыжи'
};

// Описания типов пасс
export const passTypeDescriptions: Record<PassType, string> = {
  full: 'Дневное катание на обоих склонах: Лаура и Альпика',
  laura: 'Дневное катание на склоне Лаура',
  alpika: 'Дневное катание на склоне Альпика',
  'evening-laura': 'Вечернее катание на склоне Лаура (17:00-22:00)',
  'cross-country': 'Беговые лыжи в зоне ЛБК Лаура'
};

// Названия категорий возраста
export const ageCategoryNames: Record<AgeCategory, string> = {
  adult: 'Взрослый (26+ лет)',
  youth: 'Молодежный (15-25 лет)',
  child: 'Детский (7-14 лет)'
};

// Функция для получения цены на основе даты, типа пасса и возрастной категории
export function getSkiPassPrice(
  date: Date,
  passType: PassType,
  ageCategory: AgeCategory
): number | null {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const period = gazpromSkiPassPricing.find(
    (p) => dateStr >= p.start && dateStr <= p.end
  );

  if (!period || !period.prices[passType]) {
    return null;
  }

  return period.prices[passType]![ageCategory];
}

// Функция для получения периода по дате
export function getPeriodByDate(date: Date): PricePeriod | null {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return (
    gazpromSkiPassPricing.find((p) => dateStr >= p.start && dateStr <= p.end) ||
    null
  );
}

// Информация о периодах для отображения
export const periodInfo = [
  { period: '12.01.26 - 31.01.26', description: 'Середина января' },
  { period: '01.02.26 - 15.03.26', description: 'Пиковый сезон' },
  { period: '16.03.26 - 31.03.26', description: 'Весеннее катание' },
  { period: '01.04.26 - 10.05.26', description: 'Закрытие сезона' }
];
