import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const { prisma } = fastify;

  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['super_admin', 'admin', 'editor']).default('editor'),
  });

  // POST login
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = loginSchema.parse(request.body);

      const admin = await prisma.admin.findUnique({ where: { email } });

      if (!admin || !admin.isActive) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, admin.passwordHash);

      if (!validPassword) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Update last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
      });

      const token = fastify.jwt.sign({
        id: admin.id,
        email: admin.email,
        role: admin.role,
      });

      return {
        token,
        user: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Invalid data', details: error.errors });
      }
      fastify.log.error(error);
      reply.code(500).send({ error: 'Login failed' });
    }
  });

  // POST register (super admin only)
  fastify.post('/register', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const user = request.user as { role: string };

        if (user.role !== 'super_admin') {
          return reply.code(403).send({ error: 'Forbidden' });
        }

        const data = registerSchema.parse(request.body);

        const existingAdmin = await prisma.admin.findUnique({
          where: { email: data.email },
        });

        if (existingAdmin) {
          return reply.code(400).send({ error: 'Email already exists' });
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const admin = await prisma.admin.create({
          data: {
            email: data.email,
            passwordHash,
            name: data.name,
            role: data.role,
          },
        });

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.code(400).send({ error: 'Invalid data', details: error.errors });
        }
        fastify.log.error(error);
        reply.code(500).send({ error: 'Registration failed' });
      }
    },
  });

  // GET current user
  fastify.get('/me', {
    preHandler: [fastify.authenticate],
    handler: async (request, reply) => {
      try {
        const user = request.user as { id: number };
        const admin = await prisma.admin.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            lastLoginAt: true,
          },
        });

        if (!admin) {
          return reply.code(404).send({ error: 'User not found' });
        }

        return admin;
      } catch (error) {
        fastify.log.error(error);
        reply.code(500).send({ error: 'Failed to fetch user' });
      }
    },
  });
};

export default authRoutes;
