# Ski Concierge Backend

Backend API для горнолыжного консьержа с RAG-функционалом.

## Технологии

- **Node.js** + **TypeScript**
- **Fastify** - веб-фреймворк
- **Prisma** - ORM
- **PostgreSQL** + **pgvector** - база данных с векторным поиском
- **OpenAI API** - embeddings и chat completions

## Установка

1. Установите зависимости:
```bash
cd backend
npm install
```

2. Создайте `.env` файл (скопируйте из `.env.example`):
```bash
cp .env.example .env
```

3. Настройте переменные окружения в `.env`:
```env
DATABASE_URL="postgresql://ski_user:ski_password@localhost:5432/ski_concierge?schema=public"
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key
```

## Запуск

### Development

1. Запустите PostgreSQL:
```bash
docker-compose up postgres -d
```

2. Примените миграции:
```bash
npm run prisma:migrate
```

3. Заполните базу тестовыми данными:
```bash
npm run db:seed
```

4. Запустите dev-сервер:
```bash
npm run dev
```

Сервер будет доступен на `http://localhost:3001`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация (только super_admin)
- `GET /api/auth/me` - Текущий пользователь

### Resorts
- `GET /api/resorts` - Список курортов
- `GET /api/resorts/:id` - Курорт по ID
- `POST /api/resorts` - Создать курорт 🔒
- `PUT /api/resorts/:id` - Обновить курорт 🔒
- `DELETE /api/resorts/:id` - Удалить курорт 🔒

### Knowledge Base
- `GET /api/knowledge` - Список документов
- `GET /api/knowledge/:id` - Документ по ID
- `POST /api/knowledge` - Создать документ + генерация embedding 🔒
- `PUT /api/knowledge/:id` - Обновить документ 🔒
- `DELETE /api/knowledge/:id` - Удалить документ 🔒

### Chat & RAG
- `POST /api/chat` - RAG-powered чат
- `POST /api/search` - Векторный поиск
- `POST /api/chat/feedback` - Фидбек на ответ

🔒 - требует JWT авторизацию

## Prisma Commands

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание миграции
npm run prisma:migrate

# Prisma Studio (GUI для БД)
npm run prisma:studio

# Seed данные
npm run db:seed
```

## Структура проекта

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── routes/
│   │   ├── auth.ts           # Аутентификация
│   │   ├── resorts.ts        # CRUD курортов
│   │   ├── knowledge.ts      # CRUD knowledge base
│   │   └── chat.ts           # RAG chat endpoints
│   ├── services/
│   │   └── openai.ts         # OpenAI integration
│   ├── middleware/
│   │   └── auth.ts           # JWT middleware
│   └── utils/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
└── package.json
```

## Default Credentials

После seed:
- **Email**: admin@ski-concierge.ru
- **Password**: admin123

⚠️ **Измените эти данные в продакшене!**

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `PORT` | API server port | 3001 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | - |
| `OPENAI_API_KEY` | OpenAI API key | - |
| `EMBEDDING_MODEL` | OpenAI embedding model | text-embedding-3-small |
| `CHAT_MODEL` | OpenAI chat model | gpt-4-turbo-preview |

## Troubleshooting

### pgvector extension not found
Убедитесь, что используете образ `ankane/pgvector` для PostgreSQL.

### Prisma migration errors
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### OpenAI API errors
Проверьте, что `OPENAI_API_KEY` установлен в `.env` файле.
