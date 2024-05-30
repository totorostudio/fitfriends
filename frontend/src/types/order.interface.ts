import { FullTraining, OrderType, PaymentType } from ".";

export interface Order {
  id?: string;
  createdAt?: Date;
  userId: string;
  coachId: string;
  orderType: OrderType;
  trainingId: string;
  price: number;
  quantity: number;
  cost: number;
  paymentType: PaymentType;
};

export interface NewOrderBody {
  orderType: OrderType;
  trainingId: string;
  quantity: number;
  paymentType: PaymentType;
};

export interface CoachOrders {
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  orders: CoachOrder[];
}

export interface CoachOrder {
  training: FullTraining;
  quantity: number;
  cost: number;
}
