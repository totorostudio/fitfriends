export const SALT_ROUNDS = 10;

export enum HttpClientParam {
  MaxRedirect = 5,
  Timeout = 5000
}

export const LIST_LIMIT = 2;

export const DEFAULT_SORT_DIRECTION = 'asc';

export const MAX_WORKOUTS_TYPES = 3;

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

export enum OrderCountValue {
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
