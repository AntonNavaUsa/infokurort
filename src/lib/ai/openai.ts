import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat';
import { SYSTEM_PROMPT, FUNCTION_DEFINITIONS } from './prompts';
import { calculatePrice, getSeasonByDate, skiSchoolPricing } from '@/data/skiSchoolPricing';
import { getResortById } from '@/data/resorts';
import { searchFAQ } from '@/data/faq';
import { saveBooking, type BookingDraft } from './bookings';
import { searchKnowledge, formatContext, detectCategory, initializeRAG } from './rag';
import { aiLogger } from './logger';

// Начинаем новую сессию логирования
aiLogger.startSession();

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Для MVP работаем напрямую из браузера
});

// Инициализируем RAG при загрузке модуля
initializeRAG().catch(console.error);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  functionCall?: {
    name: string;
    arguments: any;
  };
}

// Функции для вызова AI
const functions = {
  calculate_price: (args: {
    resort: string;
    date: string;
    category: string;
    program: string;
    days: number;
  }) => {
    try {
      const dateObj = new Date(args.date);
      const season = getSeasonByDate(dateObj, args.resort as any);
      
      // Ищем программу в базе
      const lesson = skiSchoolPricing.find(
        p => p.resort === args.resort && 
             p.category === args.category && 
             p.type === args.program
      );

      if (!lesson) {
        return {
          error: true,
          message: `К сожалению, не удалось найти программу "${args.program}" категории ${args.category} для курорта ${args.resort}`,
        };
      }

      // Получаем цену за день используя существующую функцию
      const pricePerDay = calculatePrice(lesson.id, dateObj);
      
      if (!pricePerDay) {
        return {
          error: true,
          message: `Не удалось рассчитать цену для выбранных параметров`,
        };
      }

      const totalPrice = pricePerDay * args.days;

      return {
        success: true,
        resort: args.resort,
        program: args.program,
        category: args.category,
        days: args.days,
        season: season,
        pricePerDay: pricePerDay,
        totalPrice: totalPrice,
        message: `Стоимость программы "${args.program}" на курорте ${args.resort} в ${season} сезон: ${pricePerDay}₽ за день. За ${args.days} дн.: ${totalPrice}₽`,
      };
    } catch (error) {
      return {
        error: true,
        message: `Ошибка при расчете: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
      };
    }
  },

  get_resort_info: (args: { resortId: string }) => {
    const resort = getResortById(args.resortId as any);
    if (!resort) {
      return { error: true, message: 'Курорт не найден' };
    }
    return {
      success: true,
      resort: resort,
      message: `${resort.name}: ${resort.description}`,
    };
  },

  create_booking_draft: (args: Omit<BookingDraft, 'id' | 'timestamp'>) => {
    // Генерируем ID для заявки
    const bookingId = `BOOKING-${Date.now()}`;
    const draft: BookingDraft = {
      id: bookingId,
      timestamp: new Date().toISOString(),
      ...args,
    };

    // Сохраняем через утилиту
    try {
      saveBooking(draft);

      return {
        success: true,
        bookingId,
        message: `Отлично! Я создал заявку №${bookingId}. Наш менеджер свяжется с вами в ближайшее время по телефону ${args.phone}`,
      };
    } catch (error) {
      return {
        error: true,
        message: 'Ошибка при сохранении заявки',
      };
    }
  },

  search_faq: (args: { query: string }) => {
    const results = searchFAQ(args.query);
    if (results.length === 0) {
      return {
        success: false,
        message: 'По вашему запросу ничего не найдено в базе FAQ',
      };
    }
    return {
      success: true,
      results: results,
      message: `Найдено ${results.length} подходящих вопросов`,
    };
  },
};

export async function sendChatMessage(
  messages: Message[]
): Promise<ChatResponse> {
  try {
    // Получаем последнее сообщение пользователя
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    
    // Ищем релевантную информацию через RAG
    const category = detectCategory(lastUserMessage);
    const relevantDocs = await searchKnowledge(lastUserMessage, 3);
    const context = formatContext(relevantDocs);
    
    // Логируем RAG поиск
    const ragSearchLog = aiLogger.logRAGSearch({
      query: lastUserMessage,
      category,
      documents: relevantDocs,
    });
    
    console.log(`🔍 RAG найдено ${relevantDocs.length} релевантных документов`);
    
    // Формируем промпт с контекстом
    const promptWithContext = SYSTEM_PROMPT.replace('{context}', context);
    
    // Добавляем системный промпт в начало
    const fullMessages: ChatCompletionMessageParam[] = [
      { role: 'system' as const, content: promptWithContext },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Переключаемся на более дешевую модель
      messages: fullMessages,
      functions: FUNCTION_DEFINITIONS as any,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const choice = response.choices[0];

    // Проверяем, есть ли вызов функции
    if (choice.message.function_call) {
      const functionName = choice.message.function_call.name;
      const functionArgs = JSON.parse(choice.message.function_call.arguments);

      // Выполняем функцию
      const functionResponse = (functions as any)[functionName](functionArgs);

      // Отправляем результат обратно в GPT для формирования ответа
      const secondMessages: ChatCompletionMessageParam[] = [
        ...fullMessages,
        {
          role: 'assistant' as const,
          content: null as any,
          function_call: choice.message.function_call,
        },
        {
          role: 'function' as const,
          name: functionName,
          content: JSON.stringify(functionResponse),
        },
      ];
      
      const secondResponse = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: secondMessages,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const finalResponse = secondResponse.choices[0].message.content || 'Ошибка при обработке';

      // Добавляем запрос в лог
      aiLogger.addRequest({
        userMessage: lastUserMessage,
        ragSearch: ragSearchLog,
        openaiRequest: {
          ...aiLogger.logOpenAIRequest({
            model: 'gpt-4o-mini',
            systemPrompt: SYSTEM_PROMPT,
            ragContext: context,
            messages: fullMessages as any,
            response: finalResponse,
            usage: secondResponse.usage,
          }),
        },
        response: finalResponse,
      });

      return {
        message: finalResponse,
      };
    }

    // Обычный ответ без вызова функций
    const finalResponse = choice.message.content || 'Извините, не понял ваш вопрос';

    // Добавляем запрос в лог
    aiLogger.addRequest({
      userMessage: lastUserMessage,
      ragSearch: ragSearchLog,
      openaiRequest: {
        ...aiLogger.logOpenAIRequest({
          model: 'gpt-4o-mini',
          systemPrompt: SYSTEM_PROMPT,
          ragContext: context,
          messages: fullMessages as any,
          response: finalResponse,
          usage: response.usage,
        }),
      },
      response: finalResponse,
    });

    return {
      message: finalResponse,
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(
      `Ошибка при общении с AI: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`
    );
  }
}

export async function streamChatMessage(
  messages: Message[],
  onToken: (token: string) => void,
  onComplete: () => void
): Promise<void> {
  try {
    // Получаем контекст через RAG
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const relevantDocs = await searchKnowledge(lastUserMessage, 3);
    const context = formatContext(relevantDocs);
    const promptWithContext = SYSTEM_PROMPT.replace('{context}', context);
    
    const fullMessages: ChatCompletionMessageParam[] = [
      { role: 'system' as const, content: promptWithContext },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: fullMessages,
      functions: FUNCTION_DEFINITIONS as any,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        onToken(content);
      }
    }

    onComplete();
  } catch (error) {
    console.error('OpenAI Streaming Error:', error);
    throw error;
  }
}
