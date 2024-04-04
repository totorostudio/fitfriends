import { PrismaClient } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from 'src/app.const';

const DEFAULT_PASSWORD = '123456';

function getUsers() {
  return [
    /*{
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
    {
      name: 'Семен',
      email: 'semen@local.mail',
      password: DEFAULT_PASSWORD,
      gender: 'мужской',
      role: 'пользователь',
      description: 'Я - Семен, и я буду беби-йодой через 2 месяца.',
      metro: 'Звёздная',
      background: '/public/images/semen.jpg',
      level: 'новичок',
      trainingType: ['бокс', 'стрейчинг'],
      trainingTime: '10-30 мин',
      isReady: true,
    },
    {
      name: 'Евгения',
      email: 'evgeniya@local.mail',
      password: DEFAULT_PASSWORD,
      gender: 'женский',
      role: 'пользователь',
      description: 'Я - Женя, и я буду балериной через 3 месяца.',
      metro: 'Звёздная',
      background: '/public/images/evgeniya.jpg',
      level: 'новичок',
      trainingType: ['бег', 'стрейчинг'],
      trainingTime: '10-30 мин',
      isReady: true,
    },*/
    {
      name: 'Бравый Тренер',
      email: 'trainer@local.mail',
      password: DEFAULT_PASSWORD,
      gender: 'мужской',
      role: 'тренер',
      description: 'Я - Тренер, я Супертренер!',
      metro: 'Пионерская»',
      background: '/public/images/trainer.jpg',
      level: 'новичок',
      trainingType: ['бокс', 'кроссфит', 'аэробика'],
      trainingTime: '80-100 мин',
      friends: [],
      isReady: true,
    },
  ]
}

async function setPassword(password: string) {
  const salt = await genSalt(SALT_ROUNDS);
  const passwordHash = await hash(password, salt);
  return passwordHash;
}

async function seedDb(prismaClient: PrismaClient) {
  const mockUsers = getUsers();

  for (const user of mockUsers) {
    const passwordHash = await setPassword(user.password);
    await prismaClient.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: passwordHash,
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
