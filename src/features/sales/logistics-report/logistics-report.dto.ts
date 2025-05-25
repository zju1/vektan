export interface LogisticsReportDTO {
  _id?: string;
  seller: string;
  buyer: string;
  consignee: string;
  invoiceNumber: string;
  invoiceDate: string;
  shippingDate: string;
  mark: string;
  bagType: string;
  quantity: string;
  uniType: string;
  status: string;
  currentLocation: string;
  updatingDate: string;
  actualDeliveryDate: string;
  numberOfDays: number;
  shippingCost: number;
  shippingCostPerTon: number;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
