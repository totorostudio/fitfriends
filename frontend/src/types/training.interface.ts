import { Gender, Level, TrainingType, TrainingTime } from ".";

export interface Trainings{
  totalPages: number,
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  trainings: Training[];
}

export interface Training {
  id?: string;
  createdAt?: Date;
  title: string;
  background: string;
  level: Level;
  trainingType: TrainingType;
  trainingTime: TrainingTime;
  price: number;
  calories: number;
  description: string;
  gender: Gender;
  video: string;
  rating?: number;
  coachId?: string;
  isFeatured?: boolean;
}

export interface FullTraining extends Training {
  coachName: string;
  coachAvatar?: string;
  count: number;
}

export interface EditableTrainingData {
  title: string;
  description: string;
  price: number | string | null;
  isFeatured: boolean;
};
