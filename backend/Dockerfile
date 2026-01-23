# Multi-stage build для backend

# Этап 1: Сборка
FROM node:20-alpine AS builder

WORKDIR /app

# Копирование package.json и package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Установка зависимостей
RUN npm ci

# Генерация Prisma Client
RUN npm run prisma:generate

# Копирование исходного кода
COPY . .

# Сборка TypeScript
RUN npm run build

# Этап 2: Production
FROM node:20-alpine

WORKDIR /app

# Установка только production зависимостей
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production && \
    npm run prisma:generate

# Копирование скомпилированного кода
COPY --from=builder /app/dist ./dist

# Открываем порт
EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запуск приложения
CMD ["npm", "start"]
