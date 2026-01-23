// Типы для категорий возраста
export type AgeCategory = 'adult' | 'youth' | 'child';

// Типы ски-пассов
export type SkiPassCategory = 'single-day' | 'multi-day' | 'seasonal';

// Типы курортов
export type Resort = 'gazprom' | 'rosa-khutor' | 'krasnaya-polyana';

// Типы склонов для Газпром
export type PassType = 'full' | 'laura' | 'alpika' | 'evening-laura' | 'cross-country';

// Типы ски-пассов для Роза Хутор
export type RosaPassType = 'standard' | 'training' | 'fast-track' | 'evening' | 'seasonal' | 'annual';

// Типы ски-пассов для Красной Поляны
export type KrasnayaPolyanaPassType = 'day' | 'evening' | 'fast-track' | 'ya-sochinets' | 'family' | 'baby' | 'seasonal' | 'seasonal-evening';

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

// Названия курортов
export const resortNames: Record<Resort, string> = {
  gazprom: 'Газпром (Лаура + Альпика)',
  'rosa-khutor': 'Роза Хутор',
  'krasnaya-polyana': 'Красная Поляна'
};

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

// Названия категорий ски-пассов
export const skiPassCategoryNames: Record<SkiPassCategory, string> = {
  'single-day': 'Однодневные абонементы',
  'multi-day': 'Многодневные абонементы',
  'seasonal': 'Сезонные абонементы'
};

export const skiPassCategoryDescriptions: Record<SkiPassCategory, string> = {
  'single-day': 'Ски-пасс на 1 день катания',
  'multi-day': 'Ски-пасс на 2-7 дней (любые дни в период действия)',
  'seasonal': 'Безлимитное катание в течение сезона 2025-2026'
};

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

// Функция для получения цены многодневного абонемента
export function getMultiDayPrice(
  date: Date,
  passType: PassType,
  days: number
): number | null {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const pass = multiDayPasses.find(
    (p) =>
      p.passType === passType &&
      p.days === days &&
      dateStr >= p.period.start &&
      dateStr <= p.period.end
  );

  return pass ? pass.price : null;
}

// Функция для получения цены сезонного абонемента
export function getSeasonalPrice(
  passType: PassType,
  ageCategory: AgeCategory
): number | null {
  if (passType === 'cross-country') {
    return ageCategory === 'adult' || ageCategory === 'youth' ? 20400 : null;
  }

  const pass = seasonalPasses.find((p) => p.passType === passType);
  return pass ? pass.prices[ageCategory] : null;
}

// Информация о периодах для отображения
export const periodInfo = [
  { period: '12.01.26 - 31.01.26', description: 'Середина января' },
  { period: '01.02.26 - 15.03.26', description: 'Пиковый сезон' },
  { period: '16.03.26 - 31.03.26', description: 'Весеннее катание' },
  { period: '01.04.26 - 10.05.26', description: 'Закрытие сезона' }
];

// Данные для сезонных абонементов (фиксированная цена)
export interface SeasonalPassPrice {
  passType: Exclude<PassType, 'cross-country'>;
  prices: {
    adult: number;
    youth: number;
    child: number;
  };
}

export const seasonalPasses: SeasonalPassPrice[] = [
  {
    passType: 'full',
    prices: { adult: 66300, youth: 56100, child: 30600 }
  },
  {
    passType: 'laura',
    prices: { adult: 45900, youth: 40800, child: 25500 }
  },
  {
    passType: 'alpika',
    prices: { adult: 30600, youth: 25500, child: 15300 }
  },
  {
    passType: 'evening-laura',
    prices: { adult: 35700, youth: 30600, child: 20400 }
  }
];

// Данные для многодневных абонементов  
export interface MultiDayPrice {
  days: number;
  period: { start: string; end: string };
  passType: Exclude<PassType, 'cross-country'>;
  price: number; // одинаковая цена для всех возрастных категорий в данных
}

export const multiDayPasses: MultiDayPrice[] = [
  // Газпром Поляна (full) - Период 12.01-31.01
  { days: 2, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 6950 },
  { days: 3, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 10450 },
  { days: 4, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 13900 },
  { days: 5, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 17350 },
  { days: 6, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 20850 },
  { days: 7, period: { start: '2026-01-12', end: '2026-01-31' }, passType: 'full', price: 24300 },
  // Газпром Поляна (full) - Период 01.02-15.03
  { days: 2, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 7850 },
  { days: 3, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 11750 },
  { days: 4, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 15650 },
  { days: 5, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 19550 },
  { days: 6, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 23450 },
  { days: 7, period: { start: '2026-02-01', end: '2026-03-15' }, passType: 'full', price: 27350 },
  // Газпром Поляна (full) - Период 16.03-31.03
  { days: 2, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 6950 },
  { days: 3, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 10450 },
  { days: 4, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 13900 },
  { days: 5, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 17350 },
  { days: 6, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 20850 },
  { days: 7, period: { start: '2026-03-16', end: '2026-03-31' }, passType: 'full', price: 24300 },
  // Газпром Поляна (full) - Период 01.04-10.05
  { days: 2, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 6100 },
  { days: 3, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 9150 },
  { days: 4, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 12150 },
  { days: 5, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 15200 },
  { days: 6, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 18250 },
  { days: 7, period: { start: '2026-04-01', end: '2026-05-10' }, passType: 'full', price: 21300 },
];

// ===============================
// Данные для курорта Роза Хутор
// ===============================

// Структура данных для ски-пассов Роза Хутор
export interface RosaPricePeriod {
  start: string;
  end: string;
  prices: {
    [key in RosaPassType]?: {
      adult: number;
      youth?: number;
      child?: number;
    };
  };
}

export const rosaHutorSkiPassPricing: RosaPricePeriod[] = [
  {
    start: '2026-01-01',
    end: '2026-01-31',
    prices: {
      standard: { adult: 5550 },
      training: { adult: 3450 },
      'fast-track': { adult: 16000 },
      evening: { adult: 2900 }
    }
  },
  {
    start: '2026-02-01',
    end: '2026-02-19',
    prices: {
      standard: { adult: 6800 },
      training: { adult: 4200 },
      'fast-track': { adult: 16000 }
    }
  },
  {
    start: '2026-02-20',
    end: '2026-02-23',
    prices: {
      standard: { adult: 6950 },
      'fast-track': { adult: 21500 }
    }
  },
  {
    start: '2026-02-24',
    end: '2026-03-09',
    prices: {
      standard: { adult: 6800 },
      training: { adult: 4200 },
      'fast-track': { adult: 16000 }
    }
  },
  {
    start: '2026-03-10',
    end: '2026-03-31',
    prices: {
      standard: { adult: 5550 },
      training: { adult: 3450 },
      'fast-track': { adult: 16000 }
    }
  },
  {
    start: '2026-04-01',
    end: '2026-04-12',
    prices: {
      standard: { adult: 5190 },
      training: { adult: 3450 },
      'fast-track': { adult: 16000 }
    }
  }
];

// Названия типов пасс Роза Хутор
export const rosaPassTypeNames: Record<RosaPassType, string> = {
  standard: 'Стандартный ски-пасс',
  training: 'Учебный ски-пасс',
  'fast-track': 'Ски-пасс + Фаст-трек «Приоритет»',
  evening: 'Вечерний ски-пасс',
  seasonal: 'Сезонный ски-пасс 2025/2026',
  annual: 'Годовой ски-пасс 2025/2026'
};

// Описания типов пасс Роза Хутор
export const rosaPassTypeDescriptions: Record<RosaPassType, string> = {
  standard: 'Доступ на все подъемники курорта (кроме Тироль), дневное катание',
  training: 'Учебный склон: 1 подъем на «Олимпия» + неограниченно на «Шале», «Ювента»',
  'fast-track': 'Стандартный ски-пасс + быстрый проход на все подъемники',
  evening: 'Вечернее катание 19:00-23:00 на учебном склоне',
  seasonal: 'Безлимитное катание весь горнолыжный сезон 2025/26 (дневное + вечернее)',
  annual: 'Безлимитное катание: горнолыжный сезон 2025/26 + летний сезон 2026'
};

// Функция для получения цены Роза Хутор
export function getRosaHutorPrice(
  date: Date,
  passType: RosaPassType
): number | null {
  // Для сезонных и годовых пассов возвращаем фиксированную цену
  if (passType === 'seasonal') return 79300;
  if (passType === 'annual') return 91400;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  const period = rosaHutorSkiPassPricing.find(
    (p) => dateStr >= p.start && dateStr <= p.end
  );

  if (!period || !period.prices[passType]) {
    return null;
  }

  return period.prices[passType]!.adult;
}

// Функция для получения периода Роза Хутор по дате
export function getRosaPeriodByDate(date: Date): RosaPricePeriod | null {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  return (
    rosaHutorSkiPassPricing.find((p) => dateStr >= p.start && dateStr <= p.end) ||
    null
  );
}

// ===============================
// Данные для курорта Красная Поляна
// ===============================

// Названия типов пасс Красная Поляна
export const krasnayaPolyanaPassTypeNames: Record<KrasnayaPolyanaPassType, string> = {
  day: 'Дневной',
  evening: 'Вечерний',
  'fast-track': 'Фаст-трек',
  'ya-sochinets': 'Я-Сочинец',
  family: 'Семейный',
  baby: 'Малыш ски-пасс',
  seasonal: 'Сезонный',
  'seasonal-evening': 'Сезонный вечерний'
};

// Описания типов пасс Красная Поляна
export const krasnayaPolyanaPassTypeDescriptions: Record<KrasnayaPolyanaPassType, string> = {
  day: 'Дневное катание 08:00-16:30. Действует в выбранные дни периода.',
  evening: 'Вечернее катание 16:30-22:00. Действует в выбранные дни периода.',
  'fast-track': 'Проход на канатные дороги через выделенный турникет. Любые дни.',
  'ya-sochinets': 'Специальный тариф для жителей Сочи. Действует в день покупки.',
  family: 'Семейный тариф: 2 взрослых + 2 ребёнка. Действует в день покупки.',
  baby: 'Малыш ски-пасс. Денежный, действует в день покупки, доступ через фаст-трек.',
  seasonal: 'Именной. Неограниченное катание весь сезон 08:00-16:30 и 18:30-22:00.',
  'seasonal-evening': 'Именной вечерний. Неограниченное катание весь сезон 18:30-22:00.'
};

// Структура данных для ски-пассов Красная Поляна (период 12.01.26-31.01.26)
export interface KrasnayaPolyanaPricing {
  passType: KrasnayaPolyanaPassType;
  days?: number; // для многодневных
  prices: {
    adult: number; // "Малыш" на изображении - это взрослый с 15 лет
    child?: number; // Взрослый - это дети 7-14 лет
  };
}

export const krasnayaPolyanaPricing: KrasnayaPolyanaPricing[] = [
  // Однодневные дневные
  { passType: 'day', days: 1, prices: { adult: 4100, child: 2500 } },
  // Многодневные дневные
  { passType: 'day', days: 2, prices: { adult: 7400, child: 4500 } },
  { passType: 'day', days: 3, prices: { adult: 11100, child: 6800 } },
  { passType: 'day', days: 5, prices: { adult: 17400, child: 10600 } },
  
  // Однодневные вечерние
  { passType: 'evening', days: 1, prices: { adult: 2500, child: 1700 } },
  // Многодневные вечерние
  { passType: 'evening', days: 2, prices: { adult: 4800, child: 3200 } },
  { passType: 'evening', days: 3, prices: { adult: 6800, child: 4600 } },
  { passType: 'evening', days: 5, prices: { adult: 10600, child: 7200 } },
  
  // Фаст-трек
  { passType: 'fast-track', days: 1, prices: { adult: 8200, child: 4900 } },
  { passType: 'fast-track', days: 2, prices: { adult: 14800, child: 8800 } },
  { passType: 'fast-track', days: 3, prices: { adult: 20900, child: 12500 } },
  { passType: 'fast-track', days: 5, prices: { adult: 32800, child: 19600 } },
  
  // Специальные тарифы
  { passType: 'ya-sochinets', days: 1, prices: { adult: 3300, child: 2000 } },
  { passType: 'family', days: 1, prices: { adult: 10700 } }, // 2 взрослых + 2 ребёнка
  
  // Малыш ски-пасс (денежный)
  { passType: 'baby', days: 1, prices: { adult: 1 } },
  { passType: 'baby', days: 3, prices: { adult: 300 } },
  { passType: 'baby', days: 5, prices: { adult: 500 } },
  
  // Сезонные
  { passType: 'seasonal', prices: { adult: 65500, child: 30000 } },
  { passType: 'seasonal-evening', prices: { adult: 32750, child: 15000 } }
];

// Функция для получения цены Красная Поляна
export function getKrasnayaPolyanaPrice(
  passType: KrasnayaPolyanaPassType,
  days: number,
  ageCategory: AgeCategory
): number | null {
  const pass = krasnayaPolyanaPricing.find(
    (p) => p.passType === passType && p.days === days
  );
  
  if (!pass) return null;
  
  if (ageCategory === 'child' && pass.prices.child !== undefined) {
    return pass.prices.child;
  }
  
  return pass.prices.adult;
}
