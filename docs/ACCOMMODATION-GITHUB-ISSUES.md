# 🗺️ GitHub Issues для модуля интерактивной карты

> Автоматически сгенерированные Issues из [ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md)

---

## 🔥 Epic Issues

### Epic #1: PoC - Proof of Concept
**Labels**: `🚀 epic` `📦 poc` `🔴 critical`  
**Timeline**: 3-5 дней

```markdown
## 🚀 [EPIC] PoC: Интерактивная карта размещения

### 🎯 Цель
Проверить техническую осуществимость виджета карты с affiliate-бронированиями

### 📦 Scope
- [x] Leaflet карта на странице `/map`
- [ ] Интеграция с Travelpayouts API (token готов)
- [ ] Отображение 5-10 отелей из Hotellook
- [ ] Генерация affiliate deeplinks
- [ ] Базовое логирование

### 🔗 Child Issues
- #101 Настроить Leaflet карту на странице /map
- #102 Интеграция Travelpayouts API (Hotellook)
- #103 Отобразить отели на карте маркерами
- #104 Генерация affiliate deeplinks
- #105 Базовое логирование кликов в console

### ⏱️ Timeline
3-5 дней

### 🏁 Definition of Done
- [ ] Карта отображается на `/map`
- [ ] Реальные отели из Островок
- [ ] Deeplinks ведут на Островок с партнёрским marker ID
- [ ] Клики логируются в console
```

---

## 🏷️ Детальные Issues

### PoC Stage

#### Issue #101: Настроить Leaflet карту
**Labels**: `📦 poc` `🎨 frontend` `🔴 critical`

```markdown
## 🗺️ Настроить Leaflet карту на странице /map

### 📋 Description
Создать новую страницу `/map` с интерактивной картой на базе Leaflet.js

### 🎯 Acceptance Criteria
- [ ] Установлен пакет `react-leaflet`
- [ ] Создан компонент `MapWidget.tsx`
- [ ] Карта отображается с начальными координатами Роза Хутор (43.66, 40.31)
- [ ] Zoom controls работают
- [ ] Карта адаптируется под размер контейнера

### 📦 Deliverables
- `src/pages/AccommodationMap.tsx`
- `src/components/map/MapWidget.tsx`
- Обновлен `src/App.tsx` (добавлен роут `/map`)

### ⏱️ Estimate
4 часа

### 📚 Resources
- [Leaflet Docs](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)

### 🏁 Definition of Done
- [ ] Код написан
- [ ] Карта отображается
- [ ] Страница доступна по `/map`
- [ ] Commit в git
```

---

#### Issue #102: Интеграция Travelpayouts API
**Labels**: `📦 poc` `⚙️ backend` `🔴 critical`

```markdown
## 🏨 Интеграция Travelpayouts API (Hotellook)

### 📋 Description
Настроить подключение к Travelpayouts API для поиска отелей по координатам.
Travelpayouts агрегирует 100+ OTA (Booking.com, Hotels.com и др.)

### 🎯 Acceptance Criteria
- [x] API Token готов: `3286214c096eaaaee7af14894a3f9586`
- [ ] Создан сервис `backend/src/services/ota/travelpayouts.ts`
- [ ] Реализован метод `searchByCoordinates(lat, lng, radius)`
- [ ] API возвращает 10-20 отелей для Сочи/Роза Хутор
- [ ] Добавлен `.env` с `TRAVELPAYOUTS_TOKEN` и `TRAVELPAYOUTS_MARKER`

### 📦 Deliverables
- `backend/src/services/ota/travelpayouts.ts` ✅
- `backend/src/types/accommodation.ts` (обновлён)
- `backend/.env` (добавить TRAVELPAYOUTS_TOKEN, TRAVELPAYOUTS_MARKER)

### ⏱️ Estimate
4 часа (упрощено благодаря готовому токену)

### 📚 Resources
- [Travelpayouts API Docs](https://support.travelpayouts.com/hc/en-us/articles/203956163)
- [Hotellook API](https://support.travelpayouts.com/hc/en-us/articles/203972143-Hotels-search-API)
- [Dashboard](https://www.travelpayouts.com/)

### 🔗 Dependencies
Нет

### 🏁 Definition of Done
- [x] Сервис создан
- [ ] API интеграция протестирована
- [ ] Возвращает реальные данные для Сочи
- [ ] Commit в git
```

---

#### Issue #103: Отобразить отели на карте маркерами
**Labels**: `📦 poc` `🎨 frontend` `🔴 critical`

```markdown
## 📍 Отобразить отели на карте маркерами

### 📋 Description
Получить отели из API и отобразить их на карте в виде маркеров с popup

### 🎯 Acceptance Criteria
- [ ] Создан хук `useAccommodationSearch.ts`
- [ ] При загрузке страницы вызывается API
- [ ] Каждый отель отображается маркером на карте
- [ ] Popup показывает: название, фото, цену, рейтинг
- [ ] При клике на маркер popup открывается

### 📦 Deliverables
- `src/hooks/useAccommodationSearch.ts`
- `src/components/map/HotelMarker.tsx`
- `src/components/map/HotelPopup.tsx`
- `src/lib/api/accommodation.ts`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #101, #102

### 🏁 Definition of Done
- [ ] Маркеры видны на карте
- [ ] Popup с информацией работает
- [ ] Данные берутся из API
- [ ] Commit в git
```

---

#### Issue #104: Генерация affiliate deeplinks
**Labels**: `📦 poc` `💰 affiliate` `🔴 critical`

```markdown
## 🔗 Генерация affiliate deeplinks для Островок

### 📋 Description
Создать сервис генерации партнёрских ссылок с подменой affiliate ID

### 🎯 Acceptance Criteria
- [ ] Создан `backend/src/services/deeplink.ts`
- [ ] Функция `generateOstrovokLink(hotelId, partnerId)` работает
- [ ] Ссылка содержит параметр `marker=YOUR_AFFILIATE_ID`
- [ ] При переходе по ссылке открывается страница отеля на Ostrovok.ru

### 📦 Deliverables
- `backend/src/services/deeplink.ts`
- Тест в браузере

### ⏱️ Estimate
2 часа

### 🔗 Dependencies
- Blocked by: #102

### 📚 Resources
- [Островок Deeplink Guide](https://www.ostrovok.ru/partners/integration/)

### 🏁 Definition of Done
- [ ] Функция создана
- [ ] Ссылка работает
- [ ] Партнёрский ID подставляется
- [ ] Commit в git
```

---

#### Issue #105: Базовое логирование кликов в console
**Labels**: `📦 poc` `⚙️ backend` `🟢 medium`

```markdown
## 📝 Базовое логирование кликов в console

### 📋 Description
При клике на "Забронировать" логировать событие в console (пока без БД)

### 🎯 Acceptance Criteria
- [ ] При клике на кнопку "Забронировать" вызывается функция
- [ ] В console.log выводится:
  - Название отеля
  - Цена
  - Affiliate URL
  - Timestamp

### 📦 Deliverables
- Обновлён `HotelPopup.tsx` с обработчиком onClick

### ⏱️ Estimate
1 час

### 🔗 Dependencies
- Blocked by: #104

### 🏁 Definition of Done
- [ ] Клик логируется
- [ ] Данные видны в console
- [ ] Commit в git
```

---

### MVP Stage

#### Epic #2: Frontend Widget
**Labels**: `🚀 epic` `📦 mvp` `🎨 frontend` `🔴 critical`  
**Timeline**: 7-9 дней

```markdown
## 🚀 [EPIC] Frontend: Standalone Widget

### 🎯 Цель
Создать встраиваемый React виджет для внешних сайтов

### 📦 Scope
- [x] Standalone bundle (Vite)
- [x] iframe + JS embed methods
- [x] Фильтры и сортировка
- [x] Адаптивный дизайн
- [x] Обработка ошибок

### 🔗 Child Issues
- #201 Создать standalone React bundle
- #202 Параметризация через URL
- #203 JS-loader скрипт для встраивания
- #204 Фильтры: цена, рейтинг
- #205 Сортировка по цене/расстоянию
- #206 Адаптивный дизайн mobile+desktop
- #207 Загрузчики (skeleton)
- #208 Обработка ошибок API
- #209 Lazy loading при скролле
- #210 Мультиязычность RU/EN

### ⏱️ Timeline
7-9 дней (51 час)
```

---

#### Issue #201: Создать standalone React bundle
**Labels**: `📦 mvp` `🎨 frontend` `🔴 critical`

```markdown
## 📦 Создать standalone React bundle для iframe

### 📋 Description
Создать отдельный Vite build конфиг для виджета, который можно встраивать через iframe

### 🎯 Acceptance Criteria
- [ ] Создана директория `widget/` с отдельным package.json
- [ ] Настроен `vite.config.widget.ts` для standalone bundle
- [ ] Build генерирует `widget.js` и `widget.css`
- [ ] Виджет работает в iframe без зависимостей от родительского сайта
- [ ] Bundle размер < 200 KB (gzip)

### 📦 Deliverables
- `widget/src/Widget.tsx`
- `widget/vite.config.widget.ts`
- `widget/package.json`
- `widget/dist/` (build output)

### ⏱️ Estimate
6 часов

### 🔗 Dependencies
- Blocked by: PoC завершён

### 📚 Resources
- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)

### 🏁 Definition of Done
- [ ] Build работает: `npm run build:widget`
- [ ] Файл `widget.js` создан
- [ ] Виджет работает в iframe
- [ ] Bundle < 200 KB
- [ ] Commit в git
```

---

#### Issue #202: Параметризация через URL
**Labels**: `📦 mvp` `🎨 frontend` `🔴 critical`

```markdown
## ⚙️ Параметризация виджета через URL query params

### 📋 Description
Виджет должен читать параметры из URL: координаты, радиус, тип

### 🎯 Acceptance Criteria
- [ ] URL формат: `?lat=43.66&lng=40.31&radius=5000&type=resort`
- [ ] Виджет парсит параметры при загрузке
- [ ] Fallback на дефолтные значения если параметры не указаны
- [ ] Валидация параметров (lat: -90 до 90, lng: -180 до 180)

### 📦 Deliverables
- `widget/src/hooks/useWidgetParams.ts`
- `widget/src/config.ts` (default values)

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #201

### 🏁 Definition of Done
- [ ] Параметры читаются из URL
- [ ] Валидация работает
- [ ] Fallback значения применяются
- [ ] Commit в git
```

---

#### Issue #203: JS-loader скрипт для встраивания
**Labels**: `📦 mvp` `🎨 frontend` `🔴 critical`

```markdown
## 📜 Создать JS-loader скрипт для встраивания

### 📋 Description
Альтернатива iframe: JS скрипт, который создаёт виджет в div на странице партнёра

### 🎯 Acceptance Criteria
- [ ] Создан файл `widget/src/embed.ts`
- [ ] Скрипт читает data-атрибуты: `data-lat`, `data-lng`, `data-partner-id`
- [ ] Виджет рендерится в `<div id="ski-map-widget"></div>`
- [ ] Скрипт работает без конфликтов с другими библиотеками (no global pollution)

### 📦 Deliverables
- `widget/src/embed.ts`
- `widget/dist/embed.js` (build)
- Пример использования в `docs/WIDGET-EMBEDDING.md`

### ⏱️ Estimate
5 часов

### 🔗 Dependencies
- Blocked by: #201

### 📚 Example
```html
<div id="ski-map-widget"></div>
<script src="https://cdn.ski-concierge.com/embed.js" 
        data-lat="43.66" 
        data-lng="40.31" 
        data-partner-id="ABC123"></script>
```

### 🏁 Definition of Done
- [ ] Скрипт работает
- [ ] Data-атрибуты читаются
- [ ] Виджет рендерится
- [ ] Пример в документации
- [ ] Commit в git
```

---

#### Issue #204: Фильтры: цена, рейтинг
**Labels**: `📦 mvp` `🎨 frontend` `🟡 high`

```markdown
## 🔍 Добавить фильтры: цена (мин/макс), рейтинг

### 📋 Description
UI для фильтрации списка отелей по цене и рейтингу

### 🎯 Acceptance Criteria
- [ ] Создан компонент `FilterPanel.tsx`
- [ ] Slider для цены (min/max)
- [ ] Dropdown для рейтинга (5⭐, 4⭐+, 3⭐+)
- [ ] Фильтры применяются к списку отелей
- [ ] Кнопка "Сбросить фильтры"

### 📦 Deliverables
- `src/components/map/FilterPanel.tsx`
- Интеграция с `useAccommodationSearch.ts`

### ⏱️ Estimate
6 часов

### 🔗 Dependencies
- Blocked by: #103

### 🏁 Definition of Done
- [ ] UI фильтров отображается
- [ ] Фильтры работают
- [ ] Список обновляется в реальном времени
- [ ] Commit в git
```

---

#### Issue #205: Сортировка по цене/расстоянию
**Labels**: `📦 mvp` `🎨 frontend` `🟡 high`

```markdown
## 🔄 Сортировка: цена, расстояние, рейтинг

### 📋 Description
Dropdown для выбора типа сортировки отелей

### 🎯 Acceptance Criteria
- [ ] Dropdown: "По цене ↑", "По цене ↓", "По расстоянию", "По рейтингу"
- [ ] При выборе список отелей пересортировывается
- [ ] Дефолтная сортировка: "По расстоянию"

### 📦 Deliverables
- Обновлён `FilterPanel.tsx`
- Логика сортировки в `useAccommodationSearch.ts`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #204

### 🏁 Definition of Done
- [ ] Dropdown работает
- [ ] Сортировка применяется
- [ ] Commit в git
```

---

#### Issue #206: Адаптивный дизайн mobile+desktop
**Labels**: `📦 mvp` `🎨 frontend` `🔴 critical`

```markdown
## 📱 Адаптивный дизайн для mobile и desktop

### 📋 Description
Виджет должен корректно отображаться на экранах от 320px до 1920px

### 🎯 Acceptance Criteria
- [ ] Desktop (>768px): карта слева, список справа
- [ ] Mobile (<768px): карта сверху, список снизу (вертикальный stack)
- [ ] Тач-события работают на мобильных (pinch zoom)
- [ ] Кнопки достаточно большие для касания (min 44px)

### 📦 Deliverables
- Обновлён `MapWidget.tsx` с responsive CSS
- Tailwind breakpoints использованы

### ⏱️ Estimate
8 часов

### 🔗 Dependencies
- Blocked by: #201

### 🏁 Definition of Done
- [ ] Lighthouse mobile score > 90
- [ ] Виджет тестирован на iPhone, Android
- [ ] Commit в git
```

---

#### Epic #3: Backend API
**Labels**: `🚀 epic` `📦 mvp` `⚙️ backend` `🔴 critical`  
**Timeline**: 5-6 дней

```markdown
## 🚀 [EPIC] Backend: Accommodation & Affiliate API

### 🎯 Цель
API для поиска жилья и tracking affiliate кликов

### 📦 Scope
- [x] Prisma модели (Widget, Partner, Click)
- [x] Search endpoint с агрегацией OTA
- [x] Redis caching
- [x] Rate limiting
- [x] Affiliate tracking endpoint

### 🔗 Child Issues
- #301 Создать Prisma модели: Widget, Partner, Click
- #302 API endpoint: POST /api/accommodation/search
- #303 Агрегация Островок + Суточно.ru
- #304 Нормализация данных
- #305 Настроить Redis для кэширования
- #306 Rate limiting (100 req/min)
- #307 API endpoint: POST /api/affiliate/track-click
- #308 Генератор deeplinks с partner_id

### ⏱️ Timeline
5-6 дней (42 часа)
```

---

#### Issue #301: Создать Prisma модели
**Labels**: `📦 mvp` `⚙️ backend` `🔴 critical`

```markdown
## 🗄️ Создать Prisma модели: Widget, Partner, Click, Conversion

### 📋 Description
Добавить в schema.prisma модели для виджетов, партнёров, кликов

### 🎯 Acceptance Criteria
- [ ] Модель `Widget` с полями: id, partnerId, latitude, longitude, radius, type, theme, active
- [ ] Модель `Partner` с полями: id, email, name, domain, ostrovokAffiliateId, sutochnoAffiliateId, active
- [ ] Модель `Click` с полями: id, widgetId, partnerId, hotelId, ota, price, ip, clickedAt
- [ ] Модель `Conversion` с полями: id, partnerId, otaBookingId, revenue, commission, status
- [ ] Миграция создана: `npm run prisma:migrate`

### 📦 Deliverables
- `backend/prisma/schema.prisma` (обновлён)
- `backend/prisma/migrations/...` (новая миграция)

### ⏱️ Estimate
3 часа

### 📚 Schema
Смотри [ACCOMMODATION-MAP-ROADMAP.md](./ACCOMMODATION-MAP-ROADMAP.md#prisma-schema-additions)

### 🏁 Definition of Done
- [ ] Модели добавлены
- [ ] Миграция выполнена
- [ ] `npx prisma generate` работает
- [ ] Commit в git
```

---

#### Issue #302: API endpoint POST /api/accommodation/search
**Labels**: `📦 mvp` `⚙️ backend` `🔴 critical`

```markdown
## 🔍 API endpoint: POST /api/accommodation/search

### 📋 Description
Создать Fastify роут для поиска жилья по координатам

### 🎯 Acceptance Criteria
- [ ] Endpoint: `POST /api/accommodation/search`
- [ ] Request body: `{ lat, lng, radius, checkin?, checkout?, guests? }`
- [ ] Response: массив отелей `{ id, name, lat, lng, price, currency, rating, image, ota }`
- [ ] Валидация входных данных (Zod)

### 📦 Deliverables
- `backend/src/routes/accommodation.ts`
- `backend/src/types/accommodation.ts`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #301

### 🏁 Definition of Done
- [ ] Endpoint работает
- [ ] Postman/curl тест успешен
- [ ] Валидация работает
- [ ] Commit в git
```

---

#### Issue #303: Агрегация Островок + Суточно.ru
**Labels**: `📦 mvp` `⚙️ backend` `🟡 high`

```markdown
## 🏨 Агрегация данных из Островок + Суточно.ru API

### 📋 Description
Запросить данные из 2+ OTA и объединить результаты

### 🎯 Acceptance Criteria
- [ ] Создан `backend/src/services/ota/sutochno.ts`
- [ ] Метод `searchByCoordinates()` вызывается для обоих API параллельно
- [ ] Результаты мержатся в один массив
- [ ] При ошибке одного API, второй продолжает работать (graceful degradation)

### 📦 Deliverables
- `backend/src/services/ota/sutochno.ts`
- Обновлён `accommodation.ts` (роут)

### ⏱️ Estimate
8 часов

### 🔗 Dependencies
- Blocked by: #302

### 📚 Resources
- [Суточно.ru API](https://sutochno.ru/info/api)
- [Островок API](https://www.ostrovok.ru/partners/api/)

### 🏁 Definition of Done
- [ ] 2 API интегрированы
- [ ] Данные мержатся
- [ ] Ошибки обрабатываются
- [ ] Commit в git
```

---

#### Issue #304: Нормализация данных
**Labels**: `📦 mvp` `⚙️ backend` `🔴 critical`

```markdown
## 🔄 Нормализация данных из разных OTA

### 📋 Description
Привести данные от Островок, Суточно.ru к единому формату

### 🎯 Acceptance Criteria
- [ ] Создан `backend/src/services/ota/normalizer.ts`
- [ ] Функция `normalizeHotel(rawData, source)` возвращает стандартный объект
- [ ] Все цены в USD (конвертация если нужно)
- [ ] Рейтинг приведён к шкале 0-10
- [ ] Unit тесты для нормализации

### 📦 Deliverables
- `backend/src/services/ota/normalizer.ts`
- `backend/tests/unit/normalizer.test.ts`

### ⏱️ Estimate
5 часов

### 🔗 Dependencies
- Blocked by: #303

### 🏁 Definition of Done
- [ ] Нормализатор создан
- [ ] Тесты проходят
- [ ] Все источники используют normalizer
- [ ] Commit в git
```

---

#### Issue #305: Настроить Redis для кэширования
**Labels**: `📦 mvp` `⚙️ backend` `🔴 critical`

```markdown
## 🗄️ Настроить Redis для кэширования поисковых запросов

### 📋 Description
Добавить Redis для кэша результатов поиска (TTL 1 час)

### 🎯 Acceptance Criteria
- [ ] Добавлен `redis` в `docker-compose.yml`
- [ ] Установлен `ioredis` пакет
- [ ] Создан `backend/src/services/cache.ts`
- [ ] Метод `get(key)` и `set(key, value, ttl)`
- [ ] Search endpoint использует cache (cache key = `search:lat:lng:radius`)

### 📦 Deliverables
- `backend/src/services/cache.ts`
- `docker-compose.yml` (обновлён)
- `.env` (REDIS_URL)

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
Нет (параллельно)

### 🏁 Definition of Done
- [ ] Redis запущен в Docker
- [ ] Cache работает
- [ ] TTL = 1 час
- [ ] Commit в git
```

---

#### Issue #306: Rate limiting
**Labels**: `📦 mvp` `⚙️ backend` `🔴 critical`

```markdown
## 🚦 Rate limiting (100 req/min на IP)

### 📋 Description
Защита от злоупотреблений: максимум 100 запросов в минуту с одного IP

### 🎯 Acceptance Criteria
- [ ] Установлен `@fastify/rate-limit`
- [ ] Лимит: 100 req/min per IP
- [ ] При превышении: HTTP 429 Too Many Requests
- [ ] Whitelist для локальных IP (127.0.0.1)

### 📦 Deliverables
- Обновлён `backend/src/index.ts`

### ⏱️ Estimate
3 часа

### 📚 Resources
- [@fastify/rate-limit](https://github.com/fastify/fastify-rate-limit)

### 🏁 Definition of Done
- [ ] Rate limit работает
- [ ] 429 error при превышении
- [ ] Commit в git
```

---

#### Issue #307: API endpoint POST /api/affiliate/track-click
**Labels**: `📦 mvp` `💰 affiliate` `🔴 critical`

```markdown
## 📊 API endpoint: POST /api/affiliate/track-click

### 📋 Description
Endpoint для логирования кликов по affiliate ссылкам

### 🎯 Acceptance Criteria
- [ ] Endpoint: `POST /api/affiliate/track-click`
- [ ] Request body: `{ widgetId, hotelId, hotelName, ota, price, currency }`
- [ ] Сохранение в таблицу `Click`
- [ ] IP и User-Agent логируются автоматически
- [ ] Response: `{ success: true, clickId }`

### 📦 Deliverables
- `backend/src/routes/affiliate.ts`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #301

### 🏁 Definition of Done
- [ ] Endpoint работает
- [ ] Данные сохраняются в БД
- [ ] Commit в git
```

---

#### Issue #308: Генератор deeplinks с partner_id
**Labels**: `📦 mvp` `💰 affiliate` `🔴 critical`

```markdown
## 🔗 Генератор deeplinks с подстановкой partner_id

### 📋 Description
Сервис для генерации партнёрских ссылок с нужным affiliate ID

### 🎯 Acceptance Criteria
- [ ] Создан `backend/src/services/deeplink.ts`
- [ ] Метод `generate(hotelId, ota, partnerId)` возвращает URL
- [ ] Для Booking.com: добавляется `aid=PARTNER_ID`
- [ ] Для Expedia: добавляется `tpid=PARTNER_ID`
- [ ] Поддержка utm_source, utm_campaign параметров

### 📦 Deliverables
- `backend/src/services/deeplink.ts`

### ⏱️ Estimate
3 часа

### 🔗 Dependencies
- Blocked by: #301

### 🏁 Definition of Done
- [ ] Функция создана
- [ ] Ссылки работают
- [ ] Разные OTA поддерживаются
- [ ] Commit в git
```

---

#### Epic #4: Admin Dashboard
**Labels**: `🚀 epic` `📦 mvp` `👤 admin` `🔴 critical`  
**Timeline**: 3-4 дня

```markdown
## 🚀 [EPIC] Admin: Widget Management & Analytics

### 🎯 Цель
Админ-панель для управления виджетами и аналитики

### 📦 Scope
- [x] CRUD виджетов
- [x] Генератор embed кода
- [x] Управление партнерами
- [x] Базовая аналитика (клики, CTR)

### 🔗 Child Issues
- #401 Страница /widgets в админке
- #402 CRUD виджетов (Refine)
- #403 Генератор embed кода (iframe/JS)
- #404 Preview виджета в админке
- #405 CRUD партнёров
- #406 Страница аналитики
- #407 Метрики: клики, CTR, по виджетам

### ⏱️ Timeline
3-4 дня (32 часа)
```

---

#### Issue #401: Страница /widgets в админке
**Labels**: `📦 mvp` `👤 admin` `🔴 critical`

```markdown
## 📄 Создать страницу /widgets в админ-панели

### 📋 Description
Добавить новый ресурс "Виджеты" в Refine админку

### 🎯 Acceptance Criteria
- [ ] Обновлён `admin/src/App.tsx` (новый resource)
- [ ] Создана папка `admin/src/pages/widgets/`
- [ ] Маршрут `/widgets` добавлен
- [ ] Меню в админке показывает "Виджеты"

### 📦 Deliverables
- Обновлён `admin/src/App.tsx`
- `admin/src/pages/widgets/list.tsx` (пустая страница пока)

### ⏱️ Estimate
2 часа

### 🔗 Dependencies
- Blocked by: #301

### 🏁 Definition of Done
- [ ] Страница открывается
- [ ] Меню работает
- [ ] Commit в git
```

---

#### Issue #402: CRUD виджетов (Refine)
**Labels**: `📦 mvp` `👤 admin` `🔴 critical`

```markdown
## ✏️ Реализовать CRUD для виджетов через Refine

### 📋 Description
Полный CRUD: список, создание, редактирование, удаление виджетов

### 🎯 Acceptance Criteria
- [ ] Страница списка: таблица с виджетами (название, координаты, статус)
- [ ] Кнопка "Создать виджет" → форма
- [ ] Форма: название, lat, lng, radius, type (dropdown), theme
- [ ] Кнопка "Редактировать" → форма с данными
- [ ] Кнопка "Удалить" → подтверждение → удаление

### 📦 Deliverables
- `admin/src/pages/widgets/list.tsx`
- `admin/src/pages/widgets/create.tsx`
- `admin/src/pages/widgets/edit.tsx`

### ⏱️ Estimate
6 часов

### 🔗 Dependencies
- Blocked by: #401

### 🏁 Definition of Done
- [ ] CRUD работает
- [ ] Данные сохраняются в БД
- [ ] Commit в git
```

---

#### Issue #403: Генератор embed кода
**Labels**: `📦 mvp` `👤 admin` `🔴 critical`

```markdown
## 🔧 Генератор embed кода (iframe + JS)

### 📋 Description
На странице виджета показать код для встраивания

### 🎯 Acceptance Criteria
- [ ] После создания виджета показывается модал "Код для встраивания"
- [ ] 2 вкладки: "iframe" и "JavaScript"
- [ ] Кнопка "Скопировать" копирует код в буфер
- [ ] Код содержит правильный widget_id и параметры

### 📦 Deliverables
- Компонент `admin/src/components/EmbedCodeModal.tsx`
- Интеграция в `widgets/create.tsx` и `edit.tsx`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #402

### 📚 Example
```html
<!-- iframe -->
<iframe src="https://ski-concierge.com/widget/ABC123" width="100%" height="600"></iframe>

<!-- JS -->
<div id="ski-map-widget"></div>
<script src="https://ski-concierge.com/embed.js" data-widget-id="ABC123"></script>
```

### 🏁 Definition of Done
- [ ] Модал работает
- [ ] Код копируется
- [ ] Commit в git
```

---

#### Issue #404: Preview виджета в админке
**Labels**: `📦 mvp` `👤 admin` `🟡 high`

```markdown
## 👁️ Превью виджета в админ-панели

### 📋 Description
На странице редактирования показывать live preview виджета

### 🎯 Acceptance Criteria
- [ ] Кнопка "Превью" открывает iframe с виджетом
- [ ] Виджет отображается с текущими настройками (lat, lng, theme)
- [ ] Изменения в форме обновляют preview в реальном времени (опционально)

### 📦 Deliverables
- `admin/src/pages/widgets/preview.tsx`
- Кнопка в `edit.tsx`

### ⏱️ Estimate
5 часов

### 🔗 Dependencies
- Blocked by: #402

### 🏁 Definition of Done
- [ ] Preview работает
- [ ] Виджет отображается корректно
- [ ] Commit в git
```

---

#### Issue #405: CRUD партнёров
**Labels**: `📦 mvp` `👤 admin` `🔴 critical`

```markdown
## 👥 CRUD для партнёров

### 📋 Description
Управление партнёрами: email, domain, affiliate IDs

### 🎯 Acceptance Criteria
- [ ] Создана папка `admin/src/pages/partners/`
- [ ] Список партнёров: таблица (email, name, domain, active)
- [ ] Форма создания: email, name, domain, bookingAffiliateId, expediaAffiliateId
- [ ] Редактирование и удаление работают

### 📦 Deliverables
- `admin/src/pages/partners/list.tsx`
- `admin/src/pages/partners/create.tsx`
- `admin/src/pages/partners/edit.tsx`

### ⏱️ Estimate
5 часов

### 🔗 Dependencies
- Blocked by: #301

### 🏁 Definition of Done
- [ ] CRUD партнёров работает
- [ ] Данные сохраняются
- [ ] Commit в git
```

---

#### Issue #406: Страница аналитики
**Labels**: `📦 mvp` `👤 admin` `🟡 high`

```markdown
## 📊 Страница аналитики: таблица кликов

### 📋 Description
Простая таблица всех кликов по affiliate ссылкам

### 🎯 Acceptance Criteria
- [ ] Страница `/analytics` в админке
- [ ] Таблица: дата, виджет, отель, OTA, цена, партнёр
- [ ] Фильтр по дате (date range picker)
- [ ] Пагинация (50 кликов на страницу)

### 📦 Deliverables
- `admin/src/pages/analytics/dashboard.tsx`

### ⏱️ Estimate
6 часов

### 🔗 Dependencies
- Blocked by: #307

### 🏁 Definition of Done
- [ ] Таблица отображается
- [ ] Фильтры работают
- [ ] Commit в git
```

---

#### Issue #407: Метрики: клики, CTR, по виджетам
**Labels**: `📦 mvp` `👤 admin` `🟡 high`

```markdown
## 📈 Метрики: всего кликов, CTR, breakdown по виджетам

### 📋 Description
Dashboard с основными метриками

### 🎯 Acceptance Criteria
- [ ] Карточки: "Всего кликов", "Всего виджетов", "Средний CTR"
- [ ] График кликов по дням (last 30 days)
- [ ] Таблица: топ-10 виджетов по кликам

### 📦 Deliverables
- Обновлён `dashboard.tsx`
- API endpoint: `GET /api/analytics/stats`

### ⏱️ Estimate
4 часа

### 🔗 Dependencies
- Blocked by: #406

### 🏁 Definition of Done
- [ ] Метрики отображаются
- [ ] График работает
- [ ] Commit в git
```

---

## 🧪 Testing & QA (MVP)

#### Epic #5: Testing & Integration
**Labels**: `🚀 epic` `📦 mvp` `🧪 testing` `🟡 high`  
**Timeline**: 2-3 дня

#### Issue #501: E2E тестирование виджета
**Labels**: `📦 mvp` `🧪 testing` `🔴 critical`

```markdown
## 🧪 E2E тестирование виджета на тестовом сайте

### 📋 Description
Протестировать встраивание виджета на реальном сайте

### 🎯 Acceptance Criteria
- [ ] Создан тестовый HTML файл `tests/e2e/test-site.html`
- [ ] Виджет встраивается через iframe
- [ ] Виджет встраивается через JS script
- [ ] Клик на "Забронировать" ведёт на Booking
- [ ] Affiliate ID в URL корректный

### 📦 Deliverables
- `tests/e2e/test-site.html`
- `tests/e2e/widget.spec.ts` (Playwright)

### ⏱️ Estimate
6 часов

### 🏁 Definition of Done
- [ ] E2E тесты проходят
- [ ] Виджет работает в обоих режимах
- [ ] Commit в git
```

---

#### Issue #502: Unit тесты API endpoints
**Labels**: `📦 mvp` `🧪 testing` `🟡 high`

```markdown
## 🧪 Unit тесты для API endpoints

### 📋 Description
Написать тесты для /search и /track-click

### 🎯 Acceptance Criteria
- [ ] Тест: POST /api/accommodation/search → 200 OK
- [ ] Тест: валидация параметров (lat, lng)
- [ ] Тест: POST /api/affiliate/track-click → сохранение в БД
- [ ] Coverage > 70%

### 📦 Deliverables
- `backend/tests/unit/accommodation/search.test.ts`
- `backend/tests/unit/affiliate/track.test.ts`

### ⏱️ Estimate
8 часов

### 🏁 Definition of Done
- [ ] Тесты проходят
- [ ] Coverage > 70%
- [ ] Commit в git
```

---

## 📚 Документация

#### Issue #601: API документация
**Labels**: `📦 mvp` `📚 docs` `🟢 medium`

```markdown
## 📖 API документация (OpenAPI/Swagger)

### 📋 Description
Создать документацию для всех API endpoints

### 🎯 Acceptance Criteria
- [ ] Создан файл `docs/ACCOMMODATION-API.md`
- [ ] Описаны все endpoints с примерами
- [ ] Request/Response схемы
- [ ] Коды ошибок

### 📦 Deliverables
- `docs/ACCOMMODATION-API.md`

### ⏱️ Estimate
4 часа

### 🏁 Definition of Done
- [ ] Документация написана
- [ ] Примеры корректны
- [ ] Commit в git
```

---

#### Issue #602: Гайд по встраиванию виджета
**Labels**: `📦 mvp` `📚 docs` `🟢 medium`

```markdown
## 📖 Гайд для партнёров: как встроить виджет

### 📋 Description
Инструкция для владельцев сайтов по встраиванию виджета

### 🎯 Acceptance Criteria
- [ ] Создан файл `docs/WIDGET-EMBEDDING.md`
- [ ] Примеры iframe и JS
- [ ] Объяснение параметров
- [ ] FAQ (CORS, проблемы с загрузкой)

### 📦 Deliverables
- `docs/WIDGET-EMBEDDING.md`

### ⏱️ Estimate
3 часа

### 🏁 Definition of Done
- [ ] Гайд написан
- [ ] Примеры работают
- [ ] Commit в git
```

---

## 🎉 Итого: MVP Issues

**PoC**: 5 issues (23 часа)  
**Frontend Widget**: 10 issues (51 час)  
**Backend API**: 8 issues (42 часа)  
**Admin Dashboard**: 7 issues (32 часа)  
**Testing**: 5 issues (24 часа)  
**Docs**: 2 issues (7 часов)

**TOTAL MVP**: 37 issues, 179 часов ≈ **18-22 рабочих дня**

---

## 📌 Как использовать Issues

1. **Скопировать каждый Issue** в GitHub Issues вашего репозитория
2. **Присвоить labels** (создать их предварительно)
3. **Assign** разработчикам
4. **Milestone**: "MVP Release" или "v1 Release"
5. **Linking**: Epic issues связать с child issues через "Blocked by #XXX"

### Создание Labels в GitHub

```bash
# Critical Path
gh label create "🔴 critical" --color d73a4a --description "Critical priority"
gh label create "🟡 high" --color fbca04 --description "High priority"
gh label create "🟢 medium" --color 0e8a16 --description "Medium priority"

# Stages
gh label create "📦 poc" --color 1d76db --description "PoC stage"
gh label create "📦 mvp" --color 0052cc --description "MVP stage"
gh label create "📦 v1" --color 5319e7 --description "v1 stage"

# Categories
gh label create "🎨 frontend" --color c5def5 --description "Frontend task"
gh label create "⚙️ backend" --color bfd4f2 --description "Backend task"
gh label create "👤 admin" --color d4c5f9 --description "Admin panel"
gh label create "🧪 testing" --color ffffff --description "Testing task"
gh label create "📚 docs" --color ededed --description "Documentation"
gh label create "🤖 ai" --color ff6b6b --description "AI/ML component"
gh label create "💰 affiliate" --color ffd93d --description "Affiliate tracking"
gh label create "🗺️ map" --color 6bcf7f --description "Map widget"
gh label create "🚀 epic" --color b60205 --description "Epic (multiple issues)"
```

---

**Готово!** 🎉 Теперь можно создавать Issues и начинать разработку.
