import { Gender, Role, Metro, Level, TrainingType, TrainingTime } from ".";

export interface BaseUser {
  id: string;
  createdAt: Date;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  gender: Gender;
  birthday?: Date;
  role: Role;
  description?: string;
  metro: Metro;
  background: string;
};

export interface CustomerUser extends BaseUser {
  level: Level;
  trainingType: TrainingType[];
  trainingTime: TrainingTime;
  calories: number;
  caloriesPerDay: number;
  isReady: boolean;
};

export interface CoachUser extends BaseUser {
  level: Level;
  trainingType: TrainingType[];
  sertificate: string;
  awards: string;
  isReady: boolean;
};
