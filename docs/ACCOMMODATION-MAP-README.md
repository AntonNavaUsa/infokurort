# 🗺️ Модуль интерактивной карты размещения

> Встраиваемый партнёрский виджет для монетизации через affiliate-бронирования отелей (аналог stay22.com)

---

## 📋 Обзор

Этот модуль позволяет владельцам сайтов встраивать интерактивную карту с отелями и зарабатывать на партнёрских комиссиях от бронирований через Booking.com, Expedia и другие OTA.

### Ключевые возможности

✅ **Встраивание**
- iframe код
- JavaScript snippet
- Параметризация через URL

✅ **Поиск жилья**
- Поиск по координатам и радиусу
- Агрегация из нескольких OTA
- Кэширование результатов (Redis)

✅ **Фильтры и сортировка**
- По цене (мин/макс)
- По рейтингу
- По расстоянию

✅ **Affiliate tracking**
- Автоматическая генерация deeplinks
- Логирование кликов
- Аналитика конверсий

✅ **Admin панель**
- Управление виджетами (CRUD)
- Генератор embed кода
- Статистика и аналитика

---

## 🏗️ Архитектура

```
┌─────────────────┐
│  Partner Sites  │
└────────┬────────┘
         │ iframe/JS
         ▼
┌─────────────────┐
│  Frontend       │
│  Widget (React) │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  Backend        │
│  (Fastify)      │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┐
    ▼          ▼          ▼
┌────────┐ ┌──────┐  ┌────────┐
│ Postgres│ │Redis │  │  OTA   │
│         │ │      │  │  APIs  │
└─────────┘ └──────┘  └────────┘
```

---

## 📁 Структура файлов

### Backend
```
backend/
├── src/
│   ├── types/
│   │   └── accommodation.ts          # TypeScript типы
│   ├── routes/
│   │   ├── accommodation.ts          # Поиск жилья API
│   │   └── affiliate.ts              # Tracking API
│   ├── services/
│   │   ├── ota/
│   │   │   ├── booking.ts            # Booking.com API
│   │   │   └── normalizer.ts         # Нормализация данных
│   │   └── deeplink.ts               # Генерация партнёрских ссылок
│   └── prisma/
│       └── schema.prisma             # Модели: Widget, Partner, Click
```

### Frontend
```
src/
├── pages/
│   └── AccommodationMap.tsx          # Страница с картой (/map)
├── components/
│   └── map/
│       ├── MapWidget.tsx             # Leaflet карта
│       └── FilterPanel.tsx           # Фильтры
├── hooks/
│   └── useAccommodationSearch.ts     # React hook для поиска
├── lib/
│   └── api/
│       └── accommodation.ts          # API client
└── types/
    └── accommodation.ts              # TypeScript типы
```

### Admin
```
admin/
└── src/
    └── pages/
        └── widgets/
            ├── list.tsx              # Список виджетов
            ├── create.tsx            # Создание виджета
            └── edit.tsx              # Редактирование + embed код
```

---

## 🚀 Быстрый старт

### 1. Установка

```bash
# Frontend зависимости
npm install leaflet react-leaflet
npm install -D @types/leaflet

# Backend зависимости
cd backend
npm install ioredis @fastify/rate-limit
```

### 2. Настройка БД

Обновить `backend/prisma/schema.prisma` (см. [docs/ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md#prisma-schema-additions))

```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 3. Redis

Добавить в `docker-compose.yml`:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

Запустить:
```bash
docker-compose up -d redis
```

### 4. Environment

Создать `backend/.env`:
```env
BOOKING_API_KEY=your_key
BOOKING_AFFILIATE_ID=your_id
REDIS_URL=redis://localhost:6379
```

### 5. Запуск

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Admin
cd admin && npm run dev
```

**Открыть**: http://localhost:5173/map

---

## 📚 Документация

| Файл | Описание |
|------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | Краткое руководство по старту |
| [ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md) | Полная техническая roadmap (PoC/MVP/v1) |
| [ACCOMMODATION-GITHUB-ISSUES.md](./ACCOMMODATION-GITHUB-ISSUES.md) | 37 детальных GitHub Issues |
| [INSTALLATION.md](./INSTALLATION.md) | Установка зависимостей |
| [ACCOMMODATION-SUMMARY.md](./ACCOMMODATION-SUMMARY.md) | Итоговая сводка |

---

## 🎯 Roadmap

### ✅ Готово (Planning)
- Техническая roadmap с этапами
- Архитектурная схема
- Структура файлов (backend + frontend + admin)
- Базовые компоненты карты
- TypeScript типы
- Документация

### ⏳ В процессе (PoC)
- [ ] Интеграция Booking.com API
- [ ] Отображение реальных отелей на карте
- [ ] Генерация deeplinks
- [ ] Логирование кликов в БД

### 📅 Планируется (MVP)
- [ ] Standalone widget bundle
- [ ] iframe/JS embed methods
- [ ] Фильтры работают
- [ ] Rate limiting + Redis cache
- [ ] 2+ OTA источника
- [ ] Admin CRUD полностью функционален

### 🌟 Будущее (v1)
- [ ] AI ранжирование отелей
- [ ] A/B тестирование
- [ ] Postback tracking конверсий
- [ ] Email отчёты партнёрам
- [ ] CDN deployment

---

## 🔗 API Endpoints

### Accommodation
- `POST /api/accommodation/search` - Поиск жилья по координатам
- `GET /api/accommodation/:id` - Детали отеля

### Affiliate
- `POST /api/affiliate/track-click` - Логирование клика
- `GET /api/affiliate/deeplink` - Генерация партнёрской ссылки

### Widgets (Admin)
- `GET /api/widgets` - Список виджетов
- `POST /api/widgets` - Создать виджет
- `PUT /api/widgets/:id` - Обновить виджет
- `DELETE /api/widgets/:id` - Удалить виджет

---

## 💡 Примеры использования

### Встраивание через iframe

```html
<iframe 
  src="https://your-site.com/widget/abc123" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Встраивание через JS

```html
<div id="ski-map-widget"></div>
<script 
  src="https://your-site.com/embed.js" 
  data-widget-id="abc123"
  data-lat="43.66"
  data-lng="40.31">
</script>
```

---

## 🤝 Вклад

1. Изучить [ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md)
2. Выбрать Issue из [ACCOMMODATION-GITHUB-ISSUES.md](./ACCOMMODATION-GITHUB-ISSUES.md)
3. Создать ветку: `git checkout -b feature/issue-123`
4. Сделать commit: `git commit -m "feat: описание"`
5. Push: `git push origin feature/issue-123`
6. Создать Pull Request

---

## 📞 Контакты

Для вопросов и предложений создавайте Issues в GitHub.

---

## 📄 Лицензия

MIT

---

**Статус**: 🚧 В разработке (Architecture Ready)
