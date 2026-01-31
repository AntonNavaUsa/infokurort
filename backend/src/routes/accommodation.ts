import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { AccommodationSearchParams, AccommodationSearchResponse } from '../types/accommodation.js';
import { travelpayoutsService } from '../services/ota/travelpayouts.js';

// Validation schemas
const searchSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  radius: z.number().min(100).max(50000).default(5000),
  type: z.enum(['resort', 'event', 'city', 'custom']).optional(),
  checkin: z.string().optional(),
  checkout: z.string().optional(),
  guests: z.number().min(1).max(20).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minRating: z.number().min(0).max(10).optional(),
});

type SearchRequest = FastifyRequest<{
  Body: AccommodationSearchParams;
}>;

export default async function accommodationRoutes(fastify: FastifyInstance) {
  // Search accommodation
  fastify.post('/search', async (request: SearchRequest, reply: FastifyReply) => {
    try {
      // Validate request
      const params = searchSchema.parse(request.body);

      // TODO: Implement cache check
      // const cacheKey = `search:${params.lat}:${params.lng}:${params.radius}`;
      // const cached = await cache.get(cacheKey);
      // if (cached) return reply.send(cached);

      // PoC: Получаем данные из Travelpayouts сервиса
      fastify.log.info('Searching accommodations with Travelpayouts:', params);
      const results = await travelpayoutsService.searchByCoordinates(params);

      // Response
      const response: AccommodationSearchResponse = {
        results,
        totalCount: results.length,
        searchParams: params,
        cached: false,
        sources: ['travelpayouts'],
      };

      // TODO: Cache results
      // await cache.set(cacheKey, response, 3600); // 1 hour TTL

      return reply.send(response);
    } catch (error) {
      fastify.log.error(error);
      
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        });
      }

      return reply.status(500).send({
        error: 'Internal server error',
      });
    }
  });

  // Get accommodation details
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    // TODO: Implement get by ID
    return reply.status(501).send({
      error: 'Not implemented yet',
    });
  });
}
