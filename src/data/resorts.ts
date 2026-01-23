export interface Resort {
  id: string;
  name: string;
  description: string;
  features: string[];
  trailsCount: {
    green: number;
    blue: number;
    red: number;
    black: number;
  };
  elevation: {
    min: number;
    max: number;
  };
  bestFor: string[];
  season: {
    opening: string;
    closing: string;
  };
}

export const resorts: Resort[] = [
  {
    id: 'roza-hutor',
    name: 'Роза Хутор',
    description: 'Крупнейший и самый современный горнолыжный курорт России. Входит в топ-25 лучших курортов мира по версии World Ski Awards. Здесь проводились соревнования зимних Олимпийских игр 2014 года.',
    features: [
      '102 км трасс различной сложности',
      'Современная канатно-кроссовая дорога',
      'Развитая инфраструктура: отели, рестораны, спа',
      'Детский горнолыжный клуб "Егорка"',
      'Сноупарк для фристайла',
      'Вечернее катание до 22:00',
      'Трассы для беговых лыж'
    ],
    trailsCount: {
      green: 15,
      blue: 30,
      red: 25,
      black: 8
    },
    elevation: {
      min: 560,
      max: 2320
    },
    bestFor: [
      'Семьи с детьми',
      'Начинающие лыжники',
      'Продвинутые райдеры',
      'Любители апре-ски',
      'Корпоративные группы'
    ],
    season: {
      opening: '26 декабря 2025',
      closing: '30 апреля 2026'
    }
  },
  {
    id: 'krasnaya-polyana',
    name: 'Красная Поляна',
    description: 'Горно-туристический центр мирового уровня с разнообразными трассами для всех уровней подготовки. Известен своими живописными видами и качественным снегом.',
    features: [
      '30+ км горнолыжных трасс',
      'Трассы для фрирайда и бэккантри',
      'Курсы "Прогресс" по австрийской методике',
      'Персональные гиды',
      'Горные хижины и рестораны',
      'Парк экстремальных развлечений',
      'SPA-комплексы и бани'
    ],
    trailsCount: {
      green: 8,
      blue: 18,
      red: 15,
      black: 5
    },
    elevation: {
      min: 540,
      max: 2200
    },
    bestFor: [
      'Любители карвинга',
      'Фрирайдеры',
      'Компании друзей',
      'Романтические поездки',
      'Гурманы (отличные рестораны)'
    ],
    season: {
      opening: '26 декабря 2025',
      closing: '10 мая 2026'
    }
  },
  {
    id: 'gazprom',
    name: 'Газпром (Лаура/Альпика)',
    description: 'Курорт с двумя зонами катания: Лаура (широкие подготовленные трассы) и Альпика (целинные склоны для фрирайда). Домашняя база школы Riders - одной из лучших в России.',
    features: [
      'Школа Riders с ПРО и ТОП-инструкторами',
      'Специализированные курсы (могул, карвинг, фристайл)',
      'Программа "Лыжи мечты" для реабилитации',
      'Детский и ПРО лагеря',
      'Riders-курс UPS на горных лыжах',
      'Трассы для беговых лыж',
      'Отличные условия для фрирайда'
    ],
    trailsCount: {
      green: 10,
      blue: 20,
      red: 18,
      black: 7
    },
    elevation: {
      min: 540,
      max: 2375
    },
    bestFor: [
      'Технично катающиеся',
      'Любители фрирайда',
      'Участники специализированных курсов',
      'Дети (детские программы)',
      'Спортсмены'
    ],
    season: {
      opening: '29-30 декабря 2025 (ориентировочно)',
      closing: '30 апреля 2026'
    }
  }
];

export function getResortById(id: string): Resort | undefined {
  return resorts.find(r => r.id === id);
}

export function getResortInfo(id: string): string {
  const resort = getResortById(id);
  if (!resort) return 'Курорт не найден';

  return `
**${resort.name}**

${resort.description}

**Основные характеристики:**
${resort.features.map(f => `• ${f}`).join('\n')}

**Трассы:**
• Зелёные (лёгкие): ${resort.trailsCount.green}
• Синие (средние): ${resort.trailsCount.blue}
• Красные (сложные): ${resort.trailsCount.red}
• Чёрные (экспертные): ${resort.trailsCount.black}

**Высоты:** ${resort.elevation.min}м - ${resort.elevation.max}м

**Сезон:** ${resort.season.opening} - ${resort.season.closing}

**Подойдет для:** ${resort.bestFor.join(', ')}
  `.trim();
}
