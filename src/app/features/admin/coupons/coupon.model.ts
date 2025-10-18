export interface Coupon {
  id: string;
  name: string;
  discount: number;
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
}
