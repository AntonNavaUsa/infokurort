import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const instructorRequestSchema = z.object({
  fullName: z.string().trim().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().trim().min(5, 'Укажите корректный номер телефона'),
  resort: z.string().trim().min(2, 'Укажите курорт'),
  lessonType: z.string().trim().min(2, 'Укажите формат занятий'),
  experience: z.string().trim().min(1, 'Укажите уровень катания'),
  preferredDate: z.string().optional().or(z.literal('')),
  notes: z.string().trim().max(1000).optional().or(z.literal('')),
});

type InstructorRequest = z.infer<typeof instructorRequestSchema> & {
  id: string;
  createdAt: string;
};

const instructorRequestsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('instructorLeads', [] as InstructorRequest[]);

  fastify.get('/', async () => {
    return fastify.instructorLeads;
  });

  fastify.post('/', async (request, reply) => {
    try {
      const payload = instructorRequestSchema.parse(request.body);
      const lead: InstructorRequest = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: new Date().toISOString(),
        ...payload,
      };

      fastify.instructorLeads.push(lead);
      if (fastify.instructorLeads.length > 100) {
        fastify.instructorLeads.shift();
      }

      return reply.code(201).send({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid instructor request payload',
          details: error.flatten(),
        });
      }

      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to save instructor request' });
    }
  });
};

export default instructorRequestsRoutes;

declare module 'fastify' {
  interface FastifyInstance {
    instructorLeads: InstructorRequest[];
  }
}
