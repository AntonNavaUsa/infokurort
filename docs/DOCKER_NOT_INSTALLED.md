# ⚠️ Docker не установлен

## Варианты решения:

### Вариант 1: Установить Docker Desktop (рекомендуется)

1. **Скачайте Docker Desktop для Windows:**
   https://www.docker.com/products/docker-desktop/

2. **Установите и запустите Docker Desktop**

3. **После установки выполните:**
   ```powershell
   docker compose up postgres -d
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   npm run dev
   ```

---

### Вариант 2: Использовать Supabase (бесплатно, быстро)

**Supabase** - это облачный PostgreSQL с pgvector из коробки.

#### Шаги:

1. **Зарегистрируйтесь на Supabase:**
   https://supabase.com

2. **Создайте новый проект:**
   - Придумайте имя: `ski-concierge`
   - Выберите регион (ближайший)
   - Создайте пароль для БД

3. **Получите Connection String:**
   - В проекте откройте `Settings` → `Database`
   - Скопируйте `Connection string` (URI)
   - Формат: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

4. **Обновите backend/.env:**
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
   ```

5. **Включите pgvector extension в Supabase:**
   - Откройте SQL Editor в Supabase
   - Выполните:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```

6. **Выполните миграции:**
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   npm run dev
   ```

---

### Вариант 3: Локальный PostgreSQL (если уже установлен)

Если у вас уже установлен PostgreSQL локально:

1. **Создайте базу данных:**
   ```sql
   CREATE DATABASE ski_concierge;
   CREATE USER ski_user WITH PASSWORD 'ski_password';
   GRANT ALL PRIVILEGES ON DATABASE ski_concierge TO ski_user;
   \c ski_concierge
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

   **Примечание**: для pgvector нужно установить расширение:
   - Windows: https://github.com/pgvector/pgvector#windows
   - Или используйте облачные решения (Supabase проще)

2. **Обновите backend/.env:**
   ```env
   DATABASE_URL="postgresql://ski_user:ski_password@localhost:5432/ski_concierge?schema=public"
   ```

3. **Выполните миграции:**
   ```powershell
   cd backend
   npm run prisma:generate
   npm run prisma:migrate
   npm run db:seed
   npm run dev
   ```

---

## Рекомендация

Для разработки рекомендую **Supabase** (Вариант 2):
- ✅ Бесплатный тариф
- ✅ pgvector уже включен
- ✅ Не нужно устанавливать Docker
- ✅ Работает из любого места
- ✅ Встроенная админка для просмотра данных
- ✅ Готов за 5 минут

Для production можно перейти на Docker/VPS позже.

---

## Что делать дальше?

Выберите один из вариантов выше, затем:

1. Настройте `DATABASE_URL` в `backend/.env`
2. Добавьте `OPENAI_API_KEY` в `backend/.env`
3. Выполните команды миграции и запуска

Нужна помощь с настройкой? Скажите какой вариант выбрали!
