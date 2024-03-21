import { OrderType, PaymentType } from ".";

export interface Order {
  id: string;
  createdAt: Date;
  userId: string; //TODO нет в тз?
  orderType: OrderType;
  trainingId: string;
  price: number;
  quantity: number;
  cost: number;
  paymentType: PaymentType;
};
