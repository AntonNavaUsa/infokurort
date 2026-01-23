import { OpenAIEmbeddings } from '@langchain/openai';
import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { aiLogger } from './logger';

// Список файлов knowledge base
const KNOWLEDGE_FILES = [
  { path: '/knowledge-base/resorts/roza-hutor.md', category: 'resort' },
  { path: '/knowledge-base/resorts/krasnaya-polyana.md', category: 'resort' },
  { path: '/knowledge-base/resorts/gazprom.md', category: 'resort' },
  { path: '/knowledge-base/instructors/certification-and-safety.md', category: 'safety' },
  { path: '/knowledge-base/faq/common-questions.md', category: 'faq' },
  { path: '/knowledge-base/pricing/pricing-structure.md', category: 'pricing' },
];

// Глобальное хранилище (инициализируется один раз)
let vectorStore: MemoryVectorStore | null = null;
let initPromise: Promise<void> | null = null;

/**
 * Инициализация RAG системы
 */
export async function initializeRAG(): Promise<void> {
  // Если уже инициализировали, ждем завершения
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      console.log('🔄 Инициализация RAG системы...');

      // Загружаем все markdown файлы
      const documents: any[] = [];

      for (const file of KNOWLEDGE_FILES) {
        try {
          const response = await fetch(file.path);
          if (!response.ok) {
            console.warn(`⚠️ Не удалось загрузить ${file.path}`);
            continue;
          }

          const content = await response.text();

          documents.push({
            pageContent: content,
            metadata: {
              source: file.path,
              category: file.category,
            },
          });
        } catch (error) {
          console.error(`❌ Ошибка загрузки ${file.path}:`, error);
        }
      }

      console.log(`📄 Загружено ${documents.length} документов`);

      // Разбиваем документы на чанки
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
        separators: ['\n## ', '\n### ', '\n\n', '\n', ' ', ''],
      });

      const splitDocs = await textSplitter.splitDocuments(documents);
      console.log(`✂️ Создано ${splitDocs.length} чанков`);

      // Логируем инициализацию
      const totalCharacters = splitDocs.reduce(
        (sum, doc) => sum + doc.pageContent.length,
        0
      );
      aiLogger.logRAGInit({
        filesLoaded: documents.length,
        totalChunks: splitDocs.length,
        totalCharacters,
      });

      // Создаем embeddings
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
        modelName: 'text-embedding-3-small', // дешевле и быстрее
      });

      // Создаем векторное хранилище
      vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);

      console.log('✅ RAG система инициализирована');
    } catch (error) {
      console.error('❌ Ошибка инициализации RAG:', error);
      throw error;
    }
  })();

  return initPromise;
}

/**
 * Поиск релевантной информации
 */
export async function searchKnowledge(query: string, k: number = 4): Promise<any[]> {
  // Инициализируем если еще не сделали
  if (!vectorStore) {
    await initializeRAG();
  }

  if (!vectorStore) {
    console.error('❌ Векторное хранилище не инициализировано');
    return [];
  }

  try {
    // Поиск похожих документов
    const results = await vectorStore.similaritySearch(query, k);
    
    console.log(`🔍 Найдено ${results.length} релевантных чанков для: "${query}"`);
    
    return results;
  } catch (error) {
    console.error('❌ Ошибка поиска:', error);
    return [];
  }
}

/**
 * Форматирование контекста для промпта
 */
export function formatContext(documents: any[]): string {
  if (documents.length === 0) {
    return 'Релевантной информации не найдено.';
  }

  return documents
    .map((doc, index) => {
      const source = doc.metadata?.source?.split('/').pop()?.replace('.md', '') || 'unknown';
      return `[Источник ${index + 1}: ${source}]\n${doc.pageContent}`;
    })
    .join('\n\n---\n\n');
}

/**
 * Умный поиск с фильтрацией по категории
 */
export async function searchByCategory(
  query: string,
  category?: string,
  k: number = 4
): Promise<any[]> {
  if (!vectorStore) {
    await initializeRAG();
  }

  if (!vectorStore) return [];

  try {
    if (category) {
      // Поиск с фильтром по категории
      const results = await vectorStore.similaritySearch(query, k * 2);
      return results
        .filter((doc) => doc.metadata?.category === category)
        .slice(0, k);
    }

    return searchKnowledge(query, k);
  } catch (error) {
    console.error('❌ Ошибка поиска по категории:', error);
    return [];
  }
}

/**
 * Определение категории запроса
 */
export function detectCategory(query: string): string | undefined {
  const lowerQuery = query.toLowerCase();

  if (
    lowerQuery.includes('роза хутор') ||
    lowerQuery.includes('красная поляна') ||
    lowerQuery.includes('газпром') ||
    lowerQuery.includes('курорт')
  ) {
    return 'resort';
  }

  if (
    lowerQuery.includes('безопасн') ||
    lowerQuery.includes('сертификат') ||
    lowerQuery.includes('правила')
  ) {
    return 'safety';
  }

  if (
    lowerQuery.includes('цен') ||
    lowerQuery.includes('стоимост') ||
    lowerQuery.includes('сколько стоит') ||
    lowerQuery.includes('прайс') ||
    lowerQuery.includes('тариф') ||
    lowerQuery.includes('скидк') ||
    lowerQuery.includes('пакет')
  ) {
    return 'pricing';
  }

  if (
    lowerQuery.includes('сколько') ||
    lowerQuery.includes('можно ли') ||
    lowerQuery.includes('нужно ли') ||
    lowerQuery.includes('вопрос')
  ) {
    return 'faq';
  }

  return undefined;
}
