# Roadmap: Админ-панель и RAG система

> **Статус обновлен**: 27 декабря 2025 г.  
> **Фаза 1-2**: ✅ Завершены  
> **Фаза 3-7**: ⏳ В планах

## Обзор архитектуры

### Стек технологий
- **База данных**: PostgreSQL + pgvector расширение ✅
- **Бэкенд**: Node.js + Fastify + TypeScript ✅
- **ORM**: Prisma ✅
- **Админка**: Refine.dev (React + TypeScript) ⏳
- **AI/Embeddings**: OpenAI API (text-embedding-3-small) ✅
- **Деплой**: Docker Compose ✅

---

## Фаза 1: Настройка базы данных ✅ ЗАВЕРШЕНА

### 1.1 PostgreSQL с pgvector
- [x] Создать `docker-compose.yml` с PostgreSQL
- [x] Установить pgvector расширение
- [x] Создать базовую схему БД

### 1.2 Prisma Setup
- [x] Инициализировать Prisma в backend проекте
- [x] Создать schema.prisma с моделями:
  - `Resort` - информация о курортах
  - `KnowledgeBase` - документы для RAG
  - `Admin` - пользователи админки
  - `ChatLog` - логи чата для аналитики
- [x] Настроить поддержку pgvector в Prisma
- [x] Создать и применить миграции

### 1.3 Seed данные
- [x] Скрипт для импорта текущих markdown файлов в БД
- [x] Генерация эмбеддингов для существующего контента
- [x] Тестовый админ аккаунт

---

## Фаза 2: Backend API ✅ ЗАВЕРШЕНА

### 2.1 Инфраструктура
- [x] Создать `backend/` директорию
- [x] Настроить TypeScript, ESLint, Prettier
- [x] Установить Fastify + плагины (CORS, JWT, Helmet)
- [x] Настроить environment variables (.env)
- [x] Структура проекта:
  ```
  backend/
  ├── src/
  │   ├── routes/        # API endpoints
  │   ├── services/      # Бизнес-логика
  │   ├── middleware/    # Auth, validation
  │   ├── utils/         # Helpers
  │   └── index.ts       # Entry point
  ├── prisma/
  │   └── schema.prisma
  └── package.json
  ```

### 2.2 Core API endpoints

#### Resorts (Курорты)
- [x] `GET /api/resorts` - список всех курортов
- [x] `GET /api/resorts/:id` - информация о курорте
- [x] `POST /api/resorts` - создать курорт (auth required)
- [x] `PUT /api/resorts/:id` - обновить курорт (auth required)
- [x] `DELETE /api/resorts/:id` - удалить курорт (auth required)

#### Knowledge Base (RAG)
- [x] `GET /api/knowledge` - список документов (pagination, filters)
- [x] `GET /api/knowledge/:id` - получить документ
- [x] `POST /api/knowledge` - создать документ + генерация embedding
- [x] `PUT /api/knowledge/:id` - обновить + пересчитать embedding
- [x] `DELETE /api/knowledge/:id` - удалить документ
- [ ] `POST /api/knowledge/bulk-import` - массовый импорт (TODO)

#### RAG Search
- [x] `POST /api/search` - векторный поиск по knowledge base
- [x] `POST /api/chat` - RAG-powered chat endpoint
  - Генерация embedding для вопроса
  - Векторный поиск релевантных документов
  - Формирование контекста для LLM
  - Возврат ответа с источниками

#### Admin Auth
- [x] `POST /api/auth/login` - аутентификация
- [x] `POST /api/auth/register` - регистрация (только для супер-админа)
- [x] `GET /api/auth/me` - текущий пользователь
- [ ] `POST /api/auth/logout` - выход (TODO, опционально)

### 2.3 AI Integration
- [x] Сервис для работы с OpenAI API
- [x] Функция генерации embeddings
- [ ] Кэширование embeddings (TODO - оптимизация)
- [ ] Rate limiting для AI endpoints (TODO - оптимизация)

### 2.4 Middleware & Utils
- [x] JWT authentication middleware
- [x] Request validation (Zod schemas)
- [x] Error handling middleware
- [x] Logging (Pino)
- [x] CORS настройка

---

## Фаза 3: Admin Panel ⏳ СЛЕДУЮЩИЙ ЭТАП (4-5 дней)

### 3.1 Refine Setup
- [ ] Создать `admin/` директорию
- [ ] Инициализировать Refine проект
- [ ] Настроить data provider для вашего API
- [ ] Настроить auth provider (JWT)
- [ ] Базовый layout и навигация

### 3.2 Страницы управления

#### Dashboard
- [ ] Статистика по курортам
- [ ] Количество документов в knowledge base
- [ ] Недавние обновления
- [ ] График запросов в чат

#### Курорты
- [ ] Таблица всех курортов
- [ ] Форма создания/редактирования курорта
  - Название, локация
  - Статус (открыт/закрыт)
  - Погодные условия
  - Глубина снега
  - Количество открытых подъемников/трасс
  - Лавнная оценка
- [ ] Bulk update статуса
- [ ] Фильтры и поиск

#### Knowledge Base
- [ ] Таблица документов
- [ ] Rich text editor для контента (Tiptap или Lexical)
- [ ] Категории документов (FAQ, Resort Info, Ski Tips, Safety)
- [ ] Предпросмотр markdown
- [ ] Metadata editor (JSON)
- [ ] Статус embedding (generated/pending)
- [ ] Массовый импорт из файлов

#### Settings
- [ ] Управление пользователями админки
- [ ] API ключи (OpenAI)
- [ ] Настройки RAG (temperature, max tokens, top k results)

### 3.3 UX улучшения
- [ ] Автосохранение черновиков
- [ ] Подтверждения при удалении
- [ ] Toast уведомления
- [ ] Loading states
- [ ] Error boundaries

---

## Фаза 4: RAG Optimization (2-3 дня)

### 4.1 Векторный поиск
- [ ] Настроить индексы pgvector (IVFFlat или HNSW)
- [ ] Benchmark производительности поиска
- [ ] Настроить количество результатов (top-k)
- [ ] Добавить фильтрацию по категориям

### 4.2 Улучшение качества RAG
- [ ] Chunk strategy для длинных документов
- [ ] Гибридный поиск (векторный + полнотекстовый)
- [ ] Re-ranking результатов
- [ ] Кэширование популярных запросов
- [ ] A/B тестирование промптов

### 4.3 Мониторинг
- [ ] Логирование всех RAG запросов
- [ ] Метрики качества ответов
- [ ] Отслеживание токенов OpenAI
- [ ] Feedback loop (thumbs up/down на ответы)

---

## Фаза 5: Интеграция с Frontend (2 дня)

### 5.1 Обновление Chat компонента
- [ ] Переключить с mock данных на реальный API
- [ ] Использовать новый `/api/chat` endpoint
- [ ] Отображение источников (какие документы использованы)
- [ ] Streaming ответов (SSE или WebSocket)

### 5.2 Real-time обновления
- [ ] WebSocket для live статуса курортов
- [ ] Автоматическое обновление информации на сайте
- [ ] Push уведомления об изменениях

---

## Фаза 6: DevOps & Production (2-3 дня)

### 6.1 Docker
- [ ] Dockerfile для backend
- [ ] Dockerfile для admin panel
- [ ] Обновить docker-compose.yml:
  - PostgreSQL + pgvector
  - Backend API
  - Admin panel
  - Frontend (существующий)
  - Nginx (reverse proxy)

### 6.2 Environment Management
- [ ] .env.example файлы
- [ ] Secrets management
- [ ] Разные конфиги для dev/staging/prod

### 6.3 CI/CD
- [ ] GitHub Actions для автотестов
- [ ] Автоматический деплой на изменения в main
- [ ] Database migrations в pipeline

### 6.4 Backup & Monitoring
- [ ] Автобекапы PostgreSQL
- [ ] Мониторинг (Health checks)
- [ ] Error tracking (Sentry?)
- [ ] Логирование в production

---

## Фаза 7: Testing & Documentation (2 дня)

### 7.1 Testing
- [ ] Unit тесты для backend services
- [ ] Integration тесты для API
- [ ] E2E тесты для админки (Playwright)
- [ ] Тесты RAG quality

### 7.2 Documentation
- [ ] API документация (Swagger/OpenAPI)
- [ ] README для backend
- [ ] README для admin panel
- [ ] Инструкция по деплою
- [ ] Гайд по добавлению контента

---

## Timeline

| Фаза | Длительность | Задачи |
|------|--------------|--------|
| 1. База данных | 1-2 дня | PostgreSQL, pgvector, Prisma |
| 2. Backend API | 3-4 дня | Fastify, REST API, AI integration |
| 3. Admin Panel | 4-5 дней | Refine, CRUD интерфейсы |
| 4. RAG Optimization | 2-3 дня | Векторный поиск, качество |
| 5. Frontend Integration | 2 дня | Обновление чата |
| 6. DevOps | 2-3 дня | Docker, CI/CD |
| 7. Testing & Docs | 2 дня | Тесты, документация |
| **Итого** | **16-21 день** | |

---

## Приоритеты для MVP

### Must Have (Минимум для запуска)
1. PostgreSQL + pgvector setup
2. Backend API (resorts + knowledge base CRUD)
3. RAG search endpoint
4. Базовая админка для редактирования курортов и документов
5. Интеграция с фронтендом чатом

### Should Have (Важно, но можно отложить)
6. Advanced RAG (chunking, hybrid search)
7. Мониторинг и аналитика
8. WebSocket для real-time updates

### Nice to Have (Будущие улучшения)
9. A/B тестирование промптов
10. Автоматическое обновление контента из внешних источников
11. Multi-language support для RAG

---

## Технические детали

### Библиотеки

#### Backend
```json
{
  "dependencies": {
    "@fastify/cors": "^9.0.0",
    "@fastify/helmet": "^11.0.0",
    "@fastify/jwt": "^7.0.0",
    "@prisma/client": "^5.0.0",
    "fastify": "^4.24.0",
    "openai": "^4.20.0",
    "pgvector": "^0.1.5",
    "zod": "^3.22.0",
    "pino": "^8.16.0",
    "bcrypt": "^5.1.0"
  }
}
```

#### Admin
```json
{
  "dependencies": {
    "@refinedev/core": "^4.0.0",
    "@refinedev/react-router-v6": "^4.0.0",
    "@refinedev/simple-rest": "^4.0.0",
    "react": "^18.2.0",
    "react-router-dom": "^6.18.0"
  }
}
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ski_concierge"

# API
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key

# OpenAI
OPENAI_API_KEY=sk-...
EMBEDDING_MODEL=text-embedding-3-small

# Admin
ADMIN_PANEL_URL=http://localhost:3002
```

---

## Следующие шаги

1. ✅ Roadmap создан
2. ⬜ Создать структуру проекта (backend/, admin/)
3. ⬜ Setup PostgreSQL + pgvector
4. ⬜ Инициализировать Prisma
5. ⬜ Начать с Backend API (Фаза 2)
