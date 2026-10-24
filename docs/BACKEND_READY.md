# ✅ Backend Setup Complete!

## Что сделано:

### 1. Структура проекта
- ✅ Создана директория `backend/` с полной структурой
- ✅ Настроен TypeScript + Fastify
- ✅ Prisma ORM с pgvector поддержкой

### 2. База данных
- ✅ Prisma schema с моделями:
  - `Resort` - курорты
  - `KnowledgeBase` - документы для RAG с векторными embeddings
  - `Admin` - пользователи админки
  - `ChatLog` - логи чата для аналитики
- ✅ Docker Compose с PostgreSQL + pgvector

### 3. API Endpoints
- ✅ **Auth**: login, register, me
- ✅ **Resorts**: CRUD операции
- ✅ **Knowledge Base**: CRUD + auto-embedding generation
- ✅ **Chat**: RAG-powered chat endpoint
- ✅ **Search**: векторный поиск

### 4. Сервисы
- ✅ OpenAI integration (embeddings + chat completions)
- ✅ JWT authentication middleware
- ✅ Seed script для тестовых данных

## Следующие шаги:

### Вариант А: С Docker (рекомендуется)

1. **Установите Docker Desktop** (если еще не установлен):
   - Скачайте: https://www.docker.com/products/docker-desktop/
   - Установите и запустите

2. **Запустите PostgreSQL**:
   ```powershell
   docker compose up postgres -d
   ```

3. **Примените миграции**:
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Заполните тестовыми данными**:
   ```powershell
   npm run db:seed
   ```

5. **Запустите backend**:
   ```powershell
   npm run dev
   ```

### Вариант Б: С локальным PostgreSQL

Если у вас уже установлен PostgreSQL:

1. **Создайте базу данных**:
   ```sql
   CREATE DATABASE ski_concierge;
   CREATE USER ski_user WITH PASSWORD '<unique-long-password>';
   GRANT ALL PRIVILEGES ON DATABASE ski_concierge TO ski_user;
   ```

2. **Установите pgvector**:
   ```sql
   CREATE EXTENSION vector;
   ```

3. **Обновите DATABASE_URL** в `backend/.env`:
   ```env
   DATABASE_URL="postgresql://ski_user:ski_password@localhost:5432/ski_concierge?schema=public"
   ```

4. **Установите OPENAI_API_KEY** в `backend/.env`:
   ```env
   OPENAI_API_KEY=sk-your-key-here
   ```

5. **Примените миграции и запустите**:
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   npm run dev
   ```

### Вариант В: Supabase (облачная БД)

1. Зарегистрируйтесь на https://supabase.com
2. Создайте новый проект
3. Скопируйте Connection String
4. Обновите `DATABASE_URL` в `.env`
5. Примените миграции

## После запуска:

API будет доступен на http://localhost:3001

### Тестовые запросы:

**Health check:**
```powershell
curl http://localhost:3001/health
```

**Список курортов:**
```powershell
curl http://localhost:3001/api/resorts
```

**Логин:**
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"<ADMIN_EMAIL>\",\"password\":\"<ADMIN_PASSWORD>\"}'
```

## Что дальше?

Админ-панель и интерфейс заявок реализованы в `admin/`. Seed требует `ADMIN_EMAIL` и `ADMIN_PASSWORD` (не менее 12 символов), JWT — случайный `JWT_SECRET` длиной от 32 символов. Настройте значения локально, не добавляя файл окружения в git.

---

Не включайте тестовые персональные данные или заранее известные пароли в production.
