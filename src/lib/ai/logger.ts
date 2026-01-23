/**
 * Система логирования для анализа RAG и токенов
 */

export interface RAGSearchLog {
  timestamp: string;
  query: string;
  category: string | null;
  chunksFound: number;
  chunks: Array<{
    source: string;
    category: string;
    contentLength: number;
    preview: string;
  }>;
  contextTokensEstimate: number;
}

export interface OpenAIRequestLog {
  timestamp: string;
  model: string;
  systemPromptTokens: number;
  ragContextTokens: number;
  messagesTokens: number;
  totalInputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
}

export interface RAGInitLog {
  timestamp: string;
  filesLoaded: number;
  totalChunks: number;
  embeddingTokensEstimate: number;
  embeddingCostEstimate: number;
}

export interface SessionLog {
  sessionId: string;
  startTime: string;
  initialization?: RAGInitLog;
  requests: Array<{
    requestId: number;
    timestamp: string;
    userMessage: string;
    ragSearch: RAGSearchLog;
    openaiRequest: OpenAIRequestLog;
    response: string;
  }>;
  totalCost: number;
  totalTokensIn: number;
  totalTokensOut: number;
}

// Цены моделей (на декабрь 2025)
const PRICING = {
  'gpt-4o-mini': {
    input: 0.150 / 1_000_000,   // $0.150 за 1M токенов
    output: 0.600 / 1_000_000,  // $0.600 за 1M токенов
  },
  'gpt-4o': {
    input: 2.50 / 1_000_000,
    output: 10.00 / 1_000_000,
  },
  'text-embedding-3-small': {
    input: 0.020 / 1_000_000,   // $0.020 за 1M токенов
    output: 0,
  },
};

class AILogger {
  private currentSession: SessionLog | null = null;
  private requestCounter = 0;

  /**
   * Начать новую сессию
   */
  startSession(): string {
    const sessionId = `session-${Date.now()}`;
    this.currentSession = {
      sessionId,
      startTime: new Date().toISOString(),
      requests: [],
      totalCost: 0,
      totalTokensIn: 0,
      totalTokensOut: 0,
    };
    this.requestCounter = 0;
    
    console.log(`📊 Новая сессия логирования: ${sessionId}`);
    return sessionId;
  }

  /**
   * Логировать инициализацию RAG
   */
  logRAGInit(data: {
    filesLoaded: number;
    totalChunks: number;
    totalCharacters: number;
  }) {
    if (!this.currentSession) this.startSession();

    // Примерная оценка: 1 токен ≈ 4 символа для русского текста
    const embeddingTokens = Math.ceil(data.totalCharacters / 4);
    const embeddingCost = embeddingTokens * PRICING['text-embedding-3-small'].input;

    const initLog: RAGInitLog = {
      timestamp: new Date().toISOString(),
      filesLoaded: data.filesLoaded,
      totalChunks: data.totalChunks,
      embeddingTokensEstimate: embeddingTokens,
      embeddingCostEstimate: embeddingCost,
    };

    this.currentSession!.initialization = initLog;
    this.currentSession!.totalCost += embeddingCost;

    console.log('🔄 RAG Инициализация:', {
      файлов: data.filesLoaded,
      chunks: data.totalChunks,
      токенов: embeddingTokens,
      стоимость: `$${embeddingCost.toFixed(6)}`,
    });
  }

  /**
   * Логировать поиск в RAG
   */
  logRAGSearch(data: {
    query: string;
    category: string | null;
    documents: Array<{
      pageContent: string;
      metadata: { source?: string; category?: string };
    }>;
  }): RAGSearchLog {
    const chunks = data.documents.map(doc => ({
      source: doc.metadata.source || 'unknown',
      category: doc.metadata.category || 'unknown',
      contentLength: doc.pageContent.length,
      preview: doc.pageContent.substring(0, 100) + '...',
    }));

    const totalContextLength = data.documents.reduce(
      (sum, doc) => sum + doc.pageContent.length,
      0
    );
    const contextTokens = Math.ceil(totalContextLength / 4);

    const log: RAGSearchLog = {
      timestamp: new Date().toISOString(),
      query: data.query,
      category: data.category,
      chunksFound: data.documents.length,
      chunks,
      contextTokensEstimate: contextTokens,
    };

    console.log('🔍 RAG Поиск:', {
      запрос: data.query,
      категория: data.category || 'все',
      найдено: chunks.length,
      символов: totalContextLength,
      токенов: contextTokens,
    });

    return log;
  }

  /**
   * Логировать запрос к OpenAI
   */
  logOpenAIRequest(data: {
    model: string;
    systemPrompt: string;
    ragContext: string;
    messages: any[];  // Упрощаем тип
    response: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }): OpenAIRequestLog {
    const model = data.model as keyof typeof PRICING;
    const pricing = PRICING[model] || PRICING['gpt-4o-mini'];

    // Оценка токенов (если нет usage)
    const systemPromptTokens = Math.ceil(data.systemPrompt.length / 4);
    const ragContextTokens = Math.ceil(data.ragContext.length / 4);
    const messagesTokens = Math.ceil(
      data.messages.reduce((sum, m) => sum + m.content.length, 0) / 4
    );

    const inputTokens = data.usage?.prompt_tokens || 
      (systemPromptTokens + ragContextTokens + messagesTokens);
    const outputTokens = data.usage?.completion_tokens || 
      Math.ceil(data.response.length / 4);

    const inputCost = inputTokens * pricing.input;
    const outputCost = outputTokens * pricing.output;
    const totalCost = inputCost + outputCost;

    const log: OpenAIRequestLog = {
      timestamp: new Date().toISOString(),
      model: data.model,
      systemPromptTokens,
      ragContextTokens,
      messagesTokens,
      totalInputTokens: inputTokens,
      outputTokens,
      inputCost,
      outputCost,
      totalCost,
    };

    console.log('🤖 OpenAI Запрос:', {
      модель: data.model,
      'системный промпт': `${systemPromptTokens} токенов`,
      'RAG контекст': `${ragContextTokens} токенов`,
      'сообщения': `${messagesTokens} токенов`,
      'ИТОГО вход': `${inputTokens} токенов`,
      'ИТОГО выход': `${outputTokens} токенов`,
      'стоимость вход': `$${inputCost.toFixed(6)}`,
      'стоимость выход': `$${outputCost.toFixed(6)}`,
      'ИТОГО стоимость': `$${totalCost.toFixed(6)}`,
    });

    return log;
  }

  /**
   * Добавить полный запрос в сессию
   */
  addRequest(data: {
    userMessage: string;
    ragSearch: RAGSearchLog;
    openaiRequest: OpenAIRequestLog;
    response: string;
  }) {
    if (!this.currentSession) this.startSession();

    this.requestCounter++;
    
    this.currentSession!.requests.push({
      requestId: this.requestCounter,
      timestamp: new Date().toISOString(),
      userMessage: data.userMessage,
      ragSearch: data.ragSearch,
      openaiRequest: data.openaiRequest,
      response: data.response,
    });

    this.currentSession!.totalCost += data.openaiRequest.totalCost;
    this.currentSession!.totalTokensIn += data.openaiRequest.totalInputTokens;
    this.currentSession!.totalTokensOut += data.openaiRequest.outputTokens;

    console.log('📝 Запрос #' + this.requestCounter + ' добавлен в лог');
    console.log('💰 Стоимость сессии:', `$${this.currentSession!.totalCost.toFixed(6)}`);
  }

  /**
   * Получить текущую сессию
   */
  getSession(): SessionLog | null {
    return this.currentSession;
  }

  /**
   * Сохранить сессию в localStorage
   */
  async saveSession() {
    if (!this.currentSession) return;

    const logsKey = 'ai-logs';
    const existingLogs = JSON.parse(localStorage.getItem(logsKey) || '[]');
    existingLogs.push(this.currentSession);
    
    // Храним только последние 20 сессий
    if (existingLogs.length > 20) {
      existingLogs.shift();
    }
    
    localStorage.setItem(logsKey, JSON.stringify(existingLogs, null, 2));
    
    console.log('💾 Сессия сохранена в localStorage');
    this.downloadSessionLog();
  }

  /**
   * Скачать лог сессии как JSON файл
   */
  downloadSessionLog() {
    if (!this.currentSession) return;

    const blob = new Blob(
      [JSON.stringify(this.currentSession, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.currentSession.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('📥 Лог сессии скачан');
  }

  /**
   * Вывести сводку по сессии
   */
  printSummary() {
    if (!this.currentSession) {
      console.log('❌ Нет активной сессии');
      return;
    }

    const session = this.currentSession;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 СВОДКА ПО СЕССИИ');
    console.log('='.repeat(60));
    console.log('🆔 ID:', session.sessionId);
    console.log('🕐 Начало:', new Date(session.startTime).toLocaleString('ru-RU'));
    console.log('📝 Запросов:', session.requests.length);
    
    if (session.initialization) {
      console.log('\n🔄 ИНИЦИАЛИЗАЦИЯ RAG:');
      console.log('  Файлов загружено:', session.initialization.filesLoaded);
      console.log('  Chunks создано:', session.initialization.totalChunks);
      console.log('  Токенов (embeddings):', session.initialization.embeddingTokensEstimate);
      console.log('  Стоимость:', `$${session.initialization.embeddingCostEstimate.toFixed(6)}`);
    }
    
    console.log('\n💬 ЗАПРОСЫ:');
    session.requests.forEach((req, idx) => {
      console.log(`\n  Запрос #${idx + 1}:`);
      console.log('    Вопрос:', req.userMessage.substring(0, 50) + '...');
      console.log('    Модель:', req.openaiRequest.model);
      console.log('    RAG chunks:', req.ragSearch.chunksFound);
      console.log('    Токены вход:', req.openaiRequest.totalInputTokens);
      console.log('    Токены выход:', req.openaiRequest.outputTokens);
      console.log('    Стоимость:', `$${req.openaiRequest.totalCost.toFixed(6)}`);
    });
    
    console.log('\n💰 ИТОГО:');
    console.log('  Токенов вход:', session.totalTokensIn);
    console.log('  Токенов выход:', session.totalTokensOut);
    console.log('  ОБЩАЯ СТОИМОСТЬ:', `$${session.totalCost.toFixed(6)}`);
    console.log('  Стоимость за запрос:', session.requests.length > 0 
      ? `$${(session.totalCost / session.requests.length).toFixed(6)}`
      : 'N/A');
    console.log('='.repeat(60) + '\n');
  }
}

// Singleton экземпляр
export const aiLogger = new AILogger();

// Добавить кнопку для скачивания логов в dev mode
if (import.meta.env.DEV) {
  // @ts-ignore
  window.aiLogger = aiLogger;
  console.log('💡 aiLogger доступен в консоли. Используй:');
  console.log('   aiLogger.printSummary() - показать сводку');
  console.log('   aiLogger.downloadSessionLog() - скачать лог');
}
