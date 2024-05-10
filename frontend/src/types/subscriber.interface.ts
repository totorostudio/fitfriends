import { Notice } from "./notice.interface";

export interface Subscriber {
  id?: string;
  createdAt?: Date;
  userId: string;
  coaches: string[];
  notices: Notice[];
}
