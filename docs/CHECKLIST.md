# ✅ Чек-лист: Запуск модуля интерактивной карты

## Подготовка окружения

### 1. Зависимости

- [ ] Frontend: установлен `leaflet` и `react-leaflet`
  ```bash
  npm install leaflet react-leaflet
  npm install -D @types/leaflet
  ```

- [ ] Backend: установлен `ioredis` и `@fastify/rate-limit`
  ```bash
  cd backend && npm install ioredis @fastify/rate-limit
  ```

### 2. База данных

- [ ] Обновлён `backend/prisma/schema.prisma` с моделями:
  - Widget
  - Partner
  - Click
  - Conversion
  
- [ ] Выполнена миграция
  ```bash
  cd backend
  npm run prisma:migrate
  npm run prisma:generate
  ```

### 3. Redis

- [ ] Добавлен сервис Redis в `docker-compose.yml`
- [ ] Запущен Redis контейнер
  ```bash
  docker-compose up -d redis
  ```
- [ ] Проверено подключение
  ```bash
  redis-cli ping  # Должен вернуть PONG
  ```

### 4. Environment Variables

- [ ] Создан/обновлён `backend/.env`:
  ```env
  REDIS_URL=redis://localhost:6379
  BOOKING_API_KEY=your_key
  BOOKING_AFFILIATE_ID=your_id
  ```

### 5. API Routes регистрация

- [ ] В `backend/src/index.ts` добавлены:
  ```typescript
  import accommodationRoutes from './routes/accommodation.js';
  import affiliateRoutes from './routes/affiliate.js';
  
  await fastify.register(accommodationRoutes, { prefix: '/api/accommodation' });
  await fastify.register(affiliateRoutes, { prefix: '/api/affiliate' });
  ```

### 6. Admin ресурсы

- [ ] В `admin/src/App.tsx` добавлен ресурс "widgets"
- [ ] Импортированы компоненты:
  - WidgetList
  - WidgetCreate
  - WidgetEdit
- [ ] Добавлены роуты для `/widgets`

---

## Регистрация в партнёрских программах

### OTA Affiliate Programs

- [ ] **Booking.com**: https://www.booking.com/affiliate
  - Получен API ключ
  - Получен Affiliate ID
  
- [ ] **Expedia** (опционально): https://www.expediapartnersolutions.com/
  - Получен API ключ
  - Получен TPID
  
- [ ] **Agoda** (для v1): https://partners.agoda.com/
  - Получен CID

---

## Проверка работоспособности

### Frontend

- [ ] Запущен dev сервер: `npm run dev`
- [ ] Страница `/map` открывается
- [ ] Карта отображается (Leaflet)
- [ ] Нет ошибок в консоли

### Backend

- [ ] Запущен: `cd backend && npm run dev`
- [ ] API доступен: http://localhost:3001/api
- [ ] Health check работает: http://localhost:3001/health
- [ ] Endpoints зарегистрированы:
  - [ ] POST /api/accommodation/search
  - [ ] POST /api/affiliate/track-click

### Admin

- [ ] Запущен: `cd admin && npm run dev`
- [ ] Открывается: http://localhost:3002
- [ ] Страница `/widgets` доступна
- [ ] Можно создать виджет

---

## Первый тест

### Создание тестового виджета

- [ ] Открыть Admin: http://localhost:3002/widgets
- [ ] Нажать "Создать виджет"
- [ ] Заполнить форму:
  - Название: "Тестовый виджет Роза Хутор"
  - Широта: 43.66
  - Долгота: 40.31
  - Радиус: 5000
  - Тип: resort
- [ ] Сохранить
- [ ] Виджет появился в списке

### Проверка embed кода

- [ ] Открыть созданный виджет на редактирование
- [ ] Вкладка "Код для встраивания" работает
- [ ] iframe код генерируется
- [ ] JS код генерируется
- [ ] Кнопка "Копировать" работает

### Тест карты

- [ ] Открыть Frontend: http://localhost:5173/map
- [ ] Карта загружается
- [ ] Панель фильтров отображается
- [ ] Сортировка работает
- [ ] Фильтры по цене работают (после подключения API)

---

## Интеграция API (PoC)

### Booking.com API

- [ ] Обновлён `backend/src/services/ota/booking.ts`
- [ ] Реализован метод `searchByCoordinates()`
- [ ] Тест вручную возвращает данные:
  ```bash
  curl -X POST http://localhost:3001/api/accommodation/search \
    -H "Content-Type: application/json" \
    -d '{"lat": 43.66, "lng": 40.31, "radius": 5000}'
  ```

### Отображение отелей

- [ ] Отели из API отображаются на карте
- [ ] Маркеры кликабельны
- [ ] Popup с информацией работает
- [ ] Кнопка "Забронировать" работает

### Tracking

- [ ] Клик по "Забронировать" логируется в БД
- [ ] В таблице `Click` появляются записи
- [ ] IP и User-Agent сохраняются

---

## Next Steps (MVP)

После успешного PoC:

- [ ] Добавить Expedia API
- [ ] Реализовать Redis cache
- [ ] Настроить rate limiting
- [ ] Создать standalone widget bundle
- [ ] E2E тестирование

---

## Полезные команды

### Разработка
```bash
# Запустить всё одновременно (если настроен npm script)
npm run dev:all

# Или по отдельности:
cd backend && npm run dev      # Terminal 1
npm run dev                    # Terminal 2  
cd admin && npm run dev        # Terminal 3
```

### База данных
```bash
# Prisma Studio
cd backend && npm run prisma:studio

# Создать миграцию
npm run prisma:migrate

# Сбросить БД (осторожно!)
npx prisma migrate reset
```

### Redis
```bash
# Подключиться к Redis CLI
redis-cli

# Посмотреть все ключи
redis-cli KEYS "*"

# Очистить cache
redis-cli FLUSHDB
```

### Docker
```bash
# Посмотреть логи Redis
docker-compose logs redis

# Перезапустить Redis
docker-compose restart redis
```

---

## Troubleshooting

### Карта не отображается
- Проверить импорт CSS: `import 'leaflet/dist/leaflet.css'`
- Проверить высоту контейнера: `height: 600px`

### Маркеры не видны
- Добавить fix для иконок Leaflet (см. [INSTALLATION.md](./INSTALLATION.md))

### Redis connection error
- Проверить: `docker-compose ps redis`
- Запустить: `docker-compose up -d redis`

### API 500 error
- Проверить логи backend
- Проверить `.env` файл
- Проверить Prisma models сгенерированы

---

## 🎉 Готово!

Если все пункты отмечены ✅, модуль готов к разработке PoC!

Следующий шаг: Issues #101-105 из [ACCOMMODATION-GITHUB-ISSUES.md](./ACCOMMODATION-GITHUB-ISSUES.md)
