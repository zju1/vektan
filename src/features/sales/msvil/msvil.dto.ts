export interface MutualSettlementVectanIlcaDTO {
  _id?: string;
  contractNumber: string;
  buyer: string;
  country: string;
  contractDate: string;
  contractSumm: number;
  actualStock: number;
  invoiceNumber: string;
  shipmentDate: string;
  quantity: number;
  invoiceSumm: number;
  payment: string;
  paymentDate: string;
  name: string;
  consignee: string;
  comment: string;
  createdAt?: string;
  updatedAt?: string;
}
