export type ProductionOrderStatus =
  | "draft"
  | "on_approval"
  | "approved"
  | "rejected"
  | "under_review_by_production"
  | "accepted_by_production"
  | "rejected_by_production"
  | "planned"
  | "producing"
  | "produced"
  | "shipping"
  | "delivered";

export interface IProductionOrder {
  _id?: string;
  id: string;
  buyer: string;
  consignee: string;
  country: string;
  city: string;
  mark: string;
  quantity: number;
  unitType: string;
  bagType: string;
  productionTime: string;
  approvingDocument: { name: string; fileUrl: string }[];
  salesPerson: string;
  status: ProductionOrderStatus;
  comments: string;
  commercialRejectionReason: string;
  productionRejectionReason: string;
}
export interface SingleProductionOrder {
  _id: string;
  id: string;
  buyer: { clientName: string };
  consignee: { consigneeName: string };
  country: { name: string };
  city: { name: string };
  mark: { name: string };
  quantity: number;
  unitType: { name: string };
  bagType: { name: string };
  productionTime: string;
  approvingDocument: { name: string; fileUrl: string }[];
  salesPerson: string;
  status: ProductionOrderStatus;
  comments: string;
  commercialRejectionReason: string;
  productionRejectionReason: string;
}

export const productionOrderStatuses = [
  { label: "draft", value: "draft" },
  { label: "on_approval", value: "on_approval" },
  { label: "approved", value: "approved" },
  { label: "rejected", value: "rejected" },
  { label: "under_review_by_production", value: "under_review_by_production" },
  { label: "accepted_by_production", value: "accepted_by_production" },
  { label: "rejected_by_production", value: "rejected_by_production" },
  { label: "planned", value: "planned" },
  { label: "producing", value: "producing" },
  { label: "produced", value: "produced" },
  { label: "shipping", value: "shipping" },
  { label: "delivered", value: "delivered" },
  { label: "partial_paid", value: "partial_paid" },
  { label: "fully_paid", value: "fully_paid" },
];
