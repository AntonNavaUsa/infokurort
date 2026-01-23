# Ski Concierge - Admin Panel

Админ-панель для управления контентом горнолыжного консьержа.

## Технологии

- **Refine.dev** - React framework для админок
- **React Router** - роутинг
- **Ant Design** - UI компоненты
- **TypeScript**

## TODO: Установка

```bash
cd admin
npm create refine-app@latest .
```

Выберите:
- ✅ TypeScript
- ✅ React Router
- ✅ REST API
- ✅ Ant Design

## Структура (планируемая)

```
admin/
├── src/
│   ├── pages/
│   │   ├── dashboard/         # Главная страница со статистикой
│   │   ├── resorts/           # Управление курортами
│   │   │   ├── list.tsx
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   └── show.tsx
│   │   ├── knowledge/         # Управление knowledge base
│   │   │   ├── list.tsx
│   │   │   ├── create.tsx
│   │   │   ├── edit.tsx
│   │   │   └── show.tsx
│   │   ├── chat-logs/         # Просмотр логов чата
│   │   ├── admins/            # Управление админами
│   │   └── settings/          # Настройки
│   ├── components/
│   │   ├── RichTextEditor.tsx # Markdown/Rich text editor
│   │   ├── MetadataEditor.tsx # JSON metadata editor
│   │   └── ResortStatusBadge.tsx
│   ├── providers/
│   │   ├── authProvider.ts    # JWT auth
│   │   └── dataProvider.ts    # REST API client
│   └── App.tsx
└── package.json
```

## Возможности

### Dashboard
- Статистика по курортам
- График обращений в чат
- Последние обновления контента
- Метрики качества RAG

### Управление курортами
- CRUD операции
- Быстрое обновление статуса
- Bulk update
- Фильтры и поиск

### Knowledge Base
- Rich text editor для контента
- Автоматическая генерация embeddings
- Категоризация документов
- Импорт из markdown файлов
- Предпросмотр

### Chat Logs
- Просмотр истории чата
- Фильтры по дате, session ID
- Просмотр использованных источников
- Метрики: время ответа, токены
- Feedback (positive/negative)

### Settings
- API ключи
- Настройки RAG (temperature, top_k)
- Управление пользователями

## Environment Variables

```env
VITE_API_URL=http://localhost:3001/api
```

## Этапы разработки

1. ⏳ Инициализация Refine проекта
2. ⏳ Настройка authProvider (JWT)
3. ⏳ Настройка dataProvider (REST API)
4. ⏳ Создание страниц CRUD
5. ⏳ Интеграция Rich Text Editor
6. ⏳ Dashboard с аналитикой
7. ⏳ Deploy

---

**Статус**: Планирование завершено, ожидает реализации
