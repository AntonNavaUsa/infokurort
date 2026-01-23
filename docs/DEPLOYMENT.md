# 🚀 Руководство по деплою Ski Concierge на VDS сервер

## 📋 Требования к серверу

### Минимальная конфигурация:
- **ОС**: Ubuntu 20.04 / 22.04 или Debian 11+
- **RAM**: 2 GB минимум (рекомендуется 4 GB)
- **Диск**: 20 GB свободного места
- **CPU**: 1-2 ядра

### Необходимое ПО:
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Nginx (опционально, для reverse proxy)

---

## 🔧 Подготовка сервера

### 1. Подключение к серверу

```bash
ssh root@infokurort.ru
# или
ssh user@your-server-ip
```

### 2. Обновление системы

```bash
apt update && apt upgrade -y
```

### 3. Установка Docker

```bash
# Установка зависимостей
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Добавление репозитория Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Установка Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Запуск Docker
systemctl start docker
systemctl enable docker

# Проверка установки
docker --version
docker compose version
```

### 4. Установка Git

```bash
apt install -y git
```

---

## 📥 Клонирование проекта

### 1. Создание директории для проекта

```bash
mkdir -p /var/www
cd /var/www
```

### 2. Клонирование репозитория

```bash
# Если у вас приватный репозиторий, настройте SSH ключи
git clone https://github.com/your-username/your-ski-concierge.git infokurort
cd infokurort
```

**Альтернатива**: загрузите проект через SCP/SFTP с вашего локального компьютера.

---

## ⚙️ Настройка переменных окружения

### 1. Создание .env файла для Docker Compose

```bash
cp .env.example .env
nano .env
```

Заполните следующие значения:

```env
# PostgreSQL Configuration
POSTGRES_USER=ski_user
POSTGRES_PASSWORD=YOUR_SECURE_DB_PASSWORD_HERE  # Смените на сильный пароль!
POSTGRES_DB=ski_concierge
POSTGRES_PORT=5432

# Backend Configuration
BACKEND_PORT=3001

# Frontend Configuration  
FRONTEND_PORT=80
```

### 2. Настройка backend/.env.production

```bash
cp backend/.env.production backend/.env.production.bak
nano backend/.env.production
```

Обязательно заполните:

```env
# Database (используйте тот же пароль что и в .env)
DATABASE_URL=postgresql://ski_user:YOUR_SECURE_DB_PASSWORD@postgres:5432/ski_concierge?schema=public

# Server
PORT=3001
NODE_ENV=production

# OpenAI API (получите на https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-real-openai-api-key-here

# JWT Secret (генерируйте командой: openssl rand -base64 32)
JWT_SECRET=YOUR_RANDOM_SECRET_HERE

# CORS Origins
CORS_ORIGINS=http://infokurort.ru,https://infokurort.ru
```

**Генерация JWT секрета:**

```bash
openssl rand -base64 32
```

---

## 🏗️ Сборка и запуск

### 1. Сборка Docker образов

```bash
docker compose build --no-cache
```

Это займет несколько минут при первом запуске.

### 2. Запуск контейнеров

```bash
docker compose up -d
```

### 3. Проверка статуса

```bash
docker compose ps
```

Все контейнеры должны быть в статусе `running` (здоровые).

### 4. Просмотр логов

```bash
# Все сервисы
docker compose logs -f

# Только backend
docker compose logs -f backend

# Только frontend
docker compose logs -f infokurort

# Только база данных
docker compose logs -f postgres
```

---

## 🗄️ Инициализация базы данных

### 1. Применение миграций Prisma

```bash
docker compose exec backend npm run prisma:migrate
```

### 2. Заполнение тестовыми данными (опционально)

```bash
docker compose exec backend npm run db:seed
```

Это создаст:
- Админ аккаунт: `admin@ski-concierge.ru` / `admin123`
- 3 курорта (Роза Хутор, Газпром, Красная Поляна)
- Базу знаний из markdown файлов

---

## 🌐 Настройка Nginx (reverse proxy)

### Зачем нужен Nginx?

- SSL/TLS сертификаты (HTTPS)
- Проксирование запросов к backend API
- Кэширование и сжатие
- Балансировка нагрузки

### 1. Установка Nginx

```bash
apt install -y nginx
```

### 2. Создание конфигурации сайта

```bash
nano /etc/nginx/sites-available/infokurort.ru
```

Скопируйте и вставьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name infokurort.ru www.infokurort.ru;

    # Логи
    access_log /var/log/nginx/infokurort.access.log;
    error_log /var/log/nginx/infokurort.error.log;

    # Frontend (SPA)
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
```

### 3. Активация конфигурации

```bash
# Создание символической ссылки
ln -s /etc/nginx/sites-available/infokurort.ru /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
nginx -t

# Перезагрузка Nginx
systemctl reload nginx
systemctl enable nginx
```

---

## 🔒 Установка SSL сертификата (HTTPS)

### Использование Let's Encrypt (бесплатно)

```bash
# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Получение сертификата
certbot --nginx -d infokurort.ru -d www.infokurort.ru

# Автообновление сертификата (тест)
certbot renew --dry-run
```

Certbot автоматически настроит SSL и обновит вашу конфигурацию Nginx.

---

## 🔄 Автоматический деплой (используя deploy.sh)

Ваш проект уже содержит скрипт автоматического деплоя!

### 1. Сделать скрипт исполняемым

```bash
chmod +x /var/www/infokurort/deploy.sh
```

### 2. Запуск деплоя

```bash
cd /var/www/infokurort
./deploy.sh
```

Скрипт выполнит:
1. ⏹️ Остановку контейнеров
2. 📥 Получение последних изменений из Git
3. 🔨 Пересборку Docker образов
4. ▶️ Запуск контейнеров
5. 🧹 Очистку старых образов

---

## 📊 Мониторинг и управление

### Полезные команды Docker Compose

```bash
# Просмотр статуса
docker compose ps

# Просмотр логов
docker compose logs -f

# Перезапуск всех сервисов
docker compose restart

# Перезапуск одного сервиса
docker compose restart backend

# Остановка всех сервисов
docker compose down

# Остановка и удаление volumes (ВНИМАНИЕ: удалит данные БД!)
docker compose down -v

# Пересборка и перезапуск
docker compose up -d --build

# Вход в контейнер
docker compose exec backend sh
docker compose exec postgres psql -U ski_user -d ski_concierge
```

### Проверка здоровья приложения

```bash
# Health check backend
curl http://localhost:3001/health

# Проверка frontend
curl http://localhost/

# Проверка через внешний URL
curl http://infokurort.ru
curl http://infokurort.ru/api/resorts
```

### Просмотр использования ресурсов

```bash
# Мониторинг в реальном времени
docker stats

# Использование диска
docker system df

# Очистка неиспользуемых ресурсов
docker system prune -a
```

---

## 🐛 Решение проблем

### Проблема: Контейнер backend не запускается

```bash
# Проверить логи
docker compose logs backend

# Проверить переменные окружения
docker compose exec backend env | grep DATABASE_URL

# Пересоздать контейнер
docker compose up -d --force-recreate backend
```

### Проблема: База данных не подключается

```bash
# Проверить статус PostgreSQL
docker compose ps postgres

# Проверить логи
docker compose logs postgres

# Подключиться к базе вручную
docker compose exec postgres psql -U ski_user -d ski_concierge

# Проверить здоровье
docker compose exec postgres pg_isready -U ski_user
```

### Проблема: Нехватка места на диске

```bash
# Проверить использование
df -h

# Очистка Docker
docker system prune -a --volumes

# Удаление старых логов
journalctl --vacuum-time=7d
```

### Проблема: Порты заняты

```bash
# Проверить какой процесс использует порт
lsof -i :80
lsof -i :3001
lsof -i :5432

# Остановить процесс или изменить порты в .env
```

---

## 🔄 Обновление приложения

### Метод 1: Используя deploy.sh (рекомендуется)

```bash
cd /var/www/infokurort
./deploy.sh
```

### Метод 2: Вручную

```bash
cd /var/www/infokurort

# Остановка
docker compose down

# Получение обновлений
git pull origin main

# Пересборка
docker compose build --no-cache

# Запуск
docker compose up -d

# Проверка
docker compose logs -f
```

---

## 📱 Тестирование после деплоя

### 1. Проверка frontend

Откройте в браузере: `http://infokurort.ru` или `https://infokurort.ru`

### 2. Проверка backend API

```bash
# Health check
curl http://infokurort.ru/health

# Получение курортов
curl http://infokurort.ru/api/resorts

# Авторизация
curl -X POST http://infokurort.ru/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ski-concierge.ru","password":"admin123"}'
```

### 3. Проверка AI чата

Откройте сайт и протестируйте чат-бота с вопросами о курортах и инструкторах.

---

## 🔐 Безопасность

### Обязательные меры безопасности:

1. **Смените пароли БД**
   - Используйте сильные пароли в `.env` и `backend/.env.production`

2. **Настройте firewall**
   ```bash
   ufw allow 22/tcp    # SSH
   ufw allow 80/tcp    # HTTP
   ufw allow 443/tcp   # HTTPS
   ufw enable
   ```

3. **Настройте регулярное резервное копирование БД**
   ```bash
   # Создать backup скрипт
   nano /usr/local/bin/backup-ski-db.sh
   ```

   ```bash
   #!/bin/bash
   BACKUP_DIR="/var/backups/ski-concierge"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   mkdir -p $BACKUP_DIR
   
   docker compose exec -T postgres pg_dump -U ski_user ski_concierge > \
     "$BACKUP_DIR/backup_$DATE.sql"
   
   # Удалить backups старше 30 дней
   find $BACKUP_DIR -name "backup_*.sql" -mtime +30 -delete
   ```

   ```bash
   chmod +x /usr/local/bin/backup-ski-db.sh
   
   # Добавить в cron (каждый день в 3:00)
   crontab -e
   # Добавить строку:
   0 3 * * * /usr/local/bin/backup-ski-db.sh
   ```

4. **Ограничьте доступ к SSH**
   - Используйте SSH ключи вместо паролей
   - Измените SSH порт (опционально)

---

## 📝 Checklist деплоя

- [ ] Сервер подготовлен (Docker, Git установлены)
- [ ] Проект склонирован в `/var/www/infokurort`
- [ ] `.env` создан и заполнен
- [ ] `backend/.env.production` создан и заполнен
- [ ] OpenAI API ключ добавлен
- [ ] JWT секрет сгенерирован
- [ ] Пароли БД изменены на безопасные
- [ ] Docker контейнеры собраны и запущены
- [ ] Миграции БД применены
- [ ] Nginx установлен и настроен (опционально)
- [ ] SSL сертификат установлен (опционально)
- [ ] Firewall настроен
- [ ] Backup настроен
- [ ] Приложение протестировано

---

## 🎯 Быстрый старт (TL;DR)

Если сервер уже настроен с Docker и Git:

```bash
# 1. Клонирование
cd /var/www
git clone <your-repo-url> infokurort
cd infokurort

# 2. Конфигурация
cp .env.example .env
nano .env  # Заполните пароли

cp backend/.env.production backend/.env.production.bak
nano backend/.env.production  # Заполните OpenAI ключ, JWT секрет, пароли

# 3. Запуск
docker compose build --no-cache
docker compose up -d

# 4. Инициализация БД
docker compose exec backend npm run prisma:migrate
docker compose exec backend npm run db:seed

# 5. Проверка
docker compose ps
curl http://localhost:3001/health
```

Готово! Сайт доступен на `http://infokurort.ru` 🎉

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте логи: `docker compose logs -f`
2. Проверьте статус: `docker compose ps`
3. Проверьте переменные окружения в `.env` и `backend/.env.production`

---

**Успешного деплоя! 🚀⛷️**
