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
# Создайте .env файл в backend/
cp backend\.env.example backend\.env
```

Откройте `backend\.env` и установите ваш OpenAI API ключ:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Запуск PostgreSQL

```powershell
docker-compose up postgres -d
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
- Админ аккаунт (admin@ski-concierge.ru / admin123)
- 3 курорта (Роза Хутор, Газпром, Красная Поляна)
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
  -d '{"email":"admin@ski-concierge.ru","password":"admin123"}'
```

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
├── admin/                # ⏳ TODO: Admin panel
├── src/                  # ✅ Frontend (существующий)
├── knowledge-base/       # ✅ Markdown files для RAG
└── docker-compose.yml    # ✅ PostgreSQL + Services
```

## Следующие шаги

1. ✅ Backend API готов
2. ⏳ Создать Admin panel (Refine)
3. ⏳ Интегрировать frontend с backend API
4. ⏳ Deploy

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
