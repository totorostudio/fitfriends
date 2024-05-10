import { Gender, UserRole, Metro, Level, TrainingType, TrainingTime } from ".";

export interface FullUser extends CoachUser, CustomerUser {
  passwordHash?: string;
}

export interface AuthUser extends CoachUser, CustomerUser {
  passwordHash: string;
}

export interface BaseUser {
  id?: string;
  createdAt: Date;
  email: string;
  name: string;
  avatar?: string;
  gender: Gender;
  birthday?: Date;
  role: UserRole;
  description?: string;
  metro: Metro;
  background: string;
  level: Level;
  trainingType: TrainingType[];
  friends: string[];
  subscribers?: string[];
  isReady: boolean;
};

export interface CustomerUser extends BaseUser {
  trainingTime?: TrainingTime;
  calories?: number;
  caloriesPerDay?: number;
};

export interface CoachUser extends BaseUser {
  certificate?: string;
  awards?: string;
};
