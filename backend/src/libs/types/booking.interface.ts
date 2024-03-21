export interface Booking {
  id: string;
  createdAt: Date;
  initiatorId: string;
  userId: string;
  status: string;
  statusChangedAt: Date;
};
