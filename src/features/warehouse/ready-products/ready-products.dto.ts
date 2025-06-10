import type { SingleProductionOrder } from "@/features/sales/production-orders/production-order.dto";
import type { UnitTypeDTO } from "@/features/settings/unit-types/unit-types.dto";

export type ProducedMaterialStatus = "packed" | "ready_to_ship";

export interface IProducedMaterial {
  productionId: SingleProductionOrder;
  producedDate: string;
  numberOfBags: number;
  numberOfPallets: number;
  nettoWeight: {
    weight: number;
    unitType: UnitTypeDTO;
  };
  bruttoWeight: {
    weight: number;
    unitType: UnitTypeDTO;
  };
  lotNumber: string;
  warehouseId: string;
  placementInWarehouse: string;
  status: ProducedMaterialStatus;
  sticker: string;
}
