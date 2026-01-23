#!/bin/bash

# Скрипт для деплоя на VDS

set -e  # Остановка при ошибке

echo "🚀 Starting deployment..."

# Переход в директорию проекта
cd /var/www/infokurort

# Остановка контейнеров
echo "⏹️  Stopping containers..."
docker compose down

# Получение последних изменений
echo "📥 Pulling latest changes..."
git pull origin main

# Проверка .env файлов
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Creating from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your production values!"
    exit 1
fi

if [ ! -f backend/.env.production ]; then
    echo "⚠️  Warning: backend/.env.production file not found!"
    exit 1
fi

# Сборка новых образов
echo "🔨 Building Docker images..."
docker compose build --no-cache

# Запуск контейнеров
echo "▶️  Starting containers..."
docker compose up -d

# Ожидание запуска backend
echo "⏳ Waiting for backend to be ready..."
sleep 10

# Применение миграций БД
echo "🗄️  Running database migrations..."
docker compose exec -T backend npm run prisma:migrate deploy || echo "⚠️  Migration warning (may be OK if DB already initialized)"

# Проверка здоровья
echo "🏥 Health check..."
for i in {1..30}; do
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        break
    fi
    echo "⏳ Waiting for backend... ($i/30)"
    sleep 2
done

# Очистка старых образов
echo "🧹 Cleaning up old images..."
docker image prune -f

# Показать статус
echo ""
echo "📊 Container status:"
docker compose ps

echo ""
echo "✅ Deployment completed at $(date)"
echo "🌐 Site available at:"
echo "   - http://infokurort.ru"
echo "   - https://infokurort.ru (if SSL configured)"
echo ""
echo "📝 View logs: docker compose logs -f"

