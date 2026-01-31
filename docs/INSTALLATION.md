# 📦 Установка зависимостей для модуля карты

## Frontend зависимости

Добавить в корневой `package.json`:

```bash
# В корне проекта
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

Или вручную добавить в `dependencies`:
```json
"leaflet": "^1.9.4",
"react-leaflet": "^4.2.1"
```

И в `devDependencies`:
```json
"@types/leaflet": "^1.9.8"
```

---

## Backend зависимости

```bash
cd backend
npm install ioredis @fastify/rate-limit
```

Или добавить в `backend/package.json`:
```json
"dependencies": {
  "ioredis": "^5.3.2",
  "@fastify/rate-limit": "^9.1.0"
}
```

---

## CSS для Leaflet

Убедитесь, что в компоненте импортирован CSS:

```typescript
// src/components/map/MapWidget.tsx
import 'leaflet/dist/leaflet.css';
```

---

## Docker services

Обновить `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # ... existing services (postgres, etc)

  redis:
    image: redis:7-alpine
    container_name: ski-concierge-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - ski-network

volumes:
  # ... existing volumes
  redis_data:

networks:
  ski-network:
    driver: bridge
```

---

## Environment variables

### Backend `.env`

```env
# Database (existing)
DATABASE_URL="postgresql://..."

# JWT (existing)
JWT_SECRET="..."

# OpenAI (existing)
OPENAI_API_KEY="..."

# NEW: Redis
REDIS_URL=redis://localhost:6379

# NEW: Booking.com Affiliate
BOOKING_API_KEY=your_booking_api_key_here
BOOKING_AFFILIATE_ID=your_booking_affiliate_id

# NEW: Expedia Affiliate (optional)
EXPEDIA_API_KEY=your_expedia_key
EXPEDIA_AFFILIATE_ID=your_expedia_tpid

# NEW: Agoda Affiliate (optional, for v1)
AGODA_AFFILIATE_ID=your_agoda_cid
```

### Frontend `.env`

```env
# Existing
VITE_API_URL=http://localhost:3001/api
```

---

## Проверка установки

После установки всех зависимостей:

```bash
# Проверить frontend
npm list leaflet react-leaflet

# Проверить backend
cd backend
npm list ioredis @fastify/rate-limit

# Запустить Redis
docker-compose up -d redis

# Проверить Redis работает
redis-cli ping
# Должен вернуть: PONG
```

---

## Возможные проблемы

### Leaflet маркеры не отображаются

Если маркеры на карте не видны, добавьте fix для иконок:

```typescript
// src/components/map/MapWidget.tsx
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
```

### Redis connection error

Убедитесь что Redis запущен:
```bash
docker-compose ps redis
```

Если не запущен:
```bash
docker-compose up -d redis
```

---

## Готово!

После установки всех зависимостей можно запускать проект:

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
npm run dev

# Terminal 3: Admin
cd admin && npm run dev
```
