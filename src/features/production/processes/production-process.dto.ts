import type { SingleProductionOrder } from "@/features/sales/production-orders/production-order.dto";
import type { SingleRecipe } from "../recipes/recipe.dto";

export interface IProductionJournal {
  _id?: string;
  productionOrder: string;
  recipeId: string;
  produced: number;
  ready: number;
  actualProductionDate: string;
  diff: number;
}

export interface SingleProductionJournal {
  _id?: string;
  productionOrder: SingleProductionOrder;
  recipeId: SingleRecipe;
  produced: number;
  ready: number;
  actualProductionDate: string;
  diff: number;
}

export interface MarkAsPackedDTO {
  productionId: string;
  bruttoWeight: { weight: number; unitType: string };
  nettoWeight: { weight: number; unitType: string };
  numberOfBags: number;
  numberOfPallets: number;
  placementInWarehouse: string;
}
