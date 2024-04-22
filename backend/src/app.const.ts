import { BookingStatus, Gender, SortOrder, TrainingTime, TrainingType } from "src/libs/types";

export const CURRENT_USER_ID = '0fe7dbca-7249-4c1d-bc5e-c60b3b369783';

export const SALT_ROUNDS = 10;

export enum HttpClientParam {
  MaxRedirect = 5,
  Timeout = 5000
}

export const LIST_LIMIT = 3;

export const NOTIFY_LIMIT = 5;

export const DEFAULT_PAGE = 1;

export const DEFAULT_SORT_DIRECTION = 'asc';

export const MAX_TRAINING_TYPES = 3;

export const DEFAULT_BOOKING_STATUS = BookingStatus.Pending;

export const DEFAULT_ORDER_SORT = SortOrder.Cost;

export enum UserNameLength {
  Min = 1,
  Max = 15,
}

export enum UserPasswordLength {
  Min = 6,
  Max = 12,
}

export enum UserDescriptionLength {
  Min = 10,
  Max = 140,
}

export enum UserAwardsLength {
  Min = 10,
  Max = 140,
}

export enum Calories {
  Min = 1000,
  Max = 5000,
}

export enum OrderQuantityValue {
  Min = 1,
  Max = 50,
}

export enum PriceValue {
  Min = 0,
}

export enum TrainingTitleLength {
  Min = 1,
  Max = 15,
}

export enum TrainingDescriptionLength {
  Min = 10,
  Max = 140,
}

export const MailSubject = {
  Subscription: 'Подписка на рассылку оформлена',
  Training: 'Повявилась новая тренировка',
  Test: 'Тестовое сообщение',
} as const;

export const MailTemplate = {
  Subscription: './subscription',
  Training: './training',
  Test: './test',
} as const;

export const ImageFile = {
  MimeTypes: ['image/png', 'image/jpeg'],
  MaxSize: 1000000,
};

export const VideoFile = {
  MimeTypes: ['video/mov', 'video/mp4', 'video/avi'],
};

export const TEST_USER = {
  userName: 'Тестовый юзер 2',
  coachName: 'Тестовый тренер',
  title: 'Тестовый тайтл',
  description: 'Тестовый description',
  gender: Gender.Unknown,
  trainingType: TrainingType.Yoga,
  trainingTime: TrainingTime.Short,
  calories: 500,
  price: 5000,
};
