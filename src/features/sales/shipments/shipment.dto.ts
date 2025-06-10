import type { SingleProductionOrder } from "../production-orders/production-order.dto";

export type IShipmentStatus = "packed" | "loaded";

export interface SingleShipment {
  _id: string;
  productionOrder: SingleProductionOrder;
  pricePerUnit: number;
  totalPrice: number;
  stateNumberOfTractor: string;
  stateNumberOfTrailer: string;
  status: IShipmentStatus;
}

export interface ShipmentDTO {
  productionOrder: string; // Ref ProductionOrder
  pricePerUnit: number;
  totalPrice: number;
  stateNumberOfTractor: string;
  stateNumberOfTrailer: string;
}
