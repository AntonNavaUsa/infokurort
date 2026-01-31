# 🚀 Quick Start: Модуль интерактивной карты размещения

## Что сделано

✅ **Документация**
- Полная roadmap (PoC → MVP → v1) с таймингами
- 37 детальных GitHub Issues
- Архитектурная схема системы

✅ **Backend структура**
- TypeScript типы и интерфейсы
- API routes (accommodation, affiliate)
- Сервисы для OTA интеграций (Booking.com)
- Deeplink generator
- Data normalizer

✅ **Frontend компоненты**
- Страница с интерактивной картой ([/map](../src/pages/AccommodationMap.tsx))
- MapWidget на базе Leaflet
- FilterPanel (цена, рейтинг, сортировка)
- Hooks и API клиенты

✅ **Admin панель**
- CRUD страницы для виджетов
- Генератор embed кода
- Превью виджета
- Базовая аналитика

---

## 🎯 Начало работы

### 1. Установить зависимости

```bash
# В корне проекта
npm install leaflet react-leaflet
npm install -D @types/leaflet

# В backend
cd backend
npm install ioredis @fastify/rate-limit
```

### 2. Обновить Prisma

Скопировать модели из [docs/ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md#prisma-schema-additions) в `backend/prisma/schema.prisma`:

- Widget
- Partner  
- Click
- Conversion

Затем:
```bash
cd backend
npm run prisma:migrate
npm run prisma:generate
```

### 3. Добавить Redis

В `docker-compose.yml`:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

Запустить:
```bash
docker-compose up -d redis
```

### 4. Настроить API ключи

В `backend/.env`:
```env
# Booking.com (зарегистрироваться: https://www.booking.com/affiliate)
BOOKING_API_KEY=your_api_key
BOOKING_AFFILIATE_ID=your_affiliate_id

# Expedia (опционально)
EXPEDIA_API_KEY=your_key
EXPEDIA_AFFILIATE_ID=your_tpid

# Redis
REDIS_URL=redis://localhost:6379
```

### 5. Зарегистрировать routes в backend

В `backend/src/index.ts` добавить:

```typescript
import accommodationRoutes from './routes/accommodation.js';
import affiliateRoutes from './routes/affiliate.js';

// После существующих routes
await fastify.register(accommodationRoutes, { prefix: '/api/accommodation' });
await fastify.register(affiliateRoutes, { prefix: '/api/affiliate' });
```

### 6. Добавить ресурс в Admin

В `admin/src/App.tsx`:

```typescript
import { WidgetList } from './pages/widgets/list';
import { WidgetCreate } from './pages/widgets/create';
import { WidgetEdit } from './pages/widgets/edit';

// В resources массив
{
  name: 'widgets',
  list: '/widgets',
  create: '/widgets/create',
  edit: '/widgets/edit/:id',
  meta: {
    label: 'Виджеты карты',
  },
}

// В Routes
<Route path="/widgets">
  <Route index element={<WidgetList />} />
  <Route path="create" element={<WidgetCreate />} />
  <Route path="edit/:id" element={<WidgetEdit />} />
</Route>
```

### 7. Запустить проект

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Admin
cd admin
npm run dev
```

Открыть:
- Frontend: http://localhost:5173/map
- Admin: http://localhost:3002/widgets
- Backend API: http://localhost:3001/api

---

## 📋 Дальнейшие шаги (по приоритету)

### PoC (3-5 дней)
1. ✅ Карта работает на `/map` (уже готово)
2. ⏳ Интеграция Booking.com API
3. ⏳ Отображение реальных отелей
4. ⏳ Генерация deeplinks
5. ⏳ Логирование кликов в БД

### MVP (15-20 дней)
- Standalone widget bundle
- iframe/JS embed
- Фильтры и сортировка работают
- Admin CRUD полностью функционален
- Rate limiting + cache
- 2+ OTA источника

### v1 (20-30 дней)
- AI ранжирование
- A/B тестирование
- Postback tracking
- Email отчёты
- CDN deployment

---

## 📚 Документы

| Файл | Описание |
|------|----------|
| [ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md) | Полная техническая roadmap |
| [ACCOMMODATION-GITHUB-ISSUES.md](./ACCOMMODATION-GITHUB-ISSUES.md) | Детальные Issues для GitHub |
| [ACCOMMODATION-SUMMARY.md](./ACCOMMODATION-SUMMARY.md) | Итоговая сводка |
| [QUICKSTART.md](./QUICKSTART.md) | Этот файл |

---

## 🤔 FAQ

**Q: Нужно ли создавать новый проект?**  
A: Нет, всё интегрируется в текущий проект.

**Q: Где посмотреть карту?**  
A: После запуска frontend → http://localhost:5173/map

**Q: Как создать виджет в админке?**  
A: Admin панель → `/widgets` → "Создать виджет"

**Q: Откуда брать API ключи OTA?**  
A: Регистрация:
- Booking: https://www.booking.com/affiliate
- Expedia: https://www.expediapartnersolutions.com/

**Q: Что такое deeplink?**  
A: Партнёрская ссылка на отель с вашим affiliate ID для получения комиссии.

---

## 🎉 Готово к разработке!

Архитектура спроектирована, структура создана. Можно начинать имплементацию с PoC (Issues #101-105).

**Успехов!** 🚀
