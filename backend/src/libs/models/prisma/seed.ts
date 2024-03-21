import { PrismaClient } from '@prisma/client';

const DEFAULT_PASSWORD = '123456';

function getUsers() {
  return [
    {
      name: 'Василий',
      email: 'vasya@local.mail',
      password: DEFAULT_PASSWORD,
      gender: 'мужской',
      role: 'пользователь',
      description: 'Я - Василий, и я буду атлетом-качком через 2 месяца.',
      metro: 'Московская',
      background: '/public/images/vasya.jpg',
      level: 'новичок',
      trainingType: ['бег', 'бокс'],
      trainingTime: '10-30 мин',
      isReady: true,
    },
    {
      name: 'Таня',
      email: 'tanya@local.mail',
      password: DEFAULT_PASSWORD,
      gender: 'женский',
      role: 'пользователь',
      description: 'Я - Таня, и я буду йогом-космонавтом через 1 месяц.',
      metro: 'Звёздная',
      background: '/public/images/tanyas.jpg',
      level: 'новичок',
      trainingType: ['йога', 'стрейчинг'],
      trainingTime: '10-30 мин',
      isReady: true,
    },
  ]
}

async function seedDb(prismaClient: PrismaClient) {
  const mockUsers = getUsers();
  for (const user of mockUsers) {
    await prismaClient.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        gender: user.gender,
        role: user.role,
        description: user.description,
        metro: user.metro,
        background: user.background,
        level: user.level,
        trainingType: user.trainingType,
        trainingTime: user.trainingTime,
        isReady: user.isReady,
      }
    })
  }

  console.info('🤘️ Database was filled');
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
