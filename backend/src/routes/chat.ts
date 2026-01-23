import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { generateEmbedding, generateChatResponse } from '../services/openai.js';

const chatRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  const chatRequestSchema = z.object({
    message: z.string().min(1),
    sessionId: z.string().optional(),
  });

  // POST RAG-powered chat
  fastify.post('/chat', async (request, reply) => {
    try {
      const { message, sessionId = `session-${Date.now()}` } = chatRequestSchema.parse(request.body);
      const startTime = Date.now();

      // Use full-text search instead of vector search (pgvector not available)
      const relevantDocs = await prisma.knowledgeBase.findMany({
        where: {
          isActive: true,
          OR: [
            { content: { contains: message, mode: 'insensitive' } },
            { title: { contains: message, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      });

      // Build context from relevant documents
      const context = relevantDocs
        .map((doc) => `[${doc.category}] ${doc.title}\n${doc.content}`)
        .join('\n\n---\n\n');

      // Generate response using LLM
      const { response, tokensUsed } = await generateChatResponse(message, context);

      // Log the interaction
      await prisma.chatLog.create({
        data: {
          sessionId,
          userMessage: message,
          assistantResponse: response,
          contextUsed: relevantDocs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            category: doc.category,
          })),
          tokensUsed,
          responseTime: Date.now() - startTime,
        },
      });

      return {
        response,
        sources: relevantDocs.map((doc) => ({
          id: doc.id,
          title: doc.title,
          category: doc.category,
        })),
        sessionId,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Invalid request', details: error.errors });
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to process chat request' });
    }
  });

  // POST vector search endpoint
  fastify.post('/search', async (request, reply) => {
    try {
      const { query, limit = 5 } = request.body as { query: string; limit?: number };

      // Use full-text search (pgvector not available)
      const results = await prisma.knowledgeBase.findMany({
        where: {
          isActive: true,
          OR: [
            { content: { contains: query, mode: 'insensitive' } },
            { title: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
        orderBy: { updatedAt: 'desc' },
      });

      return results;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to search' });
    }
  });

  // POST feedback on chat response
  fastify.post('/chat/feedback', async (request, reply) => {
    try {
      const { sessionId, feedback } = request.body as {
        sessionId: string;
        feedback: 'positive' | 'negative';
      };

      // Find the most recent chat log for this session
      const chatLog = await prisma.chatLog.findFirst({
        where: { sessionId },
        orderBy: { createdAt: 'desc' },
      });

      if (chatLog) {
        await prisma.chatLog.update({
          where: { id: chatLog.id },
          data: { userFeedback: feedback },
        });
      }

      return { success: true };
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to save feedback' });
    }
  });
};

export default chatRoutes;
