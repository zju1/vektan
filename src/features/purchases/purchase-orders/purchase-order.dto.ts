export interface PurchaseOrderDTO {
  _id?: string;
  id: string;
  initiator: string;
  product: string;
  techspecs: string;
  priority: "critical" | "high" | "medium";
  unitType: string;
  quantity: number;
  reason: string;
  requiredDate: string;
  status: "dealing" | "confirmed";
  comment: string;
  /* Assigned by another API */
  price: number;
  purchaseStatus: "co" | "contract" | "prepayment" | "completed";
  total: number;
  currency: string;
  supplier: string;
  expectedReceivingDate: string;
  responsible: string;
  confirmationComment: string;
}
