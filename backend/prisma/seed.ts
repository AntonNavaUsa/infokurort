import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { generateEmbedding } from '../src/services/openai.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create default admin user
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@ski-concierge.ru' },
    update: {},
    create: {
      email: 'admin@ski-concierge.ru',
      passwordHash,
      name: 'Super Admin',
      role: 'super_admin',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // 2. Create resorts
  const resorts = [
    {
      name: 'Роза Хутор',
      slug: 'roza-hutor',
      location: 'Красная Поляна, Сочи',
      status: 'open',
      snowDepth: 180,
      weather: 'Солнечно',
      temperature: -5,
      liftsOpen: 28,
      liftsTotal: 32,
      trailsOpen: 75,
      trailsTotal: 102,
      website: 'https://rosaski.com',
      description: 'Крупнейший горнолыжный курорт России с современной инфраструктурой',
    },
    {
      name: 'Газпром',
      slug: 'gazprom',
      location: 'Красная Поляна, Сочи',
      status: 'open',
      snowDepth: 165,
      weather: 'Переменная облачность',
      temperature: -3,
      liftsOpen: 24,
      liftsTotal: 28,
      trailsOpen: 68,
      trailsTotal: 85,
      website: 'https://lk-gazprom.ru',
      description: 'Современный горнолыжный комплекс с разнообразными трассами',
    },
    {
      name: 'Красная Поляна',
      slug: 'krasnaya-polyana',
      location: 'Красная Поляна, Сочи',
      status: 'open',
      snowDepth: 155,
      weather: 'Легкий снегопад',
      temperature: -4,
      liftsOpen: 18,
      liftsTotal: 22,
      trailsOpen: 52,
      trailsTotal: 67,
      website: 'https://krasnayapolyana.com',
      description: 'Курорт с уникальным расположением и живописными видами',
    },
  ];

  for (const resort of resorts) {
    await prisma.resort.upsert({
      where: { slug: resort.slug },
      update: resort,
      create: resort,
    });
  }

  console.log('✅ Created resorts');

  // 3. Import knowledge base from markdown files
  const knowledgeBasePath = path.join(process.cwd(), '..', 'knowledge-base');
  
  const categories = [
    { dir: 'faq', category: 'faq' },
    { dir: 'instructors', category: 'instructors' },
    { dir: 'pricing', category: 'pricing' },
    { dir: 'resorts', category: 'resort_info' },
  ];

  for (const { dir, category } of categories) {
    try {
      const dirPath = path.join(knowledgeBasePath, dir);
      const files = await fs.readdir(dirPath);

      for (const file of files) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(path.join(dirPath, file), 'utf-8');
          const title = file.replace('.md', '').replace(/-/g, ' ');

          console.log(`  Processing: ${file}...`);

          // Create without embedding (pgvector not available)
          await prisma.knowledgeBase.create({
            data: {
              title,
              content,
              category,
              isActive: true,
            },
          });
        }
      }

      console.log(`✅ Imported ${category} knowledge base`);
    } catch (error) {
      console.log(`⚠️  Skipping ${dir}: directory not found`);
    }
  }

  console.log('🎉 Seed completed successfully!');
  console.log('\n📝 Login credentials:');
  console.log('  Email: admin@ski-concierge.ru');
  console.log('  Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
