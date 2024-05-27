import { Grade } from "./helper.enum";

export interface Review {
  id?: string;
  createdAt?: Date;
  userId?: string;
  trainingId: string;
  grade: Grade;
  text: string;
};

export interface Reviews{
  totalPages: number,
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  reviews: Review[];
}
