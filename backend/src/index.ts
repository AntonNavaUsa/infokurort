import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Middleware
import { authenticate } from './middleware/auth.js';

// Routes
import resortsRoutes from './routes/resorts.js';
import knowledgeRoutes from './routes/knowledge.js';
import chatRoutes from './routes/chat.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const prisma = new PrismaClient();

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Security
await fastify.register(helmet, {
  contentSecurityPolicy: false,
});

// CORS
await fastify.register(cors, {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.ADMIN_URL || 'http://localhost:3002',
  ],
  credentials: true,
});

// JWT
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
});

// Attach Prisma to fastify instance
fastify.decorate('prisma', prisma);

// Attach authenticate middleware
fastify.decorate('authenticate', authenticate);

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Routes
await fastify.register(authRoutes, { prefix: '/api/auth' });
await fastify.register(resortsRoutes, { prefix: '/api/resorts' });
await fastify.register(knowledgeRoutes, { prefix: '/api/knowledge' });
await fastify.register(chatRoutes, { prefix: '/api' });

// Graceful shutdown
const closeGracefully = async (signal: string) => {
  fastify.log.info(`Received signal to terminate: ${signal}`);
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
};

process.on('SIGINT', () => closeGracefully('SIGINT'));
process.on('SIGTERM', () => closeGracefully('SIGTERM'));

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
};

start();

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
