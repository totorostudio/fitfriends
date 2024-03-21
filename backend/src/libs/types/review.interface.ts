export interface Review {
  id: string;
  createdAt: Date;
  userId: string;
  trainingId: string;
  grade: number;
  text: string;
};
