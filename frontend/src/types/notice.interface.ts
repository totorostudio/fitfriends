import { TrainingType } from "./helper.enum";

export interface Notice {
  coachName: string;
  title: string;
  description: string;
  type: TrainingType;
  calories: number;
}
