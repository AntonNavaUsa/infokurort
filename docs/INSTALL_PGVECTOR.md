# Установка pgvector для PostgreSQL 17 на Windows

## Способ 1: Скачать предсобранные бинарники

1. **Скачайте pgvector для Windows:**
   - Перейдите: https://github.com/pgvector/pgvector/releases
   - Найдите последний релиз
   - Скачайте файл для PostgreSQL 17 Windows

2. **Установите расширение:**
   ```powershell
   # Найдите директорию PostgreSQL
   $pgDir = "C:\Program Files\PostgreSQL\17"
   
   # Скопируйте файлы (замените путь на скачанный архив)
   # vector.dll -> $pgDir\lib\
   # vector.control, vector--*.sql -> $pgDir\share\extension\
   ```

3. **Включите расширение:**
   ```powershell
   $env:PGPASSWORD='infokurort'
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U infokurort_user -d ski_concierge -c "CREATE EXTENSION vector;"
   ```

---

## Способ 2: Компиляция из исходников (сложнее)

Требует Visual Studio и MSVC:

```powershell
# Установите Visual Studio Build Tools
# Затем:
git clone https://github.com/pgvector/pgvector.git
cd pgvector
# Следуйте инструкциям для Windows в README
```

---

## Способ 3: Использовать Docker PostgreSQL (проще всего)

Поскольку у вас Docker установлен, используем готовый образ с pgvector:

```powershell
# 1. Запустите Docker Desktop

# 2. Запустите PostgreSQL с pgvector
docker run -d `
  --name ski_postgres `
  -e POSTGRES_USER=infokurort_user `
  -e POSTGRES_PASSWORD=infokurort `
  -e POSTGRES_DB=ski_concierge `
  -p 5433:5432 `
  ankane/pgvector:latest

# 3. Обновите backend/.env
# DATABASE_URL="postgresql://infokurort_user:infokurort@localhost:5433/ski_concierge?schema=public"

# 4. Пересоздайте миграции с pgvector
```

---

## Способ 4: Supabase (облачный PostgreSQL с pgvector)

Самый простой вариант без установки:

1. Зарегистрируйтесь на https://supabase.com
2. Создайте проект
3. Скопируйте Connection String
4. Обновите `backend/.env`
5. pgvector уже включен по умолчанию!

---

## Рекомендация

Для разработки рекомендую **Способ 3 (Docker)** - быстро и работает гарантированно.

Для production можно использовать Supabase или скомпилировать pgvector.

**Какой способ выберете?**
