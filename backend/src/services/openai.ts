import OpenAI from 'openai';

// Lazy initialization to avoid error on startup if API key is not set
let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY не установлен в .env файле');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const CHAT_MODEL = process.env.CHAT_MODEL || 'gpt-4-turbo-preview';

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate chat response using RAG context
 */
export async function generateChatResponse(
  userMessage: string,
  context: string
): Promise<{ response: string; tokensUsed: number }> {
  try {
    const systemPrompt = `Вы — helpful AI assistant для горнолыжного курорта "Ski Concierge".
Вы помогаете пользователям с вопросами о курортах, инструкторах, ценах и условиях катания.

ВАЖНЫЕ ПРАВИЛА:
1. Отвечайте ТОЛЬКО на основе предоставленного контекста
2. Если информации нет в контексте, честно скажите об этом
3. Будьте дружелюбны и полезны
4. Отвечайте на русском языке
5. Если нужна дополнительная информация, предложите пользователю уточнить вопрос

КОНТЕКСТ:
${context}
`;

    const response = await getOpenAI().chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      response: response.choices[0].message.content || 'Извините, не могу ответить на этот вопрос.',
      tokensUsed: response.usage?.total_tokens || 0,
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts,
    });

    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.error('Error generating embeddings batch:', error);
    throw error;
  }
}
