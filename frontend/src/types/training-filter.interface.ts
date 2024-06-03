import { TrainingTime, TrainingType } from "./helper.enum";

export interface FilterRange {
  [key: string]: number;
};

export interface Filter {
  priceFrom?: number;
  priceTo?: number;
  caloriesFrom?: number;
  caloriesTo?: number;
  ratingFrom?: number;
  ratingTo?: number;
  trainingType?: TrainingType[];
  trainingTime?: TrainingTime[];
}
