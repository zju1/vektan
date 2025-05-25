export interface LogisticsTrackingDTO {
  _id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  shippingDate: string;
  client: string;
  country: string;
  city: string;
  mark: string;
  bagType: string;
  quantity: number;
  unitType: string;
  lotNumber: string;
  carrier: string;
  govNumber: string;
  driver: string;
  deliveryStatus: string;
  location: string;
  updatingDate: string;
  expectedDeliveryDate: string;
  createdAt?: string;
  updatedAt?: string;
}
