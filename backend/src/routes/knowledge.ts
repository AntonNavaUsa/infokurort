import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { generateEmbedding } from '../services/openai.js';

const knowledgeRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  const createKnowledgeSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    category: z.string().min(1),
    subcategory: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  });

  // GET all knowledge base entries
  fastify.get('/', async (request, reply) => {
    try {
      const { category, isActive = 'true' } = request.query as {
        category?: string;
        isActive?: string;
      };

      const where: any = {};
      if (category) where.category = category;
      if (isActive) where.isActive = isActive === 'true';

      const entries = await prisma.knowledgeBase.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          category: true,
          subcategory: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return entries;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch knowledge base' });
    }
  });

  // GET knowledge entry by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const entry = await prisma.knowledgeBase.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!entry) {
        return reply.code(404).send({ error: 'Entry not found' });
      }

      return entry;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch entry' });
    }
  });

  // POST create knowledge entry (auth required)
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const data = createKnowledgeSchema.parse(request.body);

        // Create entry without embedding (pgvector not available yet)
        const entry = await prisma.knowledgeBase.create({
          data: {
            title: data.title,
            content: data.content,
            category: data.category,
            subcategory: data.subcategory,
            metadata: data.metadata as any,
          },
        });

        return reply.code(201).send(entry);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Invalid data', details: error.errors });
        }
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to create entry' });
      }
    },
  });

  // PUT update knowledge entry (auth required)
  fastify.put('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as Partial<z.infer<typeof createKnowledgeSchema>>;

        // Update without regenerating embedding
        const entry = await prisma.knowledgeBase.update({
          where: { id: parseInt(id, 10) },
          data: {
            title: data.title,
            content: data.content,
            category: data.category,
            subcategory: data.subcategory,
            metadata: data.metadata as any,
          },
        });

        return entry;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to update entry' });
      }
    },
  });

  // PATCH update knowledge entry (auth required) - для Refine
  fastify.patch('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as Partial<z.infer<typeof createKnowledgeSchema>>;

        // Update without regenerating embedding
        const entry = await prisma.knowledgeBase.update({
          where: { id: parseInt(id, 10) },
          data: {
            title: data.title,
            content: data.content,
            category: data.category,
            subcategory: data.subcategory,
            metadata: data.metadata as any,
          },
        });

        return entry;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to update entry' });
      }
    },
  });

  // DELETE knowledge entry (auth required)
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        await prisma.knowledgeBase.delete({
          where: { id: parseInt(id, 10) },
        });
        return { success: true };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to delete entry' });
      }
    },
  });
};

export default knowledgeRoutes;
