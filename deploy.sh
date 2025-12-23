#!/bin/bash

# Скрипт для деплоя на VDS

echo "🚀 Starting deployment..."

# Переход в директорию проекта
cd /var/www/infokurort

# Остановка контейнера
echo "⏹️  Stopping container..."
docker-compose down

# Получение последних изменений
echo "📥 Pulling latest changes..."
git pull origin main

# Сборка нового образа
echo "🔨 Building Docker image..."
docker-compose build --no-cache

# Запуск контейнера
echo "▶️  Starting container..."
docker-compose up -d

# Очистка старых образов
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment completed at $(date)"
echo "🌐 Site available at http://infokurort.ru"
