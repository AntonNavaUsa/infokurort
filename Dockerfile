# Multi-stage build для оптимизации размера

# Этап 1: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# Этап 2: Production с Nginx
FROM nginx:alpine

# Копирование собранных файлов из первого этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
