import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const resortsRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  // Schema validation
  const createResortSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    location: z.string().optional(),
    status: z.string().optional(),
    snowDepth: z.number().optional(),
    weather: z.string().optional(),
    temperature: z.number().optional(),
    liftsOpen: z.number().optional(),
    liftsTotal: z.number().optional(),
    trailsOpen: z.number().optional(),
    trailsTotal: z.number().optional(),
    website: z.string().optional(),
    description: z.string().optional(),
  });

  // GET all resorts
  fastify.get('/', async (request, reply) => {
    try {
      const resorts = await prisma.resort.findMany({
        orderBy: { name: 'asc' },
      });
      return resorts;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch resorts' });
    }
  });

  // GET resort by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const resort = await prisma.resort.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!resort) {
        return reply.code(404).send({ error: 'Resort not found' });
      }

      return resort;
    } catch (error) {
      fastify.log.error(error);
      reply.code(500).send({ error: 'Failed to fetch resort' });
    }
  });

  // POST create resort (auth required)
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const data = createResortSchema.parse(request.body);
        const resort = await prisma.resort.create({ data });
        return reply.code(201).send(resort);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Invalid data', details: error.errors });
        }
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to create resort' });
      }
    },
  });

  // PUT update resort (auth required)
  fastify.put('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as Partial<z.infer<typeof createResortSchema>>;

        const resort = await prisma.resort.update({
          where: { id: parseInt(id, 10) },
          data,
        });

        return resort;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to update resort' });
      }
    },
  });

  // PATCH update resort (auth required) - для Refine
  fastify.patch('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        const data = request.body as Partial<z.infer<typeof createResortSchema>>;

        const resort = await prisma.resort.update({
          where: { id: parseInt(id, 10) },
          data,
        });

        return resort;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to update resort' });
      }
    },
  });

  // DELETE resort (auth required)
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        await prisma.resort.delete({
          where: { id: parseInt(id, 10) },
        });
        return { success: true };
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to delete resort' });
      }
    },
  });
};

export default resortsRoutes;
