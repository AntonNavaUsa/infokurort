export type Season = 'base' | 'peak' | 'low' | 'high' | 'winter';
export type Resort = 'roza-hutor' | 'krasnaya-polyana' | 'gazprom';

export interface SeasonDates {
  resort: Resort;
  seasons: Array<{
    season: Season;
    ranges: Array<{ start: string; end: string }>;
  }>;
}

export const seasonDates: SeasonDates[] = [
  {
    resort: 'roza-hutor',
    seasons: [
      {
        season: 'base',
        ranges: [
          { start: '2026-01-12', end: '2026-02-05' },
          { start: '2026-03-10', end: '2026-04-30' }
        ]
      },
      {
        season: 'peak',
        ranges: [
          { start: '2025-12-26', end: '2026-01-11' },
          { start: '2026-02-06', end: '2026-03-09' }
        ]
      }
    ]
  },
  {
    resort: 'krasnaya-polyana',
    seasons: [
      {
        season: 'low',
        ranges: [
          { start: '2026-04-01', end: '2026-05-10' }
        ]
      },
      {
        season: 'high',
        ranges: [
          { start: '2026-01-12', end: '2026-01-31' },
          { start: '2026-03-10', end: '2026-03-31' }
        ]
      },
      {
        season: 'peak',
        ranges: [
          { start: '2025-12-26', end: '2026-01-11' },
          { start: '2026-02-01', end: '2026-03-09' }
        ]
      }
    ]
  },
  {
    resort: 'gazprom',
    seasons: [
      {
        season: 'winter',
        ranges: [
          { start: '2025-12-01', end: '2025-12-26' },
          { start: '2026-01-12', end: '2026-02-13' },
          { start: '2026-03-09', end: '2026-04-30' }
        ]
      },
      {
        season: 'peak',
        ranges: [
          { start: '2025-12-27', end: '2026-01-11' },
          { start: '2026-02-14', end: '2026-03-08' }
        ]
      }
    ]
  }
];

export function getSeasonByDate(date: Date, resort: Resort): Season {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  
  const resortData = seasonDates.find(r => r.resort === resort);
  if (!resortData) return 'base';

  for (const seasonData of resortData.seasons) {
    for (const range of seasonData.ranges) {
      if (dateStr >= range.start && dateStr <= range.end) {
        return seasonData.season;
      }
    }
  }
  
  if (resort === 'krasnaya-polyana') return 'low';
  if (resort === 'gazprom') return 'winter';
  return 'base';
}

export interface SkiSchoolPrice {
  id: string;
  resort: Resort;
  category: 'individual' | 'group-adult' | 'group-child';
  type: string;
  participants: number | string;
  duration: string;
  priceBase?: number;
  pricePeak?: number;
  priceLow?: number;
  priceHigh?: number;
  priceWinter?: number;
  description?: string;
  ageRange?: string;
  equipment?: boolean;
  notes?: string;
  package?: 'single' | '3-days' | '5-days';
}

export const skiSchoolPricing: SkiSchoolPrice[] = [
  // ========== РОЗА ХУТОР ==========
  // ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ
  {
    id: 'rh-ind-1h-1p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '1 час',
    priceBase: 6000,
    pricePeak: 6800,
    description: 'Занятие для одного человека'
  },
  {
    id: 'rh-ind-2h-1p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '2 часа',
    priceBase: 10700,
    pricePeak: 11900,
    description: 'Занятие для одного человека'
  },
  {
    id: 'rh-ind-3h-1p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '3 часа',
    priceBase: 15500,
    pricePeak: 17100,
    description: 'Занятие для одного человека'
  },
  {
    id: 'rh-ind-2h-2p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 2,
    duration: '2 часа',
    priceBase: 13700,
    pricePeak: 15200,
    description: 'Занятие для двух человек'
  },
  {
    id: 'rh-ind-3h-2p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 2,
    duration: '3 часа',
    priceBase: 20500,
    pricePeak: 22700,
    description: 'Занятие для двух человек'
  },
  {
    id: 'rh-ind-2h-3p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'standard',
    participants: 3,
    duration: '2 часа',
    priceBase: 15800,
    pricePeak: 17500,
    description: 'Занятие для трёх человек'
  },
  {
    id: 'rh-ind-vip-2h-1p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'vip',
    participants: 1,
    duration: '2 часа',
    priceBase: 14000,
    pricePeak: 15700,
    description: 'ВИП занятие: совершенствование техники, карвинг, фристайл'
  },
  {
    id: 'rh-ind-guide-6h-1p',
    resort: 'roza-hutor',
    category: 'individual',
    type: 'guide',
    participants: 1,
    duration: '6 часов',
    priceBase: 34000,
    pricePeak: 37900,
    description: 'Личный гид',
    notes: 'Каждый последующий гость +11000₽'
  },

  // ГРУППОВЫЕ ЗАНЯТИЯ - ВЗРОСЛЫЕ (13+)
  {
    id: 'rh-group-adult-2h-afternoon',
    resort: 'roza-hutor',
    category: 'group-adult',
    type: 'beginner',
    participants: 'до 10',
    duration: '2 часа',
    priceBase: 4300,
    pricePeak: 4800,
    description: 'Группы начального уровня (14:00 или 19:00)',
    ageRange: '13+'
  },
  {
    id: 'rh-group-adult-2h-morning',
    resort: 'roza-hutor',
    category: 'group-adult',
    type: 'beginner',
    participants: 'до 10',
    duration: '2 часа',
    priceBase: 5000,
    pricePeak: 5600,
    description: 'Группы начального уровня (09:00)',
    ageRange: '13+'
  },

  // ДЕТСКИЙ КЛУБ ЕГОРКА
  {
    id: 'rh-kids-snowflakes',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'snowflakes',
    participants: 'группа',
    duration: '45 минут',
    priceBase: 3600,
    pricePeak: 4000,
    description: 'Снежинки',
    ageRange: '3-5 лет',
    equipment: true
  },
  {
    id: 'rh-kids-reactive',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'reactive',
    participants: 'группа',
    duration: '1 час 40 минут',
    priceBase: 6700,
    pricePeak: 7400,
    description: 'Реактивные снежинки',
    ageRange: '4-5 лет',
    equipment: true
  },
  {
    id: 'rh-kids-champions',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'champions',
    participants: 'группа',
    duration: '1ч 40м + 1ч игры',
    priceBase: 8000,
    pricePeak: 8900,
    description: 'Школа Чемпионов',
    ageRange: '5-9 лет',
    equipment: true
  },
  {
    id: 'rh-kids-academy',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'academy',
    participants: 'группа',
    duration: '3 часа',
    priceBase: 8000,
    pricePeak: 8900,
    description: 'Горная академия',
    ageRange: '7-13 лет',
    equipment: false
  },
  {
    id: 'rh-kids-camp-3d',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'camp',
    participants: 'группа',
    duration: '3 дня',
    priceBase: 43800,
    pricePeak: 43800,
    description: 'Роза Кидс Кэмп 3 дня',
    ageRange: '7-13 лет',
    equipment: false,
    notes: '6 часов/день'
  },
  {
    id: 'rh-kids-camp-5d',
    resort: 'roza-hutor',
    category: 'group-child',
    type: 'camp',
    participants: 'группа',
    duration: '5 дней',
    priceBase: 71000,
    pricePeak: 71000,
    description: 'Роза Кидс Кэмп 5 дней',
    ageRange: '7-13 лет',
    equipment: false,
    notes: '6 часов/день'
  },

  // ========== КРАСНАЯ ПОЛЯНА ==========
  // ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ
  {
    id: 'kp-ind-1h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '1 час',
    priceLow: 4800,
    priceHigh: 5500,
    pricePeak: 6000,
    description: 'Индивидуальное занятие'
  },
  {
    id: 'kp-ind-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '2 часа',
    priceLow: 8500,
    priceHigh: 9300,
    pricePeak: 10500,
    description: 'Индивидуальное занятие'
  },
  {
    id: 'kp-ind-3d-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'package',
    participants: 1,
    duration: '3 дня по 2 часа',
    priceLow: 22950,
    priceHigh: 27900,
    pricePeak: 31500,
    description: 'Индивидуальное занятие'
  },
  {
    id: 'kp-ind-5d-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'package',
    participants: 1,
    duration: '5 дней по 2 часа',
    priceLow: 38250,
    priceHigh: 37200,
    pricePeak: 43000,
    description: 'Индивидуальное занятие'
  },

  // ВЕЧЕРНИЕ ИНДИВИДУАЛЬНЫЕ
  {
    id: 'kp-ind-evening-1h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'evening',
    participants: 1,
    duration: '1 час',
    priceLow: 4080,
    priceHigh: 4400,
    pricePeak: 4800,
    description: 'Вечерний тариф'
  },
  {
    id: 'kp-ind-evening-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'evening',
    participants: 1,
    duration: '2 часа',
    priceLow: 7225,
    priceHigh: 7440,
    pricePeak: 8400,
    description: 'Вечерний тариф'
  },

  // ПАРНЫЕ ПРОГРАММЫ
  {
    id: 'kp-pair-1h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'pair',
    participants: 2,
    duration: '1 час',
    priceLow: 6500,
    priceHigh: 7500,
    pricePeak: 9000,
    description: 'Парное занятие для 2 человек'
  },
  {
    id: 'kp-pair-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'pair',
    participants: 2,
    duration: '2 часа',
    priceLow: 12000,
    priceHigh: 13000,
    pricePeak: 15000,
    description: 'Парное занятие для 2 человек'
  },
  {
    id: 'kp-pair-3d-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'pair',
    participants: 2,
    duration: '3 дня по 2 часа',
    priceLow: 28000,
    priceHigh: 31200,
    pricePeak: 38250,
    description: 'Парное занятие для 2 человек'
  },
  {
    id: 'kp-pair-5d-2h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'pair',
    participants: 2,
    duration: '5 дней по 2 часа',
    priceLow: 41000,
    priceHigh: 48750,
    pricePeak: 56250,
    description: 'Парное занятие для 2 человек'
  },

  // ГРУППОВЫЕ ПРОГРАММЫ
  {
    id: 'kp-group-learn-3h',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'learn',
    participants: '3-6 человек',
    duration: '3 часа',
    priceLow: 5250,
    priceHigh: 5670,
    pricePeak: 6300,
    description: 'Учись катать (10:00, 11:00)',
    notes: 'Не действует 27.12.25-11.01.26. Скидки: 20% на ски-пасс, 15% на прокат'
  },
  {
    id: 'kp-group-team-1h',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'team',
    participants: '3-5 человек',
    duration: '1 час',
    priceLow: 2500,
    priceHigh: 2700,
    pricePeak: 3000,
    description: 'Команда (закрытые группы)',
    notes: 'Цена за 1 час, минимум 2 часа'
  },

  // ПЕРСОНАЛЬНЫЙ ГИД
  {
    id: 'kp-guide-3h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'guide',
    participants: 1,
    duration: '3 часа',
    priceLow: 19200,
    priceHigh: 22000,
    pricePeak: 24000,
    description: 'Персональный гид',
    notes: 'Скидка 40% на каждого следующего'
  },
  {
    id: 'kp-guide-4h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'guide',
    participants: 1,
    duration: '4 часа',
    priceLow: 24000,
    priceHigh: 27500,
    pricePeak: 30000,
    description: 'Персональный гид',
    notes: 'Скидка 40% на каждого следующего'
  },
  {
    id: 'kp-guide-6h',
    resort: 'krasnaya-polyana',
    category: 'individual',
    type: 'guide',
    participants: 1,
    duration: '6 часов',
    priceLow: 34560,
    priceHigh: 39600,
    pricePeak: 43200,
    description: 'Персональный гид',
    notes: 'Скидка 40% на каждого следующего'
  },

  // КУРСЫ "ПРОГРЕСС"
  {
    id: 'kp-course-beginner',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'course',
    participants: '4-8 человек',
    duration: '3 дня по 5 часов',
    priceLow: 40000,
    priceHigh: 40000,
    pricePeak: 40000,
    description: 'Курс для новичков',
    notes: '10:00-15:00 вт-чт/пт-вс. Скидка 15% на прокат'
  },
  {
    id: 'kp-course-advanced',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'course',
    participants: '4-8 человек',
    duration: '3 дня по 5 часов',
    priceLow: 40000,
    priceHigh: 40000,
    pricePeak: 40000,
    description: 'Курс для катающихся',
    notes: '10:00-15:00 вт-чт/пт-вс. Скидка 15% на прокат'
  },
  {
    id: 'kp-course-carving',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'course',
    participants: '4-8 человек',
    duration: '4 дня по 5 часов',
    priceLow: 50000,
    priceHigh: 50000,
    pricePeak: 50000,
    description: 'Курс Карвинг',
    notes: '10:00-15:00 вт-пт. Скидка 15% на прокат'
  },
  {
    id: 'kp-course-radius',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'course',
    participants: '4-8 человек',
    duration: '4 дня по 5 часов',
    priceLow: 50000,
    priceHigh: 50000,
    pricePeak: 50000,
    description: 'Курс Малый радиус',
    notes: '10:00-15:00 вт-пт. Скидка 15% на прокат'
  },
  {
    id: 'kp-course-race',
    resort: 'krasnaya-polyana',
    category: 'group-adult',
    type: 'course',
    participants: 'по запросу',
    duration: '3 часа',
    priceLow: 30000,
    priceHigh: 30000,
    pricePeak: 30000,
    description: 'Race (спортивная трасса)',
    notes: 'Предоставляется по запросу'
  },

  // ========== ГАЗПРОМ (RIDERS) ==========
  // ИНДИВИДУАЛЬНЫЕ ЗАНЯТИЯ
  {
    id: 'gz-ind-1h-1p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '1 час',
    priceWinter: 5600,
    pricePeak: 6200,
    description: 'Индивидуальный, 1 чел.',
    package: 'single'
  },
  {
    id: 'gz-ind-2h-1p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '2 часа',
    priceWinter: 9500,
    pricePeak: 10500,
    description: 'Индивидуальный, 1 чел.',
    package: 'single'
  },
  {
    id: 'gz-ind-2h-1p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '2 часа × 3 дня',
    priceWinter: 27500,
    pricePeak: 30000,
    description: 'Индивидуальный, 1 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-ind-2h-1p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 1,
    duration: '2 часа × 5 дней',
    priceWinter: 43000,
    pricePeak: 47500,
    description: 'Индивидуальный, 1 чел. (абонемент)',
    package: '5-days'
  },
  {
    id: 'gz-ind-2h-2p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 2,
    duration: '2 часа',
    priceWinter: 12000,
    pricePeak: 13000,
    description: 'Индивидуальный, 2 чел.',
    package: 'single'
  },
  {
    id: 'gz-ind-2h-2p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 2,
    duration: '2 часа × 3 дня',
    priceWinter: 34500,
    pricePeak: 37500,
    description: 'Индивидуальный, 2 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-ind-2h-2p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'standard',
    participants: 2,
    duration: '2 часа × 5 дней',
    priceWinter: 54000,
    pricePeak: 58500,
    description: 'Индивидуальный, 2 чел. (абонемент)',
    package: '5-days'
  },

  // ПРО-ИНСТРУКТОР
  {
    id: 'gz-pro-2h-1p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 1,
    duration: '2 часа',
    priceWinter: 12000,
    pricePeak: 13000,
    description: 'ПРО-инструктор, 1 чел.',
    package: 'single'
  },
  {
    id: 'gz-pro-2h-1p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 1,
    duration: '2 часа × 3 дня',
    priceWinter: 34500,
    pricePeak: 37500,
    description: 'ПРО-инструктор, 1 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-pro-2h-1p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 1,
    duration: '2 часа × 5 дней',
    priceWinter: 54000,
    pricePeak: 58500,
    description: 'ПРО-инструктор, 1 чел. (абонемент)',
    package: '5-days'
  },
  {
    id: 'gz-pro-2h-2p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 2,
    duration: '2 часа',
    priceWinter: 14000,
    pricePeak: 15000,
    description: 'ПРО-инструктор, 2 чел.',
    package: 'single'
  },
  {
    id: 'gz-pro-2h-2p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 2,
    duration: '2 часа × 3 дня',
    priceWinter: 40000,
    pricePeak: 43000,
    description: 'ПРО-инструктор, 2 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-pro-2h-2p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'pro',
    participants: 2,
    duration: '2 часа × 5 дней',
    priceWinter: 63000,
    pricePeak: 67500,
    description: 'ПРО-инструктор, 2 чел. (абонемент)',
    package: '5-days'
  },

  // ТОП-ИНСТРУКТОР
  {
    id: 'gz-top-2h-1-2p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '1-2',
    duration: '2 часа',
    priceWinter: 18000,
    pricePeak: 18000,
    description: 'ТОП-инструктор (категория А), 1-2 чел.',
    package: 'single'
  },
  {
    id: 'gz-top-2h-1-2p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '1-2',
    duration: '2 часа × 3 дня',
    priceWinter: 51500,
    pricePeak: 51500,
    description: 'ТОП-инструктор (категория А), 1-2 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-top-2h-1-2p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '1-2',
    duration: '2 часа × 5 дней',
    priceWinter: 81000,
    pricePeak: 81000,
    description: 'ТОП-инструктор (категория А), 1-2 чел. (абонемент)',
    package: '5-days'
  },
  {
    id: 'gz-top-2h-3-5p-single',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '3-5',
    duration: '2 часа',
    priceWinter: 22000,
    pricePeak: 22000,
    description: 'ТОП-инструктор (категория А), 3-5 чел.',
    package: 'single'
  },
  {
    id: 'gz-top-2h-3-5p-3days',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '3-5',
    duration: '2 часа × 3 дня',
    priceWinter: 63000,
    pricePeak: 63000,
    description: 'ТОП-инструктор (категория А), 3-5 чел. (абонемент)',
    package: '3-days'
  },
  {
    id: 'gz-top-2h-3-5p-5days',
    resort: 'gazprom',
    category: 'individual',
    type: 'top',
    participants: '3-5',
    duration: '2 часа × 5 дней',
    priceWinter: 99000,
    pricePeak: 99000,
    description: 'ТОП-инструктор (категория А), 3-5 чел. (абонемент)',
    package: '5-days'
  },

  // ГРУППОВЫЕ ЗАНЯТИЯ
  {
    id: 'gz-group-1h-single',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'standard',
    participants: 'от 3 чел.',
    duration: '1 час',
    priceWinter: 2400,
    pricePeak: 2400,
    description: 'Групповой',
    package: 'single',
    notes: 'Цена за 1 час, минимум 2 часа'
  },
  {
    id: 'gz-group-1h-3days',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'standard',
    participants: 'от 3 чел.',
    duration: '1 час × 3 дня',
    priceWinter: 7000,
    pricePeak: 7000,
    description: 'Групповой (абонемент)',
    package: '3-days',
    notes: 'Цена за 1 час, минимум 2 часа'
  },
  {
    id: 'gz-group-1h-5days',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'standard',
    participants: 'от 3 чел.',
    duration: '1 час × 5 дней',
    priceWinter: 11000,
    pricePeak: 11000,
    description: 'Групповой (абонемент)',
    package: '5-days',
    notes: 'Цена за 1 час, минимум 2 часа'
  },
  {
    id: 'gz-group-pro-1h-single',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'pro',
    participants: 'от 3 чел.',
    duration: '1 час',
    priceWinter: 3300,
    pricePeak: 3300,
    description: 'Групповой ПРО',
    package: 'single',
    notes: 'Цена за 1 час, минимум 2 часа'
  },
  {
    id: 'gz-group-pro-1h-3days',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'pro',
    participants: 'от 3 чел.',
    duration: '1 час × 3 дня',
    priceWinter: 9500,
    pricePeak: 9500,
    description: 'Групповой ПРО (абонемент)',
    package: '3-days',
    notes: 'Цена за 1 час, минимум 2 часа'
  },
  {
    id: 'gz-group-pro-1h-5days',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'pro',
    participants: 'от 3 чел.',
    duration: '1 час × 5 дней',
    priceWinter: 15000,
    pricePeak: 15000,
    description: 'Групповой ПРО (абонемент)',
    package: '5-days',
    notes: 'Цена за 1 час, минимум 2 часа'
  },

  // ДЕТСКАЯ ГОРНОЛЫЖНАЯ ШКОЛА
  {
    id: 'gz-kids-school-single',
    resort: 'gazprom',
    category: 'group-child',
    type: 'school',
    participants: 'группа',
    duration: '3 часа',
    priceWinter: 7100,
    pricePeak: 8000,
    description: 'Детская горнолыжная школа',
    package: 'single',
    equipment: true,
    notes: 'Отдых и снаряжение включены'
  },
  {
    id: 'gz-kids-school-3days',
    resort: 'gazprom',
    category: 'group-child',
    type: 'school',
    participants: 'группа',
    duration: '3 часа × 3 дня',
    priceWinter: 20500,
    pricePeak: 23000,
    description: 'Детская горнолыжная школа (абонемент)',
    package: '3-days',
    equipment: true,
    notes: 'Отдых и снаряжение включены'
  },
  {
    id: 'gz-kids-school-5days',
    resort: 'gazprom',
    category: 'group-child',
    type: 'school',
    participants: 'группа',
    duration: '3 часа × 5 дней',
    priceWinter: 32000,
    pricePeak: 36000,
    description: 'Детская горнолыжная школа (абонемент)',
    package: '5-days',
    equipment: true,
    notes: 'Отдых и снаряжение включены'
  },

  // ДЕТСКИЙ ЛАГЕРЬ
  {
    id: 'gz-kids-camp-5days',
    resort: 'gazprom',
    category: 'group-child',
    type: 'camp',
    participants: 'группа',
    duration: '5 дней',
    priceWinter: 57500,
    pricePeak: 61000,
    description: 'Детский лагерь',
    package: '5-days',
    notes: '6 часов на склоне + 1 час обед'
  },
  {
    id: 'gz-kids-camp-pro-5days',
    resort: 'gazprom',
    category: 'group-child',
    type: 'camp-pro',
    participants: 'группа',
    duration: '5 дней',
    priceWinter: 61500,
    pricePeak: 65000,
    description: 'Детский ПРО лагерь',
    package: '5-days',
    notes: '6 часов на склоне + 1 час обед'
  },

  // RIDERS-КУРСЫ
  {
    id: 'gz-riders-course',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'course',
    participants: 'группа',
    duration: '5 дней',
    priceWinter: 44500,
    pricePeak: 44500,
    description: 'Riders-курс',
    notes: '6 часов в день'
  },
  {
    id: 'gz-riders-course-pro',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'course-pro',
    participants: 'группа',
    duration: '5 дней',
    priceWinter: 48500,
    pricePeak: 48500,
    description: 'Riders-курс ПРО',
    notes: 'Могул, карвинг, фристайл, ТВК. 6 часов в день'
  },
  {
    id: 'gz-riders-course-ups',
    resort: 'gazprom',
    category: 'group-adult',
    type: 'course-ups',
    participants: 'группа',
    duration: '5 дней',
    priceWinter: 52500,
    pricePeak: 52500,
    description: 'Riders-курс UPS на горных лыжах',
    notes: '6 часов в день'
  },

  // ПРОГРАММА "ЛЫЖИ МЕЧТЫ"
  {
    id: 'gz-dreams-1h',
    resort: 'gazprom',
    category: 'individual',
    type: 'dreams',
    participants: 1,
    duration: '1 час',
    priceWinter: 4300,
    pricePeak: 4300,
    description: 'Лыжи мечты (реабилитация)',
    notes: 'Для людей с ДЦП, аутизмом, генетическими заболеваниями'
  },
  {
    id: 'gz-dreams-2h',
    resort: 'gazprom',
    category: 'individual',
    type: 'dreams',
    participants: 1,
    duration: '2 часа',
    priceWinter: 8600,
    pricePeak: 8600,
    description: 'Лыжи мечты (реабилитация)',
    notes: 'Для людей с ДЦП, аутизмом, генетическими заболеваниями'
  }
];

export function calculatePrice(
  priceId: string,
  date: Date
): number | null {
  const lesson = skiSchoolPricing.find(p => p.id === priceId);
  if (!lesson) return null;

  const season = getSeasonByDate(date, lesson.resort);
  
  if (lesson.resort === 'krasnaya-polyana') {
    if (season === 'peak') return lesson.pricePeak || null;
    if (season === 'high') return lesson.priceHigh || null;
    return lesson.priceLow || null;
  } else if (lesson.resort === 'gazprom') {
    if (season === 'peak') return lesson.pricePeak || null;
    return lesson.priceWinter || null;
  } else {
    return season === 'peak' ? (lesson.pricePeak || null) : (lesson.priceBase || null);
  }
}
