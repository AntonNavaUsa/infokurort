import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * JWT authentication middleware
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: number;
      email: string;
      role: string;
    };
  }

  interface FastifyInstance {
    authenticate: typeof authenticate;
  }
}
