import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { TrackClickRequest, TrackClickResponse } from '../types/accommodation.js';

// Validation schema
const trackClickSchema = z.object({
  widgetId: z.string().uuid(),
  hotelId: z.string(),
  hotelName: z.string(),
  ota: z.enum(['ostrovok', 'sutochno', '101hotels', 'yandex']),
  price: z.number().min(0),
  currency: z.string().length(3),
});

type TrackClickRequestType = FastifyRequest<{
  Body: TrackClickRequest;
}>;

export default async function affiliateRoutes(fastify: FastifyInstance) {
  // Track affiliate click
  fastify.post('/track-click', async (request: TrackClickRequestType, reply: FastifyReply) => {
    try {
      const data = trackClickSchema.parse(request.body);

      // Get IP and User-Agent
      const ip = request.ip;
      const userAgent = request.headers['user-agent'];
      const referer = request.headers['referer'];

      // TODO: Get partnerId from widgetId
      // const widget = await fastify.prisma.widget.findUnique({
      //   where: { id: data.widgetId },
      // });

      // Create click record
      // const click = await fastify.prisma.click.create({
      //   data: {
      //     widgetId: data.widgetId,
      //     partnerId: widget.partnerId,
      //     hotelId: data.hotelId,
      //     hotelName: data.hotelName,
      //     ota: data.ota,
      //     price: data.price,
      //     currency: data.currency,
      //     ip,
      //     userAgent,
      //     referer,
      //   },
      // });

      const response: TrackClickResponse = {
        success: true,
        clickId: 'placeholder-id', // TODO: click.id
      };

      fastify.log.info({
        event: 'affiliate_click',
        widgetId: data.widgetId,
        hotelName: data.hotelName,
        ota: data.ota,
        price: data.price,
      });

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

  // Generate deeplink
  fastify.get('/deeplink', async (request, reply) => {
    const { hotelId, ota, partnerId } = request.query as {
      hotelId: string;
      ota: string;
      partnerId: string;
    };

    // TODO: Implement deeplink generation
    // const url = await deeplinkService.generate(hotelId, ota, partnerId);

    return reply.status(501).send({
      error: 'Not implemented yet',
    });
  });
}
