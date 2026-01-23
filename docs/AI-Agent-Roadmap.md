# Дорожная карта: AI-консультант для Ski Concierge

## 🎯 Задачи AI-ассистента

1. **Понять запрос туриста** - уровень катания, даты, бюджет, формат обучения
2. **Подобрать релевантных инструкторов/гидов** - сертификация, курорт, специализация
3. **Ответить на вопросы** - безопасность, условия, правила курортов
4. **Довести до бронирования** - естественная конвертация в заявку
5. **Работать как "умный локальный консьерж"** - не каталог, а советчик

---

## 🧠 Архитектура решения

### LLM-слой
- **Модель**: OpenAI GPT-4o-mini (оптимальное соотношение цена/качество)
- **Fallback**: GPT-4o (для сложных кейсов)
- **Подход**: Промпт-инжиниринг + RAG (НЕ fine-tuning)
- **Минимум галлюцинаций** через правильный RAG и guardrails

### Оркестрация логики: LangChain + LangGraph
**Зачем:** Управление сценариями диалога с ветвлением

```
User intent → Qualification → Safety check → 
Matching → Offer → Booking CTA
```

**Возможности:**
- Ветвление: семья с детьми / фрирайд / новички
- Контроль качества ответов
- Последовательные уточнения
- Естественный flow к бронированию

### RAG через LlamaIndex
**Источники данных:**
- Инструкторы (уровень, сертификация, курорт, цены)
- Гиды (маршруты, сезонность, ограничения)
- Прокаты снаряжения
- Правила курортов
- Экспертный контент ("почему важна сертификация")

**Векторная БД:** Qdrant (self-host для MVP, масштабируемо)

### Память пользователя: LangChain Memory
**Функции:**
- Запоминает предпочтения (семья с детьми, новичок)
- Историю визитов курортов
- Бюджет и пожелания
- Используется для апсейла

### Контроль качества
- Intent-детекция через LLM
- Guardrails (запрет опасных советов)
- Валидация рекомендаций

---

## 🛠 Технологический стек

### Backend
- **AI Orchestration**: LangChain + LangGraph
- **RAG Engine**: LlamaIndex
- **Vector DB**: Qdrant (self-hosted)
- **LLM**: OpenAI GPT-4o-mini / GPT-4o
- **Memory**: LangChain ConversationBufferMemory
- **API**: Express.js / Fastify
- **Database**: Supabase (PostgreSQL + векторы)

### Frontend
- ✅ React + TypeScript
- ✅ Существующий `ChatInterface.tsx`
- **State**: Zustand (для памяти чата)

### Интеграции
- **Бронирование (MVP)**: Telegram Bot + Email
- **CRM (позже)**: MCP (Model Context Protocol) для безопасного доступа
- **Аналитика**: Логирование интентов и конверсий

---

## 📊 Этапы реализации

### 🟢 Фаза 0: Текущее состояние (DONE)

✅ **Базовый AI чат**
- OpenAI GPT-4 интеграция
- Простой промпт (~8000 токенов)
- Function calling (calculate_price, get_resort_info, create_booking_draft)
- localStorage для заявок
- Работает, но дорого ($2.40 за 100 сообщений)

---

### 🟡 Фаза 1: Оптимизация и RAG (1-2 недели)

#### 1.1 Установка зависимостей
```bash
npm install langchain @langchain/openai @langchain/community
npm install llamaindex qdrant-client
npm install zod dotenv
```

#### 1.2 Настройка Qdrant (векторная БД)
```typescript
// src/lib/vector/qdrant-setup.ts
import { QdrantClient } from '@qdrant/js-client-rest';

const client = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

// Создаём коллекцию для знаний
await client.createCollection('ski_knowledge', {
  vectors: {
    size: 1536, // OpenAI embeddings
    distance: 'Cosine',
  },
});
```

**Развертывание Qdrant:**
```bash
# Docker (локально)
docker run -p 6333:6333 qdrant/qdrant

# Или Qdrant Cloud (бесплатно до 1GB)
# https://cloud.qdrant.io
```

#### 1.3 Индексация данных через LlamaIndex
```typescript
// src/lib/rag/indexer.ts
import { VectorStoreIndex, SimpleDirectoryReader } from 'llamaindex';
import { QdrantVectorStore } from 'llamaindex/vector-stores/QdrantVectorStore';

// Загружаем данные
const documents = await new SimpleDirectoryReader().loadData({
  directoryPath: './knowledge-base',
});

// Создаём индекс
const vectorStore = new QdrantVectorStore({
  url: 'http://localhost:6333',
  collectionName: 'ski_knowledge',
});

const index = await VectorStoreIndex.fromDocuments(documents, {
  vectorStore,
});
```

**Структура knowledge-base:**
```
knowledge-base/
├── resorts/
│   ├── roza-hutor.md
│   ├── krasnaya-polyana.md
│   └── gazprom.md
├── instructors/
│   ├── certification.md
│   └── safety-rules.md
├── pricing/
│   └── seasonal-rates.md
└── faq/
    ├── beginners.md
    └── equipment.md
```

#### 1.4 LangChain + RAG интеграция
```typescript
// src/lib/ai/langchain-agent.ts
import { ChatOpenAI } from '@langchain/openai';
import { VectorStoreRetriever } from '@langchain/core/retrievers';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { ChatPromptTemplate } from '@langchain/core/prompts';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
});

// Retriever из Qdrant
const retriever = new VectorStoreRetriever({
  vectorStore: qdrantStore,
  k: 5, // топ-5 релевантных документов
});

// Промпт с RAG
const prompt = ChatPromptTemplate.fromMessages([
  ['system', `Ты - Ski Concierge AI. 
  
  Используй ТОЛЬКО информацию из контекста ниже для ответов.
  Если информации нет - скажи честно.
  
  КОНТЕКСТ:
  {context}
  
  СТИЛЬ:
  - Дружелюбный эксперт
  - Задавай уточняющие вопросы
  - Подводи к бронированию
  `],
  ['human', '{input}'],
]);

// Цепочка RAG
const chain = await createRetrievalChain({
  retriever,
  combineDocsChain: createStuffDocumentsChain({ llm, prompt }),
});
```

**Результат Фазы 1:**
- ✅ Промпт уменьшен до ~500 токенов
- ✅ Данные загружаются динамически через RAG
- ✅ Стоимость: $0.40 за 100 сообщений (в 6 раз дешевле)
- ✅ Легко обновлять knowledge base

---

### 🟡 Фаза 2: LangGraph для сценариев (2-3 недели)

#### 2.1 Определение flow диалога
```typescript
// src/lib/ai/conversation-graph.ts
import { StateGraph, END } from '@langchain/langgraph';

// Состояния диалога
type ConversationState = {
  intent: string;
  userProfile: {
    level?: string;
    dates?: string;
    budget?: string;
    groupType?: 'individual' | 'group' | 'family';
  };
  recommendations: any[];
  stage: 'greeting' | 'qualification' | 'matching' | 'offer' | 'booking';
};

// Граф
const workflow = new StateGraph<ConversationState>({
  channels: {
    intent: null,
    userProfile: {},
    recommendations: [],
    stage: 'greeting',
  },
});

// Узлы
workflow.addNode('detect_intent', detectIntent);
workflow.addNode('qualify_user', qualifyUser);
workflow.addNode('safety_check', safetyCheck);
workflow.addNode('match_instructors', matchInstructors);
workflow.addNode('present_offer', presentOffer);
workflow.addNode('handle_booking', handleBooking);

// Переходы
workflow.addEdge('detect_intent', 'qualify_user');
workflow.addConditionalEdges('qualify_user', shouldCheckSafety, {
  yes: 'safety_check',
  no: 'match_instructors',
});
workflow.addEdge('match_instructors', 'present_offer');
workflow.addEdge('present_offer', 'handle_booking');

workflow.setEntryPoint('detect_intent');
```

#### 2.2 Пример узла: детекция намерения
```typescript
async function detectIntent(state: ConversationState, messages) {
  const llm = new ChatOpenAI({ modelName: 'gpt-4o-mini' });
  
  const prompt = `Определи намерение пользователя:
  
  Сообщение: "${messages[messages.length - 1].content}"
  
  Возможные интенты:
  - info_resort: хочет узнать о курорте
  - price_inquiry: спрашивает о ценах
  - book_lesson: готов бронировать
  - safety_concern: вопросы безопасности
  - equipment: про снаряжение
  
  Ответь одним словом.`;
  
  const intent = await llm.invoke(prompt);
  
  return { ...state, intent: intent.content };
}
```

#### 2.3 Узел: подбор инструкторов
```typescript
async function matchInstructors(state: ConversationState) {
  const { userProfile } = state;
  
  // RAG поиск подходящих инструкторов
  const query = `
    Уровень: ${userProfile.level}
    Даты: ${userProfile.dates}
    Группа: ${userProfile.groupType}
  `;
  
  const results = await retriever.getRelevantDocuments(query);
  
  // Ранжирование
  const recommendations = rankInstructors(results, userProfile);
  
  return { ...state, recommendations, stage: 'offer' };
}
```

**Результат Фазы 2:**
- ✅ Структурированный flow диалога
- ✅ Ветвление под разные сценарии
- ✅ Контроль качества на каждом этапе
- ✅ Естественный переход к бронированию

---

### 🟡 Фаза 3: Память и персонализация (1 неделя)

#### 3.1 LangChain Memory интеграция
```typescript
// src/lib/ai/memory.ts
import { BufferMemory } from 'langchain/memory';
import { ChatMessageHistory } from 'langchain/stores/message/in_memory';

// Хранилище сессий
const sessionStore = new Map<string, BufferMemory>();

export function getMemory(sessionId: string) {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, new BufferMemory({
      chatHistory: new ChatMessageHistory(),
      memoryKey: 'chat_history',
      returnMessages: true,
    }));
  }
  return sessionStore.get(sessionId)!;
}

// Использование
const memory = getMemory(userId);
await memory.saveContext(
  { input: userMessage },
  { output: aiResponse }
);
```

#### 3.2 Персонализация через Supabase
```sql
-- Таблица профилей пользователей
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  preferences JSONB, -- {level: 'beginner', visited: ['roza-hutor']}
  booking_history JSONB[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Триггер для обновления векторов при изменении
CREATE OR REPLACE FUNCTION update_user_embedding()
RETURNS TRIGGER AS $$
BEGIN
  NEW.embedding = generate_embedding(NEW.preferences::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Результат Фазы 3:**
- ✅ Запоминает предпочтения пользователя
- ✅ Персонализированные рекомендации
- ✅ История для апсейла

---

### 🟡 Фаза 4: Интеграция бронирования (1-2 недели)

#### 4.1 Telegram Bot уведомления
```typescript
// src/lib/integrations/telegram.ts
import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

export async function sendBookingNotification(booking: BookingDraft) {
  const message = `
🎿 Новая заявка #${booking.id}

👤 ${booking.name}
📞 ${booking.phone}
📧 ${booking.email}

🏔 Курорт: ${booking.resort}
📅 Даты: ${booking.dates}
👥 Тип: ${booking.category}
📚 Программа: ${booking.program}
🗓 Дней: ${booking.days}

💬 Пожелания: ${booking.specialRequests || 'нет'}
`;

  await bot.telegram.sendMessage(
    process.env.TELEGRAM_CHAT_ID!,
    message
  );
}
```

#### 4.2 Email через Resend
```typescript
// src/lib/integrations/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingEmail(booking: BookingDraft) {
  await resend.emails.send({
    from: 'bookings@ski-concierge.ru',
    to: ['manager@ski-concierge.ru'],
    subject: `Новая заявка: ${booking.name}`,
    html: `<h2>Детали бронирования</h2>...`,
  });
  
  // Подтверждение клиенту
  await resend.emails.send({
    from: 'noreply@ski-concierge.ru',
    to: [booking.email!],
    subject: 'Ваша заявка принята',
    html: `<p>Спасибо! Свяжемся в течение часа.</p>`,
  });
}
```

---

### 🔵 Фаза 5: Guardrails и качество (1 неделя)

#### 5.1 Валидация ответов
```typescript
// src/lib/ai/guardrails.ts
import { z } from 'zod';

const SafeRecommendationSchema = z.object({
  resort: z.enum(['roza-hutor', 'krasnaya-polyana', 'gazprom']),
  instructor_certified: z.boolean().refine(val => val === true),
  safety_notes: z.array(z.string()),
  price_within_budget: z.boolean(),
});

export async function validateRecommendation(response: any) {
  // Проверка что AI не советует опасное
  const parsed = SafeRecommendationSchema.safeParse(response);
  
  if (!parsed.success) {
    throw new Error('AI дал небезопасную рекомендацию');
  }
  
  return parsed.data;
}
```

#### 5.2 Мониторинг качества
```typescript
// src/lib/analytics/tracking.ts
export async function trackConversation(event: {
  sessionId: string;
  intent: string;
  stage: string;
  converted: boolean;
  timestamp: Date;
}) {
  // Логируем в Supabase
  await supabase.from('conversation_analytics').insert(event);
}

// Метрики для мониторинга:
// - Средняя длина диалога до конверсии
// - Топ интенты
// - Причины отвалов
// - Качество подбора
```

---

## 📈 Итоговая архитектура

```
┌─────────────────┐
│   User (React)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ChatInterface  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│   LangChain Orchestrator    │
│  (conversation-graph.ts)    │
└────────┬────────────────────┘
         │
    ┌────┴─────┬─────────┬──────────┐
    │          │         │          │
    ▼          ▼         ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌─────────┐
│LlamaIdx│ │Memory│ │Guardrls│ │Functions│
│  RAG   │ │      │ │        │ │         │
└───┬────┘ └──┬───┘ └────────┘ └────┬────┘
    │         │                      │
    ▼         ▼                      ▼
┌─────────┐ ┌──────────┐      ┌──────────┐
│ Qdrant  │ │ Supabase │      │ Pricing  │
│ Vectors │ │ Profiles │      │   API    │
└─────────┘ └──────────┘      └──────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │ Booking System   │
                          │ (Telegram+Email) │
                          └──────────────────┘
```

---

## 💰 Стоимость и метрики

### Стоимость на 1000 пользователей/месяц

| Компонент | Стоимость |
|-----------|-----------|
| GPT-4o-mini (4 сообщения на пользователя) | $12 |
| Qdrant Cloud (1GB векторов) | Бесплатно |
| Supabase (до 500MB) | Бесплатно |
| Resend (email, 3000 писем) | Бесплатно |
| **ИТОГО** | **~$12/месяц** |

### На 10,000 пользователей/месяц
- GPT-4o-mini: $120
- Qdrant Pro: $25
- Supabase Pro: $25
- Resend: $20
- **ИТОГО: ~$190/месяц**

### Ожидаемые метрики
- **Конверсия в заявку**: 15-25%
- **Среднее время до брони**: 4-7 сообщений
- **Стоимость лида**: $0.05-0.10
- **Точность рекомендаций**: >90% (благодаря RAG)

---

## 🚀 Roadmap по неделям

| Неделя | Задачи | Результат |
|--------|--------|-----------|
| **1-2** | Установка LangChain, Qdrant, индексация данных | RAG работает |
| **3-4** | LangGraph flow, детекция интентов | Структурированный диалог |
| **5** | Память пользователей, Supabase интеграция | Персонализация |
| **6-7** | Telegram + Email бронирования | Полный цикл конверсии |
| **8** | Guardrails, тестирование, запуск | Production ready |

---

## ✅ Критерии успеха MVP

1. **Технические:**
   - ✅ RAG находит релевантную информацию (>80% точность)
   - ✅ Стоимость <$0.50 за 100 сообщений
   - ✅ Время ответа <3 секунд
   - ✅ Нет опасных рекомендаций (guardrails работают)

2. **Бизнес:**
   - ✅ Конверсия в заявку >10%
   - ✅ <5 сообщений до заявки
   - ✅ Менеджер получает полные данные клиента
   - ✅ Клиент получает подтверждение

3. **UX:**
   - ✅ Естественный диалог (не роботизированный)
   - ✅ Понимает разговорный язык
   - ✅ Не теряет контекст
   - ✅ Не повторяется

---

## 🔧 Альтернативные решения

### Если бюджет ограничен:
- Использовать **GPT-3.5-turbo** вместо GPT-4o-mini (в 3 раза дешевле)
- **ChromaDB** вместо Qdrant (локально, бесплатно)
- Без персонализации (убрать Supabase profiles)

### Если нужна максимальная точность:
- **GPT-4o** для финальных рекомендаций
- **Fine-tuning** на реальных диалогах (через 1-2 месяца)
- **Claude 3 Opus** как fallback для сложных кейсов

---

## 📚 Полезные ресурсы

- [LangChain Docs](https://js.langchain.com/docs/)
- [LangGraph Tutorial](https://langchain-ai.github.io/langgraphjs/)
- [LlamaIndex Guide](https://ts.llamaindex.ai/)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

---

**Следующий шаг:** Начать с Фазы 1 (RAG) - это даст максимальную экономию и улучшит качество ответов. Готов помочь с внедрением! 🎿
      { role: "system", content: SYSTEM_PROMPT },
      ...enrichedContext,
      ...messages
    ],
    functions: [
      calculatePriceFunction,
      checkAvailabilityFunction,
      createBookingFunction
    ]
  });
  
  // 4. Обработка function calls
  if (response.function_call) {
    return handleFunctionCall(response);
  }
  
  return response.choices[0].message;
}
```

#### 2.2 Function Calling для действий
- [x] `calculate_price` - расчет стоимости по параметрам
- [ ] ~~`check_availability`~~ - не требуется пока
- [x] `create_booking_draft` - сохранение заявки в JSON
- [x] `get_resort_info` - получение информации о курорте
- [ ] ~~`search_instructors`~~ - не требуется пока

#### 2.3 Хранилище заявок (временное)
```typescript
// src/data/leads.json
[
  {
    "id": "uuid",
    "timestamp": "2025-12-26T10:00:00",
    "name": "Иван Иванов",
    "phone": "+7 999 123-45-67",
    "email": "ivan@example.com",
    "requirements": {
      "resort": "roza-hutor",
      "program": "ind-2h-1p",
      "dates": "28-31 декабря",
      "participants": 2
    },
    "estimatedPrice": 15200,
    "chatTranscript": [...]
  }
]
```

---

### Этап 3: Frontend интеграция (1-2 недели)

#### 3.1 Обновление ChatInterface
```typescript
// src/components/chat/ChatInterface.tsx
import { useChat } from '@/hooks/useAIChat';

export function ChatInterface() {
  const { 
    messages, 
    sendMessage, 
    isLoading,
    suggestedActions 
  } = useAIChat();
  
  // Показ предложенных действий от AI
  {suggestedActions.map(action => (
    <Button onClick={() => handleAction(action)}>
      {action.label}
    </Button>
  ))}
}
```

#### 3.2 Компоненты для интерактивных элементов
- [ ] `PriceCard` - карточка с рассчитанной ценой
- [ ] `BookingForm` - форма бронирования
- [ ] `InstructorCard` - карточка инструктора
- [ ] `CalendarPicker` - выбор дат

#### 3.3 WebSocket для real-time
```typescript
// src/lib/socket.ts
import io from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
  autoConnect: false
});

socket.on('ai_response', (data) => {
  // Обработка ответа AI
});

socket.on('typing', (isTyping) => {
  // Показ индикатора печатания
});
```

---

### Этап 4: Умные функции (2-3 недели)

#### 4.1 RAG (Retrieval Augmented Generation)
```typescript
// Векторное хранилище для базы знаний
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

// Индексирование документов
await indexDocuments([
  'resort-descriptions',
  'instructor-profiles',
  'faq-database'
]);

// Поиск релевантного контекста
const relevantDocs = await vectorStore.similaritySearch(
  userQuery, 
  k: 5
);
```

#### 4.2 Контекстная память
- Отслеживание предпочтений клиента в рамках сессии
- Сохранение важной информации между сообщениями
- Умное предложение следующих шагов

#### 4.3 Sentiment Analysis
- Определение настроения клиента
- Адаптация тона ответов
- Эскалация к оператору при негативе

---

### Этап 5: Воронка бронирования (2 недели)

#### 5.1 Этапы квалификации лида
1. **Знакомство** - узнать имя, опыт катания
2. **Потребности** - цели обучения, даты, бюджет
3. **Предложение** - подбор программы
4. **Расчет** - показ цены
5. **Контакты** - сбор телефона/email
6. **Бронирование** - оформление заявки

#### 5.2 Триггеры для перехода на оператора
```typescript
const escalationTriggers = {
  complexQuestion: sentiment < -0.5,
  repeatedQuestions: questionCount > 3,
  requestOperator: userMessage.includes('оператор'),
  highValue: estimatedPrice > 50000
};
```

#### 5.3 Интеграция с CRM
```typescript
// Отправка лида в CRM
await createLead({
  source: 'ai_chat',
  name: session.name,
  phone: session.phone,
  requirements: session.requirements,
  estimatedValue: calculatedPrice,
  chatTranscript: messages
});
```

---

### Этап 6: Аналитика и оптимизация (ongoing)

#### 6.1 Метрики для отслеживания
- Conversion rate (чат → бронирование)
- Среднее время до квалификации
- Процент эскалаций к оператору
- Удовлетворенность клиентов
- Частые вопросы без ответа

#### 6.2 A/B тестирование
- Разные стили промптов
- Момент предложения бронирования
- Формулировки вопросов

#### 6.3 Continuous Learning
```typescript
// Обратная связь для улучшения
await logFeedback({
  sessionId,
  messageId,
  wasHelpful: true/false,
  comment: userFeedback
});
```

---

## 🔐 Безопасность и модерация

### Защита данных
- [ ] Шифрование персональных данных
- [ ] GDPR compliance
- [ ] Маскирование чувствительной информации в логах

### Модерация контента
- [ ] Фильтр нецензурной лексики
- [ ] Защита от prompt injection
- [ ] Rate limiting для предотвращения спама

---

## 💰 Оценка бюджета

### API costs (ежемесячно)
- OpenAI API: ~$200-500 (зависит от трафика)
- Vector DB (Pinecone): ~$70
- Hosting: ~$50-100

### Development time
- **Total**: 8-12 недель
- Backend: 4-5 недель
- Frontend: 2-3 недели
- Testing & QA: 2 недели
- Deployment: 1 неделя

---

## 📈 План запуска

### Phase 1: MVP (4 недели)
- ✅ Базовый AI чат с GPT-4
- ✅ Простые ответы на вопросы
- ✅ Расчет стоимости
- ✅ Сбор контактов

### Phase 2: Enhanced (4 недели)
- ✅ RAG с базой знаний
- ✅ Function calli (ОБНОВЛЕНО)

### Phase 1: MVP (3-5 дней) ⚡ ТЕКУЩИЙ ЭТАП
- [x] API ключ OpenAI получен
- [ ] Базовый AI чат с GPT-4
- [ ] Простые ответы на вопросы (база знаний)
- [ ] Расчет стоимости (интеграция с калькулятором)
- [ ] Сбор контактов и сохранение в JSON
- [ ] ✅ Автогенерация описаний курортов
- [ ] ✅ Базовые FAQ

### Phase 2: Enhanced (2-3 недели) - ПОЗЖЕ
- [ ] Переход на Supabase/PostgreSQL
- [ ] Email уведомления при заявке
- [ ] Улучшенные промпты на основе feedback
- [ ] Добавление профилей инструкторов

### Phase 3: Advanced (по необходимости) - BACKLOG
- [ ] CRM интеграция
- [ ] Календарь доступности
- [ ] RAG с векторной БД
- [ ] Мультиязычностьатания или будете впервые?
    2. Планируете один или с кем-то?
    3. На какие даты смотрите?

User: Впервые, буду с женой, 28-31 декабря
AI: Замечательно! Для вас идеально подойдут групповые занятия для 
    начинающих. На эти даты сейчас сезон ПИК.
    
    Рекомендую курорт "Роза Хутор":
    • Группы по 4-6 человек
    • Занятия 2 часа
    • Стоимость: 4,800₽ за человека
    
    Или можем подобрать индивидуальное занятие для вас двоих?

User: Давайте индивидуальное
AI: Отлично! Для двоих индивидуальное занятие обойдется в 15,200₽ 
    за 2 часа (сезон ПИК).
    
    Хотите забронировать? Мне понадобится:
    • Ваше имя
    • Телефон для связи
    • Email для подтверждения
```

### Сценарий 2: Опытный райдер
```
User: Хочу фрирайд с гидом
AI: Фрирайд - это круто! 🏔 
    У вас есть опыт катания вне трасс?
    
User: Да, катаюсь 5 лет
AI: Супер! На курорте Газпром есть отличная программа от школы Riders.
    ТОП-инструктор категории А проведет вас по лучшим спотам.
    
    Стоимость: 18,000₽ за 2 часа (до 2 человек)
    
    Какие даты вас интересуют?
```

---

## 📚 Ресурсы и документация

### Полезные библиотеки
- [LangChain](https://js.langchain.com/) - фреймворк для AI приложений
- [Vercel AI SDK](https://sdk.vercel.ai/) - ready-to-use AI hooks
- [OpenAI Node.js](https://github.com/openai/openai-node)

### Референсы
- [ChatGPT UI patterns](https://www.patterns.app/chatgpt)
- [Conversational AI best practices](https://rasa.com/docs/)

---

## ✅ Чеклист перед запуском

- [ ] Тестирование на 50+ реальных сценариях
- [ ] Fallback на оператора работает корректно
- [ ] Мониторинг и алерты настроены
- [ ] Privacy policy обновлена
- [ ] Обучение операторов работе с AI
- [ ] A/B тест с контрольной группой (10% трафика)

---

## 🚀 Next Steps

1. **Утвердить технологический стек**
2. **Подготовить базу знаний**
3. **Создать прототип с mock-данными**
4. **Запустить beta-тестирование**
5. **Soft launch (20% трафика)**
6. **Full launch**

---

*Обновлено: 26 декабря 2025*
