//import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../../../../../node_modules/@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from '../../../../app.const';
import { mockUsers } from './users';
import { mockTrainings } from './trainings';
import { UserRole } from '../../../../libs/types';

const DEFAULT_USERS_COUNT = 5;
const DEFAULT_TRAININGS_COUNT = 5;

let usersCount: number;
let trainingsCount: number;

if (!process.argv[2]) {
  usersCount = DEFAULT_USERS_COUNT;
} else {
  usersCount = +process.argv[2];
}

if (!process.argv[3]) {
  trainingsCount = DEFAULT_TRAININGS_COUNT;
} else {
  trainingsCount = +process.argv[3];
}

function getUsers(usersCount: number) {
  if (usersCount > 5) {
    console.log('🚨️ Максимум 5 пользователей');
    usersCount = 5;
  }
  return mockUsers.slice(0, usersCount);
}

async function setPassword(password: string) {
  const salt = await genSalt(SALT_ROUNDS);
  const passwordHash = await hash(password, salt);
  return passwordHash;
}

function getTrainings(trainingsCount: number) {
  if (trainingsCount > 5) {
    console.log('🚨️ Максимум 5 тренировок');
    trainingsCount = 5;
  }
  return mockTrainings.slice(0, trainingsCount);
}

async function seedDb(prismaClient: PrismaClient, usersCount: number, trainingsCount: number) {
  let coachId: string | undefined;

  if (usersCount > 0) {
    const mockUsers = getUsers(usersCount);

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
  }

  const coach = await prismaClient.user.findFirst({
    where: {
      role: UserRole.Coach
    }
  });

  if (coach) {
    coachId = coach.id;
  } else {
    console.error('🚨️ Не найден ни один тренер, тренировки не созданы.');
    return;
  }

  if (trainingsCount > 0) {
    const mockTrainings = getTrainings(trainingsCount);

    for (const training of mockTrainings) {
      await prismaClient.training.create({
        data: {
          title: training.title,
          background: training.background,
          level: training.level,
          trainingType: training.trainingType,
          trainingTime: training.trainingTime,
          price: training.price,
          calories: training.calories,
          description: training.description,
          gender: training.gender,
          video: training.video,
          rating: training.rating,
          coachId: coachId,
          isFeatured: training.isFeatured,
        }
      })
    }
  }

  console.info('🤘️ Database was filled');
  console.info(`✍  Создано ${usersCount} пользователей и ${trainingsCount} тренировок`);
}

async function bootstrap() {
  const prismaClient = new PrismaClient();

  try {
    await seedDb(prismaClient, usersCount, trainingsCount);
    globalThis.process.exit(0);
  } catch (error: unknown) {
    console.error(error);
    globalThis.process.exit(1);
  } finally {
    await prismaClient.$disconnect();
  }
}

bootstrap();
