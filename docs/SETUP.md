# Ski Concierge - Setup Guide

## Быстрый старт

### 1. Установка зависимостей

```powershell
# Backend
cd backend
npm install
cd ..
```

### 2. Настройка переменных окружения

```powershell
# В корне репозитория задайте пароль PostgreSQL
Copy-Item .env.example .env
# Создайте .env файл в backend/
Copy-Item backend\.env.example backend\.env
```

Задайте в корневом `.env` сильный `POSTGRES_PASSWORD`. В `backend\.env` укажите тот же пароль в `DATABASE_URL`, уникальный секрет JWT и учётную запись администратора:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
JWT_SECRET=<random secret, at least 32 characters>
ADMIN_EMAIL=<your admin email>
ADMIN_PASSWORD=<unique password, at least 12 characters>
```

### 3. Запуск PostgreSQL

```powershell
docker compose up postgres -d
```

Подождите ~10 секунд, пока база данных инициализируется.

### 4. Применение миграций

```powershell
cd backend
npm run prisma:generate
npm run prisma:migrate
```

### 5. Заполнение тестовыми данными

```powershell
npm run db:seed
```

Это создаст:
- Учётную запись администратора из `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- 3 курорта без фиктивных погодных/снежных и статусных показателей
- Knowledge base из markdown файлов

### 6. Запуск backend

```powershell
npm run dev
```

Backend будет доступен на http://localhost:3001

### 7. Тестирование API

Проверьте health endpoint:
```powershell
curl http://localhost:3001/health
```

Получите список курортов:
```powershell
curl http://localhost:3001/api/resorts
```

Войдите в систему:
```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'
```

Не храните реальные значения в репозитории или истории команд.

## Структура проекта

```
your-ski-concierge/
├── backend/              # ✅ API сервер
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── services/     # OpenAI, etc
│   │   └── middleware/   # Auth
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── admin/                # ✅ Админ-панель
├── src/                  # ✅ Frontend (существующий)
├── knowledge-base/       # ✅ Markdown files для RAG
└── docker-compose.yml    # ✅ PostgreSQL + Services
```

## Следующие шаги

1. ✅ Backend API и таблица заявок
2. ✅ Admin panel для курортов, базы знаний и заявок
3. ✅ Frontend интегрирован с backend API
4. Настроить production-секреты, домен админки и Telegram при необходимости

## Полезные команды

```powershell
# Просмотр логов PostgreSQL
docker-compose logs -f postgres

# Остановить все сервисы
docker-compose down

# Prisma Studio (GUI для БД)
cd backend
npm run prisma:studio

# Пересоздать БД
npm run prisma:migrate reset
```

## API Documentation

После запуска сервера доступна документация:
- Health: http://localhost:3001/health
- Endpoints описаны в backend/README.md

## Troubleshooting

### "Error: P1001: Can't reach database server"
PostgreSQL еще не запустился. Подождите 10-15 секунд и попробуйте снова.

### "Module not found"
```powershell
cd backend
npm install
```

### "pgvector extension not found"
Убедитесь, что используете образ `ankane/pgvector:latest` в docker-compose.yml
