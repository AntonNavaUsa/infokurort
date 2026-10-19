import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(''));

const instructorRequestSchema = z.object({
  name: z.string().trim().min(2, 'Укажите имя').max(100),
  contact: z.string().trim().min(5, 'Укажите телефон или Telegram').max(100),
  resort: z.string().trim().min(2, 'Укажите курорт').max(50),
  dates: optionalText(100),
  learner: z.string().trim().min(2, 'Укажите, кто учится').max(30),
  childAge: optionalText(30),
  discipline: z.string().trim().min(2, 'Укажите лыжи или сноуборд').max(30),
  level: z.string().trim().min(2, 'Укажите уровень').max(50),
  page: optionalText(200),
  landingPage: optionalText(200),
  referrer: optionalText(500),
  utm_source: optionalText(200),
  utm_medium: optionalText(200),
  utm_campaign: optionalText(200),
  utm_content: optionalText(200),
  utm_term: optionalText(200),
  // Honeypot: невидимое поле, которое заполняют только боты
  website: optionalText(200),
});

// Простое ограничение частоты: не больше 5 заявок с одного IP за 10 минут
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const recentByIp = new Map<string, number[]>();

const isRateLimited = (ip: string) => {
  const now = Date.now();
  const timestamps = (recentByIp.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  timestamps.push(now);
  recentByIp.set(ip, timestamps);
  if (recentByIp.size > 5000) recentByIp.clear();
  return timestamps.length > RATE_LIMIT;
};

const emptyToNull = (value?: string) => (value ? value : null);

const instructorRequestsRoutes: FastifyPluginAsync = async (fastify) => {
  // Список заявок содержит персональные данные — только для администраторов
  fastify.get('/', { preHandler: [fastify.authenticate] }, async () => {
    return fastify.prisma.instructorRequest.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  });

  fastify.post('/', async (request, reply) => {
    const parsed = instructorRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({
        error: 'Invalid instructor request payload',
        details: parsed.error.flatten(),
      });
    }

    const { website, landingPage, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, ...lead } = parsed.data;

    if (website) {
      return reply.code(201).send({ success: true });
    }

    const ip = (request.headers['x-real-ip'] as string | undefined) ?? request.ip;
    if (isRateLimited(ip)) {
      return reply.code(429).send({ error: 'Too many requests' });
    }

    try {
      const saved = await fastify.prisma.instructorRequest.create({
        data: {
          name: lead.name,
          contact: lead.contact,
          resort: lead.resort,
          dates: emptyToNull(lead.dates),
          learner: lead.learner,
          childAge: emptyToNull(lead.childAge),
          discipline: lead.discipline,
          level: lead.level,
          page: emptyToNull(lead.page),
          attribution: { landingPage, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term },
        },
        select: { id: true },
      });

      fastify.log.info({ leadId: saved.id, resort: lead.resort }, 'Instructor request saved');
      return reply.code(201).send({ success: true, id: saved.id });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to save instructor request' });
    }
  });
};

export default instructorRequestsRoutes;
