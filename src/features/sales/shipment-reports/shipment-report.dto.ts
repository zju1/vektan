import type { CurrencyDTO } from "@/features/settings/currencies/currency.dto";
import type { SingleProductionOrder } from "../production-orders/production-order.dto";

export interface IShipmentReport {
  _id?: string;
  invoiceNumber: string;
  shipmentDate: string;
  currentLocation: string;
  updatedDate: string;
  actualDeliveryDate: string;
  numberOfDays: number;
  deliveryExpenses: number;
  deliveryExpensesPerTonn: number;
  currency: CurrencyDTO; // Ref Currency
  productionOrder: SingleProductionOrder;
}

export interface ShipmentReportDTO {
  _id?: string;
  invoiceNumber: string;
  shipmentDate: string;
  currentLocation: string;
  updatedDate: string;
  actualDeliveryDate: string;
  numberOfDays: number;
  deliveryExpenses: number;
  deliveryExpensesPerTonn: number;
  currency: string; // Ref Currency
  productionOrder: string;
}
