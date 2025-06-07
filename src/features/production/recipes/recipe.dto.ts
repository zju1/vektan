import type { ProductionOrderStatus } from "@/features/sales/production-orders/production-order.dto";

export interface RecipeModelDTO {
  _id?: string;
  purchaseOrder: string;
  mainRaw1: string;
  mainRawVolume1: number;
  mainRaw2: string;
  mainRawVolume2: number;
  mainRaw3: string;
  mainRawVolume3: number;
  mainRaw4: string;
  mainRawVolume4: number;
  byProduct: string;
  byProductVolume: number;
  chemicals: string;
  chemicalsVolume: number;
  additive: string;
  additiveVolume: number;
  device: string;
  lotNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SingleRecipe {
  _id: string;
  purchaseOrder: {
    _id: string;
    id: string;
    mark: { name: string };
    unitType: { name: string };
    quantity: number;
    status: ProductionOrderStatus;
  };
  mainRaw1: string;
  mainRawVolume1: number;
  mainRaw2: string;
  mainRawVolume2: number;
  mainRaw3: string;
  mainRawVolume3: number;
  mainRaw4: string;
  mainRawVolume4: number;
  byProduct: string;
  byProductVolume: number;
  chemicals: string;
  chemicalsVolume: number;
  additive: string;
  additiveVolume: number;
  device: string;
  lotNumber: string;
}
