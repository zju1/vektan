export interface MutualSettlementsILCAOtherDTO {
  _id?: string;
  buyer: string;
  shipmentDate: string;
  invoice: string;
  productName: string;
  quantity: number;
  price: number;
  summ: number;
  paymentDate: string;
  remained: string;
  deliveryDate: string;
  paymentDateInDays: number;
  days: number;
  paymentDeadline: string;
  createdAt?: string;
  updatedAt?: string;
}
