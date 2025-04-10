export interface PurchaseDTO {
  _id?: string;
  applicationNumber: string;
  purchaseType: "services" | "goods-and-works";
  uniqueDescription: string;
  supplierId: string;
  supplierCompanyName: string;
  departmentId: string;
  logisticsServiceId: string;
  currencyId: string;
  deliveryTerms: string;
  quota: string;
  contractDate: string;
  contractQuantities: string;
  price: number;
  cost: number;
  paymentStatus:
    | "advancePayment"
    | "letterOfCredit"
    | "installmentPlan"
    | "deferral"
    | "paymentUponReceiptOfGoods";
  initiator: string;
  productStatus: "inReceiptProcess" | "inTransit" | "overdue";
  refund: string;
  purpose: string;
  comments: string;
  specifications: { name: string; fileUrl: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}

export const purchaseTypeOptions = [
  { value: "services", label: "services" },
  { value: "goods-and-works", label: "goodsAndWorks" },
];

export const paymentStatusOptions = [
  { value: "advancePayment", label: "advancePayment" },
  { value: "letterOfCredit", label: "letterOfCredit" },
  { value: "installmentPlan", label: "installmentPlan" },
  { value: "deferral", label: "deferral" },
  { value: "paymentUponReceiptOfGoods", label: "paymentUponReceiptOfGoods" },
];

export const productStatusOptions = [
  { value: "inReceiptProcess", label: "inReceiptProcess" },
  { value: "inTransit", label: "inTransit" },
  { value: "overdue", label: "overdue" },
];
